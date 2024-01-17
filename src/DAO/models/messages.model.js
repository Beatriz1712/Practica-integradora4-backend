import mongoose from "mongoose"

const messageCollection = "messages"

const messageSchema = new mongoose.Schema({
    user: {type: String, max:10, required:true},
    message: {type: String, max:120, required:true},
})

export const messageModel  = mongoose.model(messageCollection, messageSchema)

