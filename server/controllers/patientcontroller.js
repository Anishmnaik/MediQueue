import PATIENT from "../models/patientdata.js";
import TOKENCOUNTER from "../models/tokencounter.js";



// Generate patient token
export const GenerateToken = async (req, res) => {
  try {
    // Get patient details from frontend
    const { name, mobile } = req.body;

    // Check whether name and mobile number are provided
    if (!name || !mobile) {
      return res.status(400).json({
        success: false,
        message: "Patient name and mobile number are required"
      });
    }

    // Generate the next token number
    const counter = await TOKENCOUNTER.findByIdAndUpdate(
      "patient-token",
      { $inc: { sequence: 1 } },
      {
        returnDocument: "after",
        upsert: true,
        setDefaultsOnInsert: true
      }
    );

    // Get today's date
    const today = new Date().toISOString().split("T")[0];

    // Save patient details in MongoDB
    const patient = await PATIENT.create({
name: name.trim(),
      ph: mobile.trim(),
      token: counter.sequence,
      tokenDate: today,
      status: "waiting"
    });

    // Send successful response to frontend
    return res.status(201).json({
      success: true,
      message: "Token generated successfully",
      patient: {
name: patient.name,
        mobile: patient.ph,
        token: patient.token,
        tokenDate: patient.tokenDate,
        status: patient.status
      }
    });

  } catch (error) {
    console.log("Token generation error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to generate token",
      error: error.message
    });
  }
};



// Complete current patient and call the next patient
export const AdvanceQueue = async (req, res) => {
    try {

        // Find the currently serving patient
        const currentPatient = await PATIENT.findOne({
            status: "serving"
        });

        // Mark current patient as completed
        if (currentPatient) {
            currentPatient.status = "completed";
            await currentPatient.save();
        }

        // Find the first patient waiting in the queue
        const nextPatient = await PATIENT.findOne({
            status: "waiting"
        }).sort({ token: 1 });

        // If nobody is waiting
        if (!nextPatient) {
            return res.status(200).json({
                success: true,
                message: currentPatient
                    ? "Patient completed. No patients are waiting."
                    : "No patients are waiting.",
                currentToken: null
            });
        }

        // Change the next patient's status to serving
        nextPatient.status = "serving";
        await nextPatient.save();

        return res.status(200).json({
            success: true,
            message: "Next patient called successfully",
            currentToken: nextPatient.token
        });

    } catch (error) {

        console.log("Advance queue error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to advance queue"
        });
    }
};



export const GetPublicQueueStatus = async (req, res) => {
    try {

        // Find currently serving patient
        const currentPatient = await PATIENT.findOne({
            status: "serving"
        }).sort({ token: 1 });

        // Find all waiting patients
        const waitingPatients = await PATIENT.find({
            status: "waiting"
        }).sort({ token: 1 });

        // Calculate estimated waiting time
        const patients = waitingPatients.map((patient, index) => {

            const waitTime = (
                index + (currentPatient ? 1 : 0)
            ) * 10;

            return {
                tokenNumber: patient.token,
                queuePosition: index + 1,
                estimatedWaitMinutes: waitTime,
                status: patient.status
            };
        });

        return res.status(200).json({

            success: true,

            currentToken: currentPatient
                ? { tokenNumber: currentPatient.token }
                : null,

            nextToken: waitingPatients[0]
                ? { tokenNumber: waitingPatients[0].token }
                : null,

            waitingCount: waitingPatients.length,

            patients: patients

        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            message: "Unable to get queue details"
        });

    }
};