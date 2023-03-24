import JSONStream from "JSONStream"
import Heading from "../models/heading-model.js"
import Task from "../models/task-model.js"

const getHeadings = (req, res) => {
  const { latest_timestamp } = req.query
  const { roomId } = req.params
  let query = {
    room: roomId
  }
  if (latest_timestamp) {
    query.updated_at = { $gte: latest_timestamp, $ne: latest_timestamp }
  }
  if (latest_timestamp) {
    Heading.findWithDeleted(query)
      .sort({ created_at: -1 })
      .cursor()
      .pipe(JSONStream.stringify())
      .pipe(res.type("json"))
  } else {
    Heading.find(query)
      .sort({ created_at: -1 })
      .cursor()
      .pipe(JSONStream.stringify())
      .pipe(res.type("json"))
  }
}

const createHeading = async (req, res) => {
  const { label, room_id } = req.body
  if (!label || !room_id) {
    return res.status(400).json({ message: "Label and Room id is required" })
  }
  try {
    const heading = await Heading.create({ label, room: room_id })
    return res.json(heading)
  } catch (error) {
    return res.status(500).json({ message: error })
  }
}

const editHeading = async (req, res) => {
  const { label } = req.body
  const { headingId } = req.params
  if (!label) {
    return res.status(400).json({ message: "Label is required" })
  }
  try {
    const heading = await Heading.findById(headingId)
    if (heading) {
      heading.label = label
      await heading.save()
    }
    return res.json(heading)
  } catch (error) {
    return res.status(500).json({ message: error })
  }
}

const deleteHeading = async (req, res) => {
  const { headingId } = req.params
  try {
    const heading = await Heading.findById(headingId)
    if (heading) {
      await Heading.delete({ _id: headingId })
      await Task.updateMany({ heading: headingId }, { heading: null })
    }
    return res.json({ message: "deleted" })
  } catch (error) {
    return res.status(500).json({ message: error })
  }
}

export { getHeadings, createHeading, editHeading, deleteHeading }
