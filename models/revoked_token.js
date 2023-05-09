import mongoose from "mongoose"

const revokedTokenSchema = mongoose.Schema(
  {
    access_token: String,
    refresh_token: String,
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    },
    versionKey: false
  }
)

const RevokedToken = mongoose.model("Revoked Tokens", revokedTokenSchema)
export default RevokedToken