const messageValidator = (req) => {
  const { type, text, ref_message, url } = req.body
  const { voice, media, files } = req.files

  if (!type) {
    return "Type is required"
  }

  if (type < 2 || type > 8) {
    return "Wrong type message. you can input only (2-8)"
  }

  if (type == 2 && !text) {
    return "Text is required"
  }

  if (type == 3 && !ref_message) {
    return "Reference message is required"
  }

  if (type == 4 && !voice) {
    return "Voice is required"
  }

  if (type == 5 && !media) {
    return "Media is required"
  }

  if (type == 6 && !files) {
    return "Files is required"
  }

  if (type == 7 && !url) {
    ;("Url is required")
  }
}

export default messageValidator
