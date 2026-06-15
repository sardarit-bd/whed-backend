import bcrypt from "bcryptjs";
import { getTotalUsers, getUserById, getUsers, updateUserById } from "../../services/user.service.js";


const getAllUsers = async (req, res) => {

  try {

    const allUsers = await getUsers();


    // if no users found, return 404
    if (!allUsers || allUsers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users found"
      });
    }


    res.json({
      success: true,
      message: "Users fetched successfully",
      data: allUsers,
    });

  } catch (error) {
    console.error("Error in getAllUsers:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }

};


const getUser = async (req, res) => {

  const { id } = req.params;

  try {

    // authrization check: only admin or the user themselves can access this endpoint and ensure id is number
    // if (req.user.role !== 1 && Number(req.user.id) !== Number(id)) {
    //   return res.status(403).json({
    //     success: false,
    //     message: "Access forbidden: You do not have permission to view this profile"
    //   });
    // }

    const user = await getUserById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      message: "User fetched successfully",
      data: user
    });

  } catch (error) {

    console.error("Error in getUser:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });

  }


};



const updateUser = async (req, res) => {
  const { id } = req.params;
  const updateData = { ...req.validatedBody }; // Joi validated and whitelisted data

  try {
    // ১. অথরাইজেশন চেক: শুধু অ্যাডমিন অথবা নিজের প্রোফাইল আপডেট করা যাবে
    // ধরে নিচ্ছি admin এর role value 1
    // if (req.user.role !== 1 && Number(req.user.id) !== Number(id)) {
    //   return res.status(403).json({ success: false, message: "Access forbidden: You do not have permission to edit this profile" });
    // }

    // ২. সিকিউরিটি: নন-অ্যাডমিনদের জন্য রোল বা পাসওয়ার্ড আপডেট বন্ধ করা
    // if (req.user.role !== 1) {
    //   delete updateData.role;
    //   delete updateData.pass; // আপনার টেবিলের ফিল্ড নাম 'pass'
    // }

    // ৩. পাসওয়ার্ড হ্যাশিং (যদি আপডেট করার জন্য পাসওয়ার্ড দেওয়া হয়)
    if (updateData.pass) {
      const salt = await bcrypt.genSalt(10);
      updateData.pass = await bcrypt.hash(updateData.pass, salt);
    }

    // ৪. ডাটা আপডেট করা
    const result = await updateUserById(id, updateData);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "User not found or no changes made" });
    }

    res.json({
      success: true,
      message: "User updated successfully"
    });
  } catch (error) {
    console.error("Error in updateUser:", error);

    // ইউনিক ফিল্ড ডুপ্লিকেট হলে এরর হ্যান্ডলিং (যেমন: mail, login)
    if (error.errno === 1062 || error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ success: false, message: "Username (login) or email already exists" });
    }

    res.status(500).json({ success: false, message: "Internal server error" });
  }

};



const deleteUser = async (req, res) => {
  const { id } = req.params;




  // must be write delete controller here
  // Befeour delete user must be delete all relational tasks as need



  res.json({
    success: true,
    message: "User Delete successfully"
  });



};



/*********** modules export from here ************/
export {
  deleteUser, getAllUsers,
  getUser, updateUser
};

