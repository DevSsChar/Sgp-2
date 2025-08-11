import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    FullName: {
        type: String,
        required: true,
    },
    Email: {
        type: String,
        required: true,
        unique: true,
    },
    Age: {
        type: Number,
    },
    Location: {
        type: String,
    },
    Degree: {
        type: String,
    },
    Institution: {
        type: String,
    },
    GraduationYear: {
        type: Number,
    },
    Grade: {
        type: Number,
    },
    Company: {
        type: String,
    },
    Position: {
        type: String,
    },
    Duration: {
        type: Date,
    },
    Description: {
        type: String,
    },
    Skills: {
        type: String,
    },
    SoftSKills: {
        type: String,
    },
    Languages: {
        type: String,
    },
    Interests: {
        type: String,
    },
    // githubId: {
    //     type: String,
    //     unique: true,
    // },
    selectedCareers: {
        type: [String],
        default: [],
    },
    mobileVerified: {
        type: Boolean,
        default: false,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;