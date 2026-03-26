import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({

user:{
type:mongoose.Schema.Types.ObjectId,
ref:"User"
},

product:{
type:mongoose.Schema.Types.ObjectId,
ref:"Product"
},

rating:Number,

comment:String,

adminReply:{
type:String,
default:""
},

hidden:{
type:Boolean,
default:false
}

},{timestamps:true});

export default mongoose.model("Review",reviewSchema);