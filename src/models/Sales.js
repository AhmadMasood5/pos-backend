import mongoose from "mongoose";

const salesSchema =new mongoose.Schema({
    shop:{type:mongoose.Schema.Types.ObjectId, ref:'Shop', required:true},
    items:[{
        product:{type:mongoose.Schema.Types.ObjectId , ref:'Product', required:true },
        quantity:{type:Number ,required:true},
        price:{type:Number ,required:true}
    }],
    total:{type:Number ,required:true},
    paymentmethod:{type:String , enum:['cash', 'credit'], default:'cash'},
    customerName:{type:String},

},{timestamps:true})

export default mongoose.model('Sale', salesSchema);