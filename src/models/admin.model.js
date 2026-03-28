import { Schema,model } from "mongoose";
import bcrypt from "bcrypt";

const adminSchema = new Schema({
    name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
    password: {
        type: String,
        required: true
    }
}, {
  timestamps: true
});

adminSchema.pre('save', async function () {
    if (!this.isModified("password")) {
        return;
    }
    this.password = await bcrypt.hash(this.password, 10);
});
adminSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password,this.password);
}

export const Admin = model("Admin", adminSchema);