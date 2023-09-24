
export const addFeed = (feeds, feed) => {
  let found = false;
  for (let i = 0; i < feeds.length; i++) {
    if (feeds[i].id === feed.id) {
      found = true;
    }
  }
  
  if (!found) {
    return [...feeds, feed]
  }

  return feeds
}

export const deleteFeed = (feeds, feed_id) => {
  console.log("Deleting feed: ", feed_id)
  const newFeeds = feeds.filter(feed => feed.id !== feed_id)
  console.log("New feeds: ", newFeeds)
  return newFeeds
}


export const changeInterestQueryContent = (feeds, change) => {
  for (let i = 0; i < feeds.length; i++) {
    if (feeds[i].id === change.feed_id) {
      feeds[i].query_content = change.query_content
      feeds[i].unique_name = change.unique_name
    }
  }
  return feeds
}

export const changeInterestPrivateStatus = (feeds, change) => {
  for (let i = 0; i < feeds.length; i++) {
    if (feeds[i].id === change.feed_id) {
      feeds[i].private = change.private
    }
  }
  return feeds
}
