
def curate(articles, database):
    inbox_articles = [article for article in articles if article.feed_name == "inbox"]
    other_articles = [article for article in articles if article.feed_name != "inbox"]
    
    final_order = inbox_articles + other_articles
    return final_order
    