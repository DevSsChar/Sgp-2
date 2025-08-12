const mongoose = require("mongoose");

const NodeSchema = new mongoose.Schema(
  {
    target: [String],
    html: String,
    failureSummary: String,
  },
  { _id: false }
);

const ViolationSchema = new mongoose.Schema(
  {
    id: String,
    description: String,
    help: String,
    helpUrl: String,
    impact: String,
  tags: [String],
    nodes: [NodeSchema],
  },
  { _id: false }
);

const ScanReportSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, index: true },
    violations: { type: [ViolationSchema], default: [] },
    scannedAt: { type: Date, default: Date.now },
    meta: {
      passesCount: { type: Number, default: 0 },
      incompleteCount: { type: Number, default: 0 },
      inapplicableCount: { type: Number, default: 0 },
      tags: { type: [String], default: [] },
    },
    // Optional: user scoping if running within app session context
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  },
  { timestamps: true, collection: "scanreports" }
);

ScanReportSchema.index({ url: 1, scannedAt: -1 });

module.exports = mongoose.models.ScanReport || mongoose.model("ScanReport", ScanReportSchema);
