import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },


  ph: String,

  token: {
    type: Number,
    required: true
  },

  tokenDate: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: ["waiting", "serving", "completed"],
    default: "waiting"
  }
}, { timestamps: true });

patientSchema.index(
  { tokenDate: 1, token: 1 },
  { unique: true }
);

const PATIENT = mongoose.model("PATIENT", patientSchema);

export default PATIENT;