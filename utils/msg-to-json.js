import dotenv from "dotenv"

dotenv.config()
const apiHost = process.env.API_HOST

const paginateMessageToJson = (datas, userId) => {
    const {meta, data} = datas
    const newData = messagesToJson(data, userId)
    return {
        data: newData,
        meta
    }
}

const messagesToJson = (data, userId) => {
  let listMsg = []
  for(let i=0; i<data.length; i++) {
    listMsg.push(msgToJson(data[i], userId))
  }
  return listMsg
}

const msgToJson = (message, userId) => {
  const {
    _id,
    sender,
    room,
    ref_message,
    type,
    text,
    voice,
    url,
    media,
    files,
    read_by,
    created_at,
    updated_at
  } = message
  let jsonMessage = { _id, type }

  const isMe = sender._id == userId

  if (!isMe) {
    jsonMessage.sender = sender
  }

  jsonMessage.is_me = isMe

  if (ref_message) {
    jsonMessage.ref_message = ref_message
  }

  if (text) {
    jsonMessage.text = text
  }

  if (voice) {
    jsonMessage.voice = voice
    jsonMessage.voice.url = `${apiHost}/voice-messages/${room}/${voice.filename}`
    delete jsonMessage.voice.filename
  }

  if (media && media.length > 0) {
    jsonMessage.media = media
    for(let i = 0; i < jsonMessage.media.length; i++) {
        const element = jsonMessage.media[i]
        jsonMessage.media[i].url = `${apiHost}/media/${room}/${element.filename}`
        delete jsonMessage.media[i].filename
    }
  }

  if (files && files.length > 0) {
    jsonMessage.files = files
    for (let i = 0; i < jsonMessage.files.length; i++) {
      const element = jsonMessage.files[i]
      jsonMessage.files[i].url = `${apiHost}/files/${room}/${element.filename}`
      delete jsonMessage.files[i].filename
    }
  }

  if (url) {
    jsonMessage.url = url
  }

  if (isMe) {
    jsonMessage.seen = read_by.length > 0
  }

  jsonMessage.create_at = created_at,
  jsonMessage.update_at = updated_at

  return jsonMessage
}

export {paginateMessageToJson, messagesToJson, msgToJson}