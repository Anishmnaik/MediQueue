import express from "express"
import dotenv from "dotenv"
import {queueroute} from "./routes/patientroute.js"
import { connectdb } from "./config/db.js";
import { admin } from "./routes/adminroute.js";
import cors from "cors";


dotenv.config();

const app = express();

connectdb();
app.use(express.json())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use("/adminapi" , admin)
app.use("/queueapi", queueroute);

const PORT = process.env.PORT;

app.listen(PORT , ()=>{
    console.log("server is live at  ",PORT);
})