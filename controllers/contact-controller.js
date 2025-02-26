import JSONStream from "JSONStream"
import Contact from "../models/contact-model.js"
import User from "../models/user-model.js"

const hideContactFiled = "-owner -is_blocked -created_at -updated_at"
const hideUserFiled = "-created_at -country"

const getContacts = async (req, res) => {
  const { _id } = req.user
  const { latest_timestamp } = req.query

  let query = {
    owner: _id,
    updated_at: { $gte: latest_timestamp, $ne: latest_timestamp }
  }

  if (!latest_timestamp) {
    delete query.updated_at
  }

  try {
    Contact.find(query)
      .sort({ updated_at: "asc" })
      .populate("user")
      .cursor()
      .pipe(JSONStream.stringify())
      .pipe(res.type("json"))
  } catch (error) {
    return res.status(500).json({
      message: error
    })
  }
}

const getContactDetail = async (req, res) => {
  const { id } = req.params
  try {
    const contact = await Contact.findById(id)
      .select(hideContactFiled)
      .populate("user", hideUserFiled)
    return res.json(contact)
  } catch (error) {
    return res.status(500).json({
      message: error
    })
  }
}

const createOrEditContact = async (req, res) => {
  const { _id } = req.user
  const { phone_number, first_name, last_name } = req.body
  if (!phone_number) {
    return res.status(400).json({
      message: "Phone number is required"
    })
  }

  const oldContact = await Contact.findOne({
    owner: _id,
    phone_number
  }).populate("user")

  if (oldContact) {
    oldContact.first_name = first_name || oldContact.first_name
    oldContact.last_name = last_name
    await oldContact.save()
    return res.json(oldContact)
  }

  try {
    let contact = await Contact.create({
      phone_number,
      first_name,
      last_name,
      owner: _id
    })
    contact = await Contact.findById({ _id: contact._id }).populate("user")
    return res.json(contact)
  } catch (error) {
    return res.status(500).json({
      message: error
    })
  }
}

const scanQR = async (req, res) => {
  const { _id } = req.user
  const { username } = req.body
  if (!username) {
    return res.status(400).json({
      message: "QR Code is required"
    })
  }

  const user = await User.findOne({ username: username })

  if (user == null) {
    return res.status(400).json({
      message: "User Not Found"
    })
  }

  const oldContact = await Contact.findOne({
    owner: _id,
    phone_number: user.phone_number
  }).populate("user")

  if (oldContact) {
    return res.json(oldContact)
  }

  try {
    let contact = await Contact.create({
      phone_number: user.phone_number,
      first_name: user.first_name,
      last_name: user.last_name,
      owner: _id
    })
    contact = await Contact.findById({ _id: contact._id }).populate("user")
    return res.json(contact)
  } catch (error) {
    return res.status(500).json({
      message: error
    })
  }
}

const syncContacts = async (req, res) => {
  const { contacts } = req.body
  if (!contacts) {
    return res.status(400).json({
      message: "Contacts field is required"
    })
  }

  const contactsJson = JSON.parse(contacts)

  if (!Array.isArray(contactsJson)) {
    return res.status(400).json({
      message: "Contacts field must be array or list"
    })
  }

  for (let i = 0; i < contactsJson.length; i++) {
    const { phone_number } = contactsJson[i]
    contactsJson[i].owner = req.user._id
    if (!phone_number) {
      return res.status(400).json({
        message: "Some object has not phone number field"
      })
    }
  }

  try {
    const result = await Contact.insertMany(contactsJson, { ordered: false })
    return res.json({
      inserted_ids: result.map((e) => e._id)
    })
  } catch (error) {
    return res.json({
      inserted_ids: error.insertedDocs.map((e) => e._id)
    })
  }
}

const deleteContact = async (req, res) => {
  const { id } = req.params
  try {
    const result = await Contact.deleteOne({ _id: id })
    const isDeleted = result.deletedCount > 0
    return res.status(isDeleted ? 200 : 400).json({
      message: isDeleted ? "Contact is deleted successfuly" : "Wrong contact id"
    })
  } catch (error) {
    return res.status(500).json({
      message: error || "Something when wrong"
    })
  }
}

const blockContact = async (req, res) => {
  const { id } = req.params
  try {
    const result = await Contact.findById(id)
    const { is_blocked } = result
    result.is_blocked = is_blocked ? false : true
    result.save()
    res.json({
      is_blocked: !is_blocked
    })
  } catch (error) {
    res.status(500).json({
      message: error || "Something when wrong"
    })
  }
}

const getBlockedContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({
      owner: req.user._id,
      is_blocked: true
    })
      .select(hideContactFiled)
      .populate("user", hideUserFiled)
    return res.json(contacts)
  } catch (error) {
    return res.status(500).json({
      message: error
    })
  }
}

export {
  getContacts,
  getContactDetail,
  createOrEditContact,
  syncContacts,
  deleteContact,
  blockContact,
  scanQR
}
