 
import requests
import openai
import os
import math 
import tiktoken
from dotenv import load_dotenv

from google.cloud import texttospeech
from google.oauth2 import service_account
from bs4 import BeautifulSoup

load_dotenv()
openai.api_key = os.getenv("OPENAI_KEY")

class AudioGenerator:

    def __init__(self):
        tiktoken.get_encoding("cl100k_base")
        tiktoken.encoding_for_model("gpt-3.5-turbo")

        credentials = service_account.Credentials.from_service_account_file(os.getenv("GOOGLE_APPLICATION_CREDENTIALS"))
        self.client = texttospeech.TextToSpeechClient(credentials=credentials)

        self.voice = texttospeech.VoiceSelectionParams(
            language_code="en-US",
            ssml_gender=texttospeech.SsmlVoiceGender.MALE,
            name="en-US-Neural2-J",
        )

        self.audio_config = texttospeech.AudioConfig(
            audio_encoding=texttospeech.AudioEncoding.MP3,
            speaking_rate=1.15,
        )

    def get_html(self, url):
        response = requests.get(url)
        return response.text

    def get_title(self, raw_html):
        try:
            soup = BeautifulSoup(raw_html, 'html.parser')
            return soup.find("title").text
        except:
            return "Untitled"
        

    def remove_tags(self, raw_html):
        clean_text = ''
        tag = False
        for char in raw_html:
            if char == '<':
                tag = True
            elif char == '>':
                tag = False
            elif not tag:
                clean_text += char
        return clean_text

    def remove_js_cs(self, raw_html):
        clean_html = ''
        in_tag = False

        i = 0
        while i < len(raw_html):
            if raw_html[i:i+7] == '<script':
                in_tag = True
            elif raw_html[i:i+9] == '</script>':
                in_tag = False
                i += 8
            if raw_html[i:i+6] == '<style':
                in_tag = True
            elif raw_html[i:i+8] == '</style>':
                in_tag = False
                i += 7
            elif not in_tag:
                clean_html += raw_html[i]
            i += 1

        return clean_html


    def remove_line_breaks(self, raw_html):
        return raw_html.replace("\n", "")


 
    def remove_non_alphanumeric(self, text):
        return ''.join(c for c in text if c.isalnum() or c == ',' or c == '.' or c == ' ')

    def generate_summary(self, text, messages, num_chunks=1):
        prompt = (f"Summarize the following text in {min(150, 750/num_chunks)} words or less. Do not write any sentences over 20 words.\n{text}\n\n")
        print("Prompt length is: ", len(prompt))
        messages.append({"role": "user", "content": prompt})
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            temperature=0.5,
            messages=messages,
        )
        resp_body = response.choices[0].message.content.strip()
        # parts = resp_body.split("_debrief_summary: ")
        # print(resp_body)
        # if len(parts) != 2:
        #     print("Error parsing summary")
        #     return "Blank title", resp_body
        
        # title = self.remove_non_alphanumeric(parts[0].split("_debrief_title: ")[1])
        # summary = parts[1]

        return resp_body

    def num_tokens_from_string(self, string: str, encoding_name: str) -> int:
        """Returns the number of tokens in a text string."""
        encoding = tiktoken.get_encoding(encoding_name)
        num_tokens = len(encoding.encode(string))
        return num_tokens

    def chunk_text(self, text):
        token_count = self.num_tokens_from_string(text, "cl100k_base")
        necessary_chunks = math.ceil(float(token_count) / 4096)
        chunks = []
        for i in range(necessary_chunks):
            chunk = text[i*4096: min((len(text)-1),(i+1)*4096)]
            chunks.append(chunk)
        return chunks

    
    def summarize_text(self, text):
        chunks = self.chunk_text(text)
        summary = ""
        messages = []

        if len(chunks) == 0:
            return "Error: No text to summarize"
        elif len(chunks) == 1:
            return self.generate_summary(chunks[0], messages)

        print("Managing ", len(chunks), " chunks")
        for chunk in chunks:
            summary = self.generate_summary(chunk, messages, len(chunks))
            messages.append({"role": "assistant", "content": summary})

        prompt = (f"Please combine all of your previous summaries in 150 words or less")

        total_tokens = 0
        for message in messages:
            total_tokens += self.num_tokens_from_string(message["content"], "cl100k_base")
        
        # If the total tokens is greater than 4096, we need to combine the summaries not the entire convo
        if total_tokens >= 4000:
            print("Merging due to exceding token limit")
            messages = []
            prompt = "Please combine the following summaries into a single paragraph of 150 words or less. Do not write any sentences over 20 words.\n\n"
            for message in messages:
                if message["role"] == "assistant":
                    prompt += message["content"] + "\n\n"

        messages.append({"role": "user", "content": prompt})
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            temperature=0.5,
            messages=messages,
        )
        final_sum = response.choices[0].message.content.strip()
        
        return final_sum

    def synthesize_speech(self, text, output_filename):
        # Set the text input
        input_text = texttospeech.SynthesisInput(text=text)

        response = self.client.synthesize_speech(
            input=input_text, voice=self.voice, audio_config=self.audio_config)
        
        with open(output_filename, "wb") as out:
            out.write(response.audio_content)
            print(f"Audio content written to '{output_filename}'")
    

    def output_title(self, url):
        html = self.get_html(url)
        return self.get_title(html)
    
    
    def output_summary(self, url):
        html = self.get_html(url)
        title = self.get_title(html)
        text = self.remove_js_cs(html)
        text = self.remove_tags(text)
        text = self.remove_line_breaks(text)
        summary = self.summarize_text(text)
        
        output_name = url.replace("https://", "").replace("http://", "").replace("/", "_")
        print("Generating audio for: ", output_name)
        full_descript = ". ".join([title, summary])

        self.synthesize_speech(full_descript, output_name+".mp3")
        return title, summary, output_name+".mp3"


