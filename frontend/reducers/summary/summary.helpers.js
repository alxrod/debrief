
export const updateMetadata = (articles, id, metadata) => {
  for (let i = 0; i < articles.length; i++) {
    if (articles[i].id === id) {
      articles[i].metadata = metadata;
    }
  }
  return articles
}

