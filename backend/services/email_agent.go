package services

import (
	"context"
	"errors"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"math/rand"
	"os"
	"regexp"

	"time"

	"crypto/tls"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"

	"github.com/TwiN/go-color"
	db "github.com/alxrod/boiler/db"
	"github.com/google/uuid"

	imap "github.com/emersion/go-imap"
	imapClient "github.com/emersion/go-imap/client"
	imapMail "github.com/emersion/go-message/mail"
	gomail "gopkg.in/mail.v2"

	proto "github.com/alxrod/boiler/proto"
)

var letters = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")

type Email struct {
	Recipient string
	Subject   string
	BodyType  string
	Body      string
}

type TempLink struct {
	id         uuid.UUID
	link       string
	expiration time.Time
	user_id    primitive.ObjectID
	user_email string
}

type EmailAgent struct {
	Database   *mongo.Database
	Config     *tls.Config
	ImapClient *imapClient.Client

	SenderEmail string
	Password    string
	RootURL     string

	ResetLinks []*TempLink

	INTERVAL_TIME uint32

	NotificationEmail string

	AIConn   *grpc.ClientConn
	AIClient proto.GenerateClient
}

func (agent *EmailAgent) Initialize(config *tls.Config, db *mongo.Database) error {
	agent.Database = db
	agent.Config = config

	agent.SenderEmail = os.Getenv("EMAIL")
	agent.NotificationEmail = os.Getenv("NOTIFICATION_EMAIL")
	agent.Password = os.Getenv("EMAIL_PWORD")
	agent.RootURL = os.Getenv("FRONTEND_URL")
	log.Printf("Email agent username %s password %s", agent.SenderEmail, agent.Password)
	// Intervals
	agent.INTERVAL_TIME = 1

	cli, err := agent.connectToServer()
	agent.ImapClient = cli
	if err != nil {
		return err
	}

	agent.AIConn, err = grpc.Dial("localhost:50051", grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatalf("failed to connect to ai server: %v", err)
	}
	agent.AIClient = proto.NewGenerateClient(agent.AIConn)

	go func() {
		log.Printf("Set up Email Fetching")
		for {
			agent.fetchEmails()
			time.Sleep(time.Second * 5)
		}
	}()

	rand.Seed(time.Now().UnixNano())

	return nil
}

func (agent *EmailAgent) connectToServer() (*imapClient.Client, error) {
	server := "imap.gmail.com"
	port := 993
	c, err := imapClient.DialTLS(fmt.Sprintf("%s:%d", server, port), nil)
	if err != nil {
		return nil, err
	}

	if err := c.Login(agent.SenderEmail, agent.Password); err != nil {
		return nil, err
	}

	return c, nil
}

func (agent *EmailAgent) fetchEmails() error {
	// Select the mailbox you want to read
	_, err := agent.ImapClient.Select("INBOX", false)
	if err != nil {
		return err
	}
	criteria := imap.NewSearchCriteria()
	criteria.WithoutFlags = []string{"\\Seen"}
	uids, err := agent.ImapClient.Search(criteria)
	if err != nil {
		log.Println(err)
	}
	seqset := new(imap.SeqSet)
	seqset.AddNum(uids...)
	section := &imap.BodySectionName{}
	items := []imap.FetchItem{imap.FetchEnvelope, imap.FetchFlags, imap.FetchInternalDate, section.FetchItem()}
	log.Println(uids)

	// If no new emails, dont fetch anything
	if len(uids) == 0 {
		return nil
	}

	messages := make(chan *imap.Message, 1)
	go func() {
		if err := agent.ImapClient.Fetch(seqset, items, messages); err != nil {
			log.Fatal(err)
		}
	}()

	// Unpack all of the unread emails
	for id := range uids {
		msg := <-messages
		if msg == nil {
			log.Println(color.Ize(color.Red, fmt.Sprintf("Could not find email w uid %v", id)))
		}

		r := msg.GetBody(section)
		if r == nil {
			log.Println(color.Ize(color.Red, fmt.Sprintf("Could not find body for email w uid %v", id)))
		}

		// Create a new mail reader
		mr, err := imapMail.CreateReader(r)
		if err != nil {
			log.Fatal(err)
		}

		// Print some info about the message
		header := mr.Header
		msg_sender, err := header.AddressList("From")
		if err != nil {
			log.Println(color.Ize(color.Red, fmt.Sprintf("Could not parse sender for email w uid %v", id)))
		}

		user, err := db.ServerUserQuery(msg_sender[0].Address, agent.Database)
		if err != nil {
			continue
		}

		p, err := mr.NextPart()
		if err == io.EOF {
			continue
		} else if err != nil {
			log.Println(color.Ize(color.Red, fmt.Sprintf("Mail Parsing Error %v", err)))
		}

		found_body := false
		for found_body == false {
			switch p.Header.(type) {
			case *imapMail.InlineHeader:
				found_body = true
			default:
				p, err = mr.NextPart()
				if err == io.EOF {
					found_body = true
				}
			}
		}
		b, _ := ioutil.ReadAll(p.Body)
		urls := agent.parseUrlsFromString(string(b))
		for _, url := range urls {
			website, err := db.WebsiteInsert(url, user.Id, agent.Database)
			if err != nil {
				log.Printf("Error inserting %s for link %s", err, website)
				continue
			}
			agent.AIClient.Summarize(context.Background(), website.Proto())
			log.Println(color.Ize(color.Green, fmt.Sprintf("Saved %s's website: %s", user.Email, website.RawLink)))
		}
	}
	return nil
}

