import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () =>
            console.log("MongoDB connected.")
        );
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "QuickStay",
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
};

export default connectDB;
