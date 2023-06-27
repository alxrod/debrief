import imaplib
import email
from dotenv import dotenv_values
import re

 

def parse_links(text):
  link_regex = re.compile('((https?):((//)|(\\\\))+([\w\d:#@%/;$()~_?\+-=\\\.&](#!)?)*)', re.DOTALL)
  reged = re.findall(link_regex, text)
  links = []
  for lnk in reged:
    links.append(lnk[0])
  return links

def read_email_from_gmail(email_name, password):
  
  mail = imaplib.IMAP4_SSL('imap.gmail.com')
  mail.login(email_name, password)
  mail.select('inbox')

  result, data = mail.search(None, '(UNSEEN)')
  mail_ids = data[0]
  if (len(mail_ids) == 0):
    return {}

  id_list = mail_ids.split()   

  mail_bodies = {}
  for i in id_list:
    result, data = mail.fetch(i.decode("utf-8"), '(RFC822)' )

    for response_part in data:
      if isinstance(response_part, tuple):
        # from_bytes, not from_string
        msg = email.message_from_bytes(response_part[1])
        body = ""

        if msg.is_multipart():
          for part in msg.walk():
              ctype = part.get_content_type()
              cdispo = str(part.get('Content-Disposition'))

              # skip any text/plain (txt) attachments
              if ctype == 'text/plain' and 'attachment' not in cdispo:
                  body = part.get_payload(decode=True)  # decode
                  break
        # not multipart - i.e. plain text, no attachments, keeping fingers crossed
        else:
          body = msg.get_payload(decode=True)

        sender = email.utils.parseaddr(msg['From'])[1]
        if sender in mail_bodies:
          mail_bodies[sender].append(body.decode("utf-8"))
        else:
          mail_bodies[sender] = parse_links(body.decode("utf-8"))
  return mail_bodies