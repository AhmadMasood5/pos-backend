import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    shop:{type:mongoose.Schema.Types.ObjectId, ref:'Shop', required:true},
    name:{type:String, required:true},
    sku:{type:String , index:true},
    unit:{type:String, default:'bag'},
    price:{type:Number, required:true},
    stock:{type:Number , default:0},
},{timestamps:true})

export default mongoose.model('Product', productSchema)