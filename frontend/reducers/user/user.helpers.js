
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