func (agent *EmailAgent) parseUrlsFromString(s string) []string {
	urls := []string{}
	r := regexp.MustCompile(`(https?://[^\s]+)`)
	matches := r.FindAllString(s, -1)
	for _, match := range matches {
		urls = append(urls, match)
	}
	return urls
}

func (agent *EmailAgent) GenerateInviteSecret() string {
	b := make([]rune, 30)
	for i := range b {
		b[i] = letters[rand.Intn(len(letters))]
	}
	return string(b)
}

func (agent *EmailAgent) StartExpirationChecker() {
	go agent.CheckExpirations()
}

func (agent *EmailAgent) CheckExpirations() {
	for {
		remaining_links := make([]*TempLink, 0)
		for _, link := range agent.ResetLinks {
			if link.expiration.Before(time.Now()) {
				remaining_links = append(remaining_links, link)
			}
		}
		time.Sleep(time.Minute * time.Duration(agent.INTERVAL_TIME))
	}
}

func (agent *EmailAgent) CheckResetId(reset_id uuid.UUID) bool {
	exists := false
	for _, link := range agent.ResetLinks {
		if link.id == reset_id {
			exists = true
		}
	}
	return exists
}

func (agent *EmailAgent) GetUserId(reset_id uuid.UUID) (primitive.ObjectID, error) {
	for _, link := range agent.ResetLinks {
		if link.id == reset_id {
			return link.user_id, nil
		}
	}
	return primitive.ObjectID{}, errors.New("invalid reset id")
}

func (agent *EmailAgent) SendEmail(email *Email) error {
	m := gomail.NewMessage()

	log.Printf("Sending email to %s", email.Recipient)

	m.SetHeader("From", agent.SenderEmail)
	m.SetHeader("To", email.Recipient)
	m.SetHeader("Subject", email.Subject)
	m.SetBody(email.BodyType, email.Body)

	d := gomail.NewDialer("smtp.gmail.com", 587, agent.SenderEmail, agent.Password)
	d.TLSConfig = agent.Config

	if err := d.DialAndSend(m); err != nil {
		fmt.Println(err)
		return err
	}
	return nil
}

func (agent *EmailAgent) CreateResetLink(user *db.User) (string, error) {
	new_id := uuid.New()
	new_link := &TempLink{
		id:         new_id,
		link:       fmt.Sprintf("/reset-password/%s", new_id.String()),
		user_id:    user.Id,
		user_email: user.Email,
		expiration: time.Now().Add(time.Minute * 5),
	}

	if err := agent.SendResetEmail(new_link); err != nil {
		return "", err
	}

	exists := false
	for idx, link := range agent.ResetLinks {
		if link.user_id == user.Id {
			agent.ResetLinks[idx] = new_link
			exists = true
		}
	}
	if !exists {
		agent.ResetLinks = append(agent.ResetLinks, new_link)
	}
	return new_link.link, nil
}

func (agent *EmailAgent) SendResetEmail(link *TempLink) error {
	email := &Email{
		Recipient: link.user_email,
		Subject:   "Boiler Password Reset",
		BodyType:  "text/plain",
		Body: fmt.Sprintf(
			"Click this link to reset your password: \n %s%s",
			agent.RootURL,
			link.link,
		),
	}
	if err := agent.SendEmail(email); err != nil {
		return err
	}
	return nil
}

func (agent *EmailAgent) SendNotificationEmail(title string, body string) {
	if os.Getenv("NOTIFICATIONS_ON") == "false" {
		return
	}
	go func(agent *EmailAgent, title string, body string) {
		email := &Email{
			Recipient: agent.NotificationEmail,
			Subject:   fmt.Sprintf("[BOILER] %s", title),
			BodyType:  "text/plain",
			Body:      body,
		}
		agent.SendEmail(email)
	}(agent, title, body)
}
