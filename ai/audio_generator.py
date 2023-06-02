 
import requests
import openai
import os
import math 
import tiktoken
from dotenv import load_dotenv

from google.cloud import texttospeech
from google.oauth2 import service_account

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

    
    def count_tokens(self, text):
        response = openai.Completion.create(
        engine="davinci-codex",
        prompt=f"Please count the number of tokens in the following text:\n{text}\n\nNumber of tokens:",
        max_tokens=1,
        n=1,
        stop=None,
        temperature=0.7,
        )
        count = response.choices[0].text.strip()
        return count

    def remove_line_breaks(self, raw_html):
        return raw_html.replace("\n", "")


    def generate_summary(self, text, messages):
        prompt = (f"Please summarize the following text in 250 words:\n{text}\n\n")
        messages.append({"role": "user", "content": prompt})
        response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        temperature=0.5,
        messages=messages,
        )
        summary = response.choices[0].message.content.strip()
        return summary

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

        for chunk in chunks:
            summary = self.generate_summary(chunk, messages)
            messages.append({"role": "assistant", "content": summary})

        prompt = (f"Please combine all of your previous summaries in 200 words or less")
        messages.append({"role": "user", "content": prompt})
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            temperature=0.5,
            messages=messages,
        )
        summary = response.choices[0].message.content.strip()

        return summary

    def synthesize_speech(self, text, output_filename):
        # Set the text input
        input_text = texttospeech.SynthesisInput(text=text)

        response = self.client.synthesize_speech(
            input=input_text, voice=self.voice, audio_config=self.audio_config)
        
        with open(output_filename, "wb") as out:
            out.write(response.audio_content)
            print(f"Audio content written to '{output_filename}'")
    
    def output_summary(self, url):
        html = self.get_html(url)
        text = self.remove_js_cs(html)
        text = self.remove_tags(text)
        text = self.remove_line_breaks(text)
        summary = self.summarize_text(text)
        
        output_name = url.replace("https://", "").replace("http://", "").replace("/", "_")
        self.synthesize_speech(summary, output_name+".mp3")


