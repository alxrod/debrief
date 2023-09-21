from random import shuffle

def curate(articles, database):
    inbox_articles = [article for article in articles if article.feed_name == "inbox"]
    # interest_articles = [article for article in articles if article.feed_is_interest]
    # other_articles = [article for article in articles if article.feed_name != "inbox" and not article.feed_is_interest]
    other_articles = [article for article in articles if article.feed_name != "inbox"]

    # shuffle(interest_articles)
    shuffle(other_articles)
    final_order = inbox_articles + other_articles
    return final_order
    
