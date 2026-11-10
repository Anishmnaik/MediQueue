import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
    _id: String,
    sequence: {
        type: Number,
        default: 0
    }
});

const TOKENCOUNTER = mongoose.model(
    "TOKENCOUNTER",
    counterSchema
);

export default TOKENCOUNTER;