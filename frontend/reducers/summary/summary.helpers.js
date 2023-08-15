export const sortArticles = (new_articles) => {
  const output =  [
    ...new_articles.filter(article => article.metadata.read === false).sort((a, b) => {
      return b.metadata.save_time - a.metadata.save_time
    }),
    ...new_articles.filter(article => article.metadata.read === true).sort((a, b) => {
      return b.metadata.save_time - a.metadata.save_time
    })
  ].filter(article => article.metadata.archived === false)
  return output
}

export const updateMetadata = (articles, id, metadata) => {
  for (let i = 0; i < articles.length; i++) {
    if (articles[i].id === id) {
      for (let key in metadata) {
        articles[i].metadata[key] = metadata[key];
      }
    }
  }
  return sortArticles(articles)
}

export const loadArticles = (oldFeed, newFeed, articles, new_articles) => {
  const sorted_new_articles = sortArticles(new_articles)
  
  if (oldFeed.id !== newFeed.id) {
    articles = []
  }

  for (let i = 0; i < sorted_new_articles.length; i++) {
    let exisitng = false
    for (let j = 0; j < articles.length; j++) {
      if (articles[j].id === sorted_new_articles[i].id) {
        exisitng = true
        break
      }
    }
    if (!exisitng) {
      articles.push(sorted_new_articles[i])
    }
  }
  return articles
}

export const changePage = (totalArticles, pageLimit, oldPage, newPage) => {
  if ((Math.ceil(totalArticles / pageLimit)) < (newPage - 1)) {
    return oldPage
  } else if (newPage < 1) {
    return oldPage
  } else {
    return newPage
  }
}

export const resetPage = (curPage, oldFeed, newFeed) => {
  if (oldFeed.id !== newFeed.id) {
    return 1
  } else {
    return curPage
  }
}

export const removeArticle = (articles, id) => {
  return articles.filter(article => article.id !== id)
}