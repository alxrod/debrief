import requests
import os
from bs4 import BeautifulSoup, SoupStrainer

from ai.feeds.feed_object import FeedObject
import time

class HackerNewsFeed(FeedObject):
    def fetch(self):
        links = []

        for i in range(2):
            
            retry = True    
            while retry:
                try:
                    res = requests.get('https://news.ycombinator.com/?p='+str(i))
                    retry = False
                except:
                    time.sleep(0.020)


            only_td = SoupStrainer('td')
            soup = BeautifulSoup(res.content, 'html.parser', parse_only=only_td)
            tdtitle = soup.find_all('td', attrs={'class':'title'})
            tdmetrics = soup.find_all('td', attrs={'class':'subtext'})
            
            tdtitle = soup.find_all('td', attrs={'class':'title'})
            tdrank = soup.find_all('td', attrs={'class':'title', 'align':'right'})
            tdtitleonly = [t for t in tdtitle if t not in tdrank]
            tdmetrics = soup.find_all('td', attrs={'class':'subtext'})
            tdt = tdtitleonly
            tdr = tdrank
            tdm = tdmetrics
            num_iter = min(len(tdr), len(tdt))

            for idx in range(num_iter):
                rank = tdr[idx].find('span', attrs={'class':'rank'})
                titl = tdt[idx].find('a', attrs={'class':''})
                url = titl['href'] if titl and titl['href'].startswith('https') else 'https://news.ycombinator.com/'+titl['href']
                site = tdt[idx].find('span', attrs={'class':'sitestr'})
                score = tdm[idx].find('span', attrs={'class':'score'})
                time = tdm[idx].find('span', attrs={'class':'age'})
                author = tdm[idx].find('a', attrs={'class':'hnuser'})
                if url and "Show HN" not in titl.text and "Ask HN" not in titl.text:
                    links.append(url)

        # Patch for now!
        return links[:10]
    


if __name__ == '__main__':
    fetcher = HackerNewsFetcher()
    urls = fetcher.fetch()
    print(urls)
