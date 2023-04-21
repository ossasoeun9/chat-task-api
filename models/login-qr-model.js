import mongoose from "mongoose"
import User from "./user-model.js";
import mongooseAutoPopulate from "mongoose-autopopulate";

const loginQRCodeSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true
        },
        expire_in: {
            type: Date,
            required: true,
            default: Date.now,
            expires: 60
        },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at"
        },
        versionKey: false
    });

loginQRCodeSchema.plugin(mongooseAutoPopulate)

const LoginQRCode = mongoose.model('loginQRCode', loginQRCodeSchema);

const LoginQR = await LoginQRCode.createCollection();
export default LoginQR