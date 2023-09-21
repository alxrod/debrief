import requests
import os

from bs4 import BeautifulSoup, SoupStrainer


def is_number(s):
  try:
      int(s)
      return True
  except ValueError:
      return False
        
def feed_viability(url):
  res = requests.get(url)
  content = res.content.decode()
  with open('response_content.txt', 'w') as file:
    file.write(content)
  
  soup = BeautifulSoup(content, 'html.parser')

  links = [a['href'] for a in soup.find_all('a', href=True)]
  links = list(set(links))
  return links

if __name__ == "__main__":
  links = feed_viability(input("home url: "))
  print(len(links))
  for l in links:
    print(l)