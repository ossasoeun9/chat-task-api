import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const country = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    name: {
        type: String
    },
    code: {
        type: String,
        unique: true,
    },
    dial_code: {
        type: String,
    }
})

country.plugin(mongoosePaginate)

const Country = mongoose.model('Country', country)
export default Country