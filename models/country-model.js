import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"

const countrySchema = mongoose.Schema(
  {
    _id: mongoose.Types.ObjectId,
    name: {
      type: String
    },
    code: {
      type: String,
      unique: true
    },
    dial_code: {
      type: String
    }
  },
  {
    versionKey: false
  }
)

countrySchema.plugin(mongoosePaginate)

const Country = mongoose.model("Country", countrySchema)
export default Country
