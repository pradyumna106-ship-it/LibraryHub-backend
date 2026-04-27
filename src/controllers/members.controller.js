import { connectDB } from "../config/database.js";
import { Member } from "../models/members.model.js";
import { InternalServerError, notFoundInDatabase } from "../utils/response.js";
import { validateAllFields } from "../utils/validate.js";

async function addMember(req, res) {
    try {
        const { name, email, password } = req.body; // ✅ no avatar here

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Required fields are missing" });
        }

        await connectDB();

        const existingUser = await Member.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // ✅ Single declaration of avatar
        let avatar = "";
        if (req.file) {
            avatar = req.file.filename;
        } else if (typeof req.body.avatar === "string") {
            avatar = req.body.avatar;
        }

        const member = await Member.create({ ...req.body, avatar });
        res.status(201).json({ message: "Member Added Successfully", member });

    } catch (error) {
        console.error(error);
        InternalServerError(error, res);
    }
}

async function updateMember(req,res) {
    try {
        const { isValid, missingFields } = validateAllFields(req.body);
                if (!isValid) {
                    return res.status(400).json(missingField(missingFields));
                }
        await connectDB();
        const member = await Member.findByIdAndUpdate(req.params.id,req.body,{new: true})
        if (!member) return notFoundInDatabase(res, "Member");
        res.status(200).json({
            message:"Member Updated Successfully", member
        })
    } catch (error) {
        InternalServerError(error,res);
    }
}
async function getMembers(req,res) {
    try {
        await connectDB();
        const members = await Member.find({});
        if (!members) return notFoundInDatabase(res, "Member");
        res.send(members);
    } catch (error) {
        InternalServerError(error,res)
    }
}

async function getMemberById(req,res) {
    try {
        await connectDB();
        const member = await Member.findById(req.params.id);
        if (!member) return notFoundInDatabase(res, "Member");
        res.send(member);
    } catch (error) {
       return InternalServerError(error,res);
    }
}
async function getMemberByEmail(req,res) {
    try {
        await connectDB();
        const member = await Member.findOne({email:req.params.email.toLowerCase()});
        if (!member) return notFoundInDatabase(res, "Member");
        res.send(member);
    } catch (error) {
       return InternalServerError(error,res);
    }
}
async function deleteMember(req,res) {
    try {
        await connectDB();
        const member = await Member.findByIdAndDelete(req.params.id);
        if (!member) return notFoundInDatabase(res, "Member");
        res.status(200).json({
            message: "Deleted Successfully",
            member
        })
    } catch (error) {
        return InternalServerError(error,res);
    }
}

async function loginMember(req,res) {
    try {
        const { email, password } = req.body;
        if(!email || !password){
            return res.status(400).json({
                message:"Email and Password required"
            });
        }
        await connectDB();
        const user = await Member.findOne({ email: email });
        if(!user){
            return res.status(404).json({
                message:"User not found"
            });
        }
        const isMatch = await user.comparePassword(password);
        if(!isMatch){
            return res.status(401).json({
                message:"Invalid credentials"
            });
        }
        res.status(200).json({
            message:"Login successful",
            member:{
                id:user._id,
                username:user.username,
                email:user.email
            }
        });
        } catch(error){
            return InternalServerError(error,res);
    }
};
async function getMyBooks(req, res) {
  try {
    const { id } = req.params; // ✅ FIX 1

    if (!id) {
      return res.status(400).json({ message: "memberId is required" });
    }
    await connectDB();
    // ✅ Populate books
    const member = await Member.findById(id).populate("myBooks");

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    // ✅ FIX 2: use member.myBooks instead of books

    res.send(member.myBooks);

  } catch (error) {
    return InternalServerError(error, res);
  }
}

async function getMemberCount(req,res) {
    try {
        await connectDB();
        const books = await Member.countDocuments({});
        if (!books) return notFoundInDatabase(res, "Book");
         res.send(books);
        // res.status(200).json({
        //     message: "success fully sent data",
        //     books
        // })
    } catch (error) {
       return InternalServerError(error,res);
    }
}

async function addMyBooks(req, res) {
  try {
    const { id } = req.params;
    const { bookId } = req.body; // ✅ array

    // if (!id || !bookId || !Array.isArray(bookId)) {
    //   return res.status(400).json({
    //     message: "memberId and bookIds (array) are required"
    //   });
    // }
    await connectDB();
    const member = await Member.findById(id);

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    // ✅ Remove duplicates

    // ✅ Add only new books
    member.myBooks.push(bookId);
    // ✅ Save
    await member.save();
    // ✅ Populate
    await member.populate("myBooks");

    res.status(200).json({
    message: "Books added to MyBooks successfully",
    data: member.myBooks
    });

  } catch (error) {
    console.error(error)
    return InternalServerError(error, res);
  }
}
async function deleteMyBooks(req, res) {
  try {
    const { id } = req.params;
    const { bookId } = req.body; // ✅ array

    // if (!id || !bookId || !Array.isArray(bookId)) {
    //   return res.status(400).json({
    //     message: "memberId and bookIds (array) are required"
    //   });
    // }
    await connectDB();
    const member = await Member.findById(id);

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    // ✅ Remove duplicates

    // ✅ Add only new books
        member.myBooks = member.myBooks.filter(
            (b) => b.toString() !== bookId
            );
    
    // ✅ Save
    await member.save();
    // ✅ Populate
    await member.populate("myBooks");

    res.status(200).json({
    message: "Books added to MyBooks successfully",
    data: member.myBooks
    });

  } catch (error) {
    console.error(error)
    return InternalServerError(error, res);
  }
}


export {
    addMember,
    updateMember,
    getMembers,
    getMemberById,
    deleteMember,
    loginMember,
    getMemberByEmail,
    getMyBooks,
    addMyBooks,
    getMemberCount,
    deleteMyBooks
}