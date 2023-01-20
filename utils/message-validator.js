const messageValidator = (req) => {
  const { message_type, text, ref_message, url } = req.body
  const { voice, media, files } = req.files

  if (!message_type) {
    return "Type is required"
  }

  if (message_type < 2 || message_type > 8) {
    return "Wrong type message. you can input only (2-8)"
  }

  if (message_type == 2 && !text) {
    return "Text is required"
  }

  if (message_type == 3 && !ref_message) {
    return "Reference message is required"
  }

  if (message_type == 4 && !voice) {
    return "Voice is required"
  }

  if (message_type == 5 && !media) {
    return "Media is required"
  }

  if (message_type == 6 && !files) {
    return "Files is required"
  }

  if (message_type == 7 && !url) {
    ;("Url is required")
  }
}

export default messageValidator
