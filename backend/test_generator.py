from ai.feeds.instances.theguardian import TheGuardianFeed

if __name__ == '__main__':
  feed = TheGuardianFeed()
  for f in feed.get_links():
    print(f)