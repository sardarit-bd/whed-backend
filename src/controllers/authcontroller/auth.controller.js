import bcrypt from "bcryptjs";
import { createOrUpdateOTP, createUser, deleteOTPByEmail, getOTPByEmail, getUserByEmail, getUserByLogin, incrementPasswordError, updateLoginSession, updateUserPassword } from "../../services/auth.service.js";
import generateToken from "../../utils/generateToken.js";
import { generateOTP, sendEmail } from "../../utils/optsender.js";

const registerUser = async (req, res) => {
  try {
    // req.validatedBody theke 'status' o destructure kore nin
    const {
      login, pass, mail, nom, prenom, role, status, language,
      organisme, adresse, cp, ville, pays, tel, fax, web, titre, fonction
    } = req.validatedBody;

    const userExistsByMail = await getUserByEmail(mail);
    const userExistsByLogin = await getUserByLogin(login);

    if (userExistsByMail || userExistsByLogin) {
      return res.status(409).json({ success: false, message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(pass, salt);

    const result = await createUser({
      login,
      pass: hashedPassword,
      mail,
      nom,
      prenom,
      role,
      status, // Ekhane status pass korte hobe
      language,
      organisme,
      adresse,
      cp,
      ville,
      pays,
      tel,
      fax,
      web,
      titre,
      fonction,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: result.id,
        login,
        mail,
        nom,
        prenom,
        token: generateToken(result.id, `${prenom} ${nom}`, mail, role || 'user'),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { login, pass } = req.validatedBody;

    const user = await getUserByLogin(login);

    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    if (user.status === 0) {
      return res.status(403).json({ success: false, message: "Account is inactive. Please contact support." });
    }

    const isPasswordValid = await bcrypt.compare(pass, user.pass);
    if (!isPasswordValid) {
      // Increment password error count
      await incrementPasswordError(user.UserID);
      return res.status(401).json({ success: false, message: "Invalid login or password" });
    }


    // Update database after successful login
    await updateLoginSession(user.UserID);

    res.json({
      success: true,
      message: "User logged in successfully",
      data: {
        UserID: user.UserID,
        login: user.login,
        mail: user.mail,
        nom: user.nom,
        prenom: user.prenom,
        role: user.role,
        token: generateToken(user.UserID, `${user.prenom} ${user.nom}`, user.mail, user.role, user.login),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

const logoutUser = async (req, res) => {

  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });

    return res.status(200).json({
      success: true,
      message: "User logged out successfully.",
    });
  } catch (err) {
    console.error("Logout error:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error while logging out.",
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { mail } = req.validatedBody;

    const user = await getUserByEmail(mail);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    console.log("User found for forgot password:", user);

    const otp = generateOTP();

    console.log(`Generated OTP for ${user.mail}: ${otp}`);
    console.log('Sending OTP email...');


    await sendEmail(user.mail, otp);

    await createOrUpdateOTP({ otp, mail: user.mail, UserID: user.UserID });

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (err) {
    console.error("Forgot password error:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error while processing forgot password.",
    });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { login, pass } = req.validatedBody;
    const email = login;
    const otp = pass;

    const saveOtp = await getOTPByEmail(email);
    if (!saveOtp || saveOtp.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "OTP does not match",
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (err) {
    console.error("Verify OTP error:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error while verifying OTP.",
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { reset_pass: otp, new_pass, confirm_pass } = req.validatedBody;

    const saveOtp = await getOTPByEmail(req.body.mail || req.body.email);
    if (!saveOtp) {
      return res.status(400).json({
        success: false,
        message: "OTP not found",
      });
    }

    if (saveOtp.otp != otp) {
      return res.status(400).json({
        success: false,
        message: "OTP does not match",
      });
    }

    const user = await getUserByEmail(saveOtp.email);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(new_pass, salt);

    await updateUserPassword(user.mail, hashedPassword);
    await deleteOTPByEmail(user.mail);

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (err) {
    console.error("Change password error:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error while changing password.",
    });
  }
};

export { changePassword, forgotPassword, loginUser, logoutUser, registerUser, verifyOTP };
