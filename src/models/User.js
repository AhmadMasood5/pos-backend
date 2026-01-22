import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {type:String , required:true},
    email: {type:String, required:true, unique:true, index:true},
    passwordHash:{type:String, required:true},
    role: {type:String , enum: ['SUPER_ADMIN', 'SHOP_ADMIN'], required:true},
    status:{type:String  , enum:['ACTIVE', 'INACTIVE', 'PENDING'], default:'PENDING'},
    shop:{type:mongoose.Schema.Types.ObjectId, ref:'Shop'},

},
{timestamps:true})

export default mongoose.model('User', userSchema);