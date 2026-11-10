import exprees, { Router } from "express"


import {
    GenerateToken,
    GetPublicQueueStatus ,AdvanceQueue
} from "../controllers/patientcontroller.js";

export const queueroute = exprees.Router();

// queueroute.get("/data", Data)
// queueroute.post("/data:id", OneData)
// queueroute.post("/register", RegisterUser)
// queueroute.post("/userlogin", UserLogin)
// queueroute.put("/data:id", UpdateToken)

// Staff generates patient token
queueroute.post("/generate-token", GenerateToken);

// Patients can view queue without login
queueroute.get("/public-status", GetPublicQueueStatus);

queueroute.put("/advance-queue", AdvanceQueue);