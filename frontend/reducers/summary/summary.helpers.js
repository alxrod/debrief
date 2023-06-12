
export const toggleFlag = (websites, website_id, name, status) => {
  for (let i = 0; i < websites.length; i++) {
    if (websites[i].id === website_id) {
      websites[i][name] = status
    }
  }
  return websites
}

