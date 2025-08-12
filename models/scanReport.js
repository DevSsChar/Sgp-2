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
    impact: String, // critical|serious|moderate|minor|needs-review
    description: String,
    help: String,
    helpUrl: String,
    tags: { type: [String], default: [] },
    nodes: { type: [NodeSchema], default: [] },
  },
  { _id: false }
);

const PageResultSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    scannedAt: { type: Date, default: () => new Date() },
    violations: { type: [ViolationSchema], default: [] },
    meta: {
      passesCount: { type: Number, default: 0 },
      incompleteCount: { type: Number, default: 0 },
      inapplicableCount: { type: Number, default: 0 },
      tags: { type: [String], default: [] },
    },
  },
  { _id: false }
);

const SummarySchema = new mongoose.Schema(
  {
    pages: { type: Number, default: 0 },
    totalNodes: { type: Number, default: 0 },
    totalRules: { type: Number, default: 0 },
    byImpactNodes: {
      critical: { type: Number, default: 0 },
      serious: { type: Number, default: 0 },
      moderate: { type: Number, default: 0 },
      minor: { type: Number, default: 0 },
      "needs-review": { type: Number, default: 0 },
    },
    byCategoryNodes: {
      perceivable: { type: Number, default: 0 },
      operable: { type: Number, default: 0 },
      understandable: { type: Number, default: 0 },
      robust: { type: Number, default: 0 },
    },
    topRules: {
      type: [
        {
          id: String,
          nodes: Number,
        },
      ],
      default: [],
    },
  },
  { _id: false }
);

const ScanReportSchema = new mongoose.Schema(
  {
    reportId: { type: String, required: true, unique: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    baseUrl: { type: String, required: true, index: true },
    startedAt: { type: Date, default: () => new Date() },
    finishedAt: { type: Date },
    pages: { type: [PageResultSchema], default: [] },
    summary: { type: SummarySchema, default: () => ({}) },
  },
  { timestamps: true, collection: "scanreports" }
);

ScanReportSchema.index({ user: 1, createdAt: -1 });
ScanReportSchema.index({ baseUrl: 1, createdAt: -1 });

module.exports = mongoose.models.ScanReport || mongoose.model("ScanReport", ScanReportSchema);
