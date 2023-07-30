from ai.feeds.instances.theguardian import TheGuardianFeed

if __name__ == '__main__':
  feed = TheGuardianFeed()
  print(feed.get_links())