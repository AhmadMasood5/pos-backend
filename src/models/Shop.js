import mongoose from "mongoose";

const shopSchema = new mongoose.Schema({
    name:{type:String , required:true},
    address:{type:String},
    isActive:{type: Boolean, default:true}
},{timestamps:true})

export default mongoose.model('Shop', shopSchema)