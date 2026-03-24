import {Schema ,model} from "mongoose";
const reviewSchema = new Schema ({
    comment:{
        type:String,
        required:true
    },
    rating:{
        type:Number,
        required:true,
        min:1,
        max:5,
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    
}
,{
        timestamps:true
    }
);

const Review = model("Review",reviewSchema);
export {Review};