import ADMIN from "../models/admindata.js";


export const AdminData =  async (req,res)=>{
    try {
        const admindata = await ADMIN.find();
        res.status(200).json({"message" : admindata})
    } catch (error) {
        res.status(401).send(error)
        console.log("error in userdata controller AdminData controller : ",error)
    }
}
export const OneAdminData =  async (req,res)=>{
    try {
        const id= req.params.id
        const oneadmindata = await ADMIN.find(id);
        res.status(200).json({"message" : oneadmindata})
    } catch (error) {
        res.status(401).send(error)
        console.log("error in userdata controller OneAdminData controller : ",error)
    }
}
export const RegisterAdmin = async (req,res)=>{
    try {
        const {username , age , ph , email , pass} = req.body;
        const newadmin = ADMIN({username , age , ph , email , pass});
        const savedata = await newadmin.save();
        res.status(201).json({"userdata " : savedata})
    } catch (error) {
        console.log("error in usercontroller RegisterAdmin controller",error);
        res.status(404).send(error)
    }
}

export const LoginAdmin = async (req,res)=>{
    try {
        const {login , password} = req.body;
    const Adminverify = await ADMIN.findOne({ $or : [{username : login} , {ph : login}]})
    if(!Adminverify) return res.status(401).send("user not found! please register");
    console.log("user found")
    if(password != Adminverify.pass) return res.status(404).send("incorrect password");
    res.status(200).send("login successfull")
    } catch (error) {
        res.status(500).json({"error : " : error})
        console.log("error in admincontroller file AdminLogin controller : ",error)
    }
    
}

