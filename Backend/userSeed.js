import User from "./modules/User.js";
import bcrypt from "bcryptjs";
import connectDB from "./db/db.js";

const userRegister = async () => {
    connectDB();
    try {
        const hashedPassword = await bcrypt.hash("admin123", 10);
        const adminUser = new User({
            name: "Admin",
            email: "connect@superteacher.in",
            password: hashedPassword,
            role: "admin",
        });
        await adminUser.save();
     } catch (error) {
        console.log(error);
    }
}

userRegister();