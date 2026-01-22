import mongoose from "mongoose";

const LedgerEntrySchema =new mongoose.Schema({
    shop:{type:mongoose.Schema.Types.ObjectId, ref:'Shop', required:true},
    type:{type:String , enum:['debit', 'credit'], required:true},
    amount:{type:Number ,required:true},
    description:{type:String},
    reference:{type:String},
},{timestamps:true})


export default mongoose.model('LedgerEntry', LedgerEntrySchema);