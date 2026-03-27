import { Schema,model } from "mongoose";
import bcrypt from "bcrypt";
const memberSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  dept: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  phone: {
    type: String
  },

  address: {
    type: String
  },

  avatar: {
    type: String, // image URL
    default: null
  },

  password: {
    type: String,
    required: true
  },
  myBooks: [
    {
      type: Schema.Types.ObjectId,
      ref: "Book"
    }
  ],
  memberType: {
    type: String,
    required: true,
    enum: ["Student", "Faculty", "Other"]
  },

  status: {
    type: String,
    default: "Active",
    enum: ["Active", "Inactive", "Blocked"]
  }

}, {
  timestamps: true
});
memberSchema.pre('save', async function () {
    if (!this.isModified("password")) {
        return;
    }
    this.password = await bcrypt.hash(this.password, 10);

});
memberSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password,this.password);
}
export const Member = model("Member", memberSchema);