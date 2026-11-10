import express from "express"
import { AdminData , OneAdminData , RegisterAdmin , LoginAdmin} from "../controllers/admincontroller.js";

export const admin = express.Router();

admin.get("/admindata", AdminData)
admin.get("/oneadmindata", OneAdminData)
admin.post("/adminregister", RegisterAdmin)
admin.post("/adminlogin", LoginAdmin)
