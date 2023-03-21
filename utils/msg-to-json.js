const paginateMessageToJson = (datas, userId) => {
  const { meta, data } = datas
  const newData = messagesToJson(data, userId)
  return {
    data: newData,
    meta,
  }
}

const messagesToJson = (data, userId) => {
  let listMsg = []
  for (let i = 0; i < data.length; i++) {
    listMsg.push(msgToJson(data[i], userId))
  }
  return listMsg
}

const msgToJson = (message, userId) => {
  const {
    _id,
    sender,
    room,
    task,
    ref_message,
    type,
    text,
    voice,
    url,
    media,
    files,
    read_by,
    created_at,
    updated_at,
  } = message
  let jsonMessage = { _id, room, task}

  if (type) {
    jsonMessage.type = type
  }

  if (sender) {
    const isMe = sender._id == userId

    if (!isMe) {
      jsonMessage.sender = sender
    }

    jsonMessage.is_me = isMe
    if (isMe) {
      jsonMessage.seen = read_by.length > 0
    }
  }

  if (ref_message) {
    jsonMessage.ref_message = msgToJson(ref_message, userId)
  }

  if (text) {
    jsonMessage.text = text
  }

  if (voice) {
    jsonMessage.voice = voice
  }

  if (media && media.length > 0) {
    jsonMessage.media = media
  }

  if (files && files.length > 0) {
    jsonMessage.files = files
  }

  if (url) {
    jsonMessage.url = url
  }

  if (created_at) {
    jsonMessage.created_at = created_at
  }
  if (updated_at) {
    jsonMessage.updated_at = updated_at
  }

  return jsonMessage
}

export { paginateMessageToJson, messagesToJson, msgToJson }
