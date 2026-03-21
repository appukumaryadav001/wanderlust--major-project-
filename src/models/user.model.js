import { Schema,model } from "mongoose";
import bcrypt from "bcrypt";
const userSchema = new Schema({
            username:{
                type:String,
                required:true,
            },
            email:{
                type:String,
                required:true,
                unique:true
            },
            password:{
                type:String,
                required:true,
            },
            avatar:{
                type:String
            }
},{
    timestamps:true
}
);

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        return next();
    }

    this.password = await bcrypt.hash(this.password,10);
});

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password);
}

const User = model("User",userSchema);
export {User};