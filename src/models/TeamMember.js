import mongoose from "mongoose";

const TeamMemberSchema = new mongoose.Schema({
    shop:{type:mongoose.Schema.Types.ObjectId , ref:'Shop', required:true},
    name:{type:String , required:true},
    role:{type:String, default:"staff"},
    phone:{type:String},
},{timestamps:true})


export default mongoose.model('TeamMember', TeamMemberSchema)