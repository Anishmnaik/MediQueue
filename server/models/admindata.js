import mongoose from "mongoose";

const admindata = new mongoose.Schema({
    username: {
        type: String,
        require: true
    },
    pass: {
        type: String,
        require: true
    },
    ph: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    }
}, { timestamps: true })

const ADMIN = mongoose.model("ADMIN", admindata)
export default ADMIN