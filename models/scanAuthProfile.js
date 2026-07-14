const mongoose = require("mongoose");

const ScanAuthProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    origin: { type: String, required: true, index: true },
    method: { type: String, enum: ["credentials", "session"], required: true },
    loginUrl: { type: String, default: "" },
    encryptedPayload: { type: String, required: true },
    lastUsedAt: { type: Date, default: null },
    lastAuthSuccessAt: { type: Date, default: null },
    lastAuthError: { type: String, default: "" },
  },
  { timestamps: true, collection: "scanauthprofiles" }
);

ScanAuthProfileSchema.index({ user: 1, origin: 1 }, { unique: true });

module.exports =
  mongoose.models.ScanAuthProfile || mongoose.model("ScanAuthProfile", ScanAuthProfileSchema);
