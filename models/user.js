import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      default: null,
    },
    // Useful analytics
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
    // Quick counters/pointers
    scansCount: {
      type: Number,
      default: 0,
    },
    latestScan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ScanReport",
      default: null,
    },
  },
  { timestamps: true }
);

// Always keep email lowercase
UserSchema.pre("save", function (next) {
  if (this.isModified("email") && typeof this.email === "string") {
    this.email = this.email.toLowerCase().trim();
  }
  next();
});

// Virtual: get all scans for this user without embedding large arrays
UserSchema.virtual("scans", {
  ref: "ScanReport",
  localField: "_id",
  foreignField: "user",
  justOne: false,
});

// Ensure virtuals are included when converting to JSON/objects
UserSchema.set("toJSON", { virtuals: true });
UserSchema.set("toObject", { virtuals: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;