import User from "../models/user.js";
import { Webhook } from "svix";
import connectDB from "../configs/db.js";
const clerkwebhooks = async (req, res) => {
    try {
        await connectDB();
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        };
        const payload = whook.verify(req.body, headers);
        const { data, type } = payload;
        console.log("Webhook received:", type);
        const userdata = {
            _id: data.id,
            username: data.first_name + " " + data.last_name,
            email: data.email_addresses?.[0]?.email_address || "",
            image: data.image_url || "",
        };
        switch (type) {
            case "user.created":
                try {
                    await User.create(userdata);
                    console.log("User created");
                } catch (err) {
                    console.error("Error creating user:", err.message);
                }
                break;

            case "user.updated":
                try {
                    await User.findByIdAndUpdate(data.id, userdata);
                    console.log("User updated");
                } catch (err) {
                    console.error("Error updating user:", err.message);
                }
                break;
            case "user.deleted":
                try {
                    const deleted = await User.findByIdAndDelete(data.id);
                    if (deleted) {
                        console.log("User deleted:", deleted._id);
                    } else {
                        console.log("User not found for deletion");
                    }
                } catch (err) {
                    console.error("Error deleting user:", err.message);
                }
                break;
            default:
                console.log("Unhandled webhook type:", type);
                break;
        }
        res.status(200).json({
            success: true,
            message: "Webhook processed successfully",
        });
    } catch (error) {
        console.error("Webhook error:", error.message);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
export default clerkwebhooks;