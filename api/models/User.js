const mongoose = require('mongoose')

const collection = 'Users' // collection name

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true }
  },
  { timestamps: true }
)

const UserModel = mongoose.model(collection, UserSchema);

module.exports = UserModel;