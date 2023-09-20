
def curate(articles, database):
    inbox_articles = [article for article in articles if article.feed_name == "inbox"]
    interest_articles = [article for article in articles if article.feed_is_interest]
    other_articles = [article for article in articles if article.feed_name != "inbox" and not article.feed_is_interest]
    
    final_order = inbox_articles + interest_articles + other_articles
    return final_order
    
