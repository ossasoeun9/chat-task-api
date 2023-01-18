import Contact from "../models/contact-model.js"

const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({ owner: req.user._id }).populate(
      "user",
      [
        "username",
        "phone_number",
        ,
        "first_name",
        "last_name",
        "profile_url",
        "is_online",
        "latest_online",
        "bio",
      ]
    )
    res.json(contacts)
  } catch (error) {
    return res.status(500).json({
      message: error
    })
  }
}

const createContact = async (req, res) => {
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
  })

  if (oldContact) {
    oldContact.first_name = first_name || oldContact.first_name
    oldContact.last_name = last_name || oldContact.last_name
    await oldContact.save()
    return res.json(oldContact)
  }

  try {
    const contact = await Contact.create({ phone_number, owner: _id })
    return res.json(contact)
  } catch (error) {
    return res.status(500).json({
      message: error
    })
  }
}

const syncContacts = (req, res) => {
  res.send("Sync Contact")
}

const editContact = (req, res) => {
  res.send("Edit Contact")
}

const deleteContact = (req, res) => {
  res.send("Delete Contact")
}

const blockContact = (req, res) => {
  res.send("block Contact")
}

const getBlockedContacts = (req, res) => {
  res.send("Blocked Contact List")
}

export {
  getContacts,
  createContact,
  syncContacts,
  editContact,
  deleteContact,
  blockContact,
  getBlockedContacts
}
