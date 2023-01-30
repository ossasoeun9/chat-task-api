const urlRegex = /^(http[s]?:\/\/.*?\/[a-zA-Z-_]+.*)$/

const urlExtact = (text) => {
  return text.match(urlRegex)[0]
}
