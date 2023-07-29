from ai.feeds.instances.theverge import TheVergeFeed

if __name__ == '__main__':
  feed = TheVergeFeed()
  for f in feed.get_links():
    print(f)