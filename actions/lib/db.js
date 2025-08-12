const mongoose = require("mongoose");
const path = require("path");
const { pathToFileURL } = require("url");

async function connect() {
  if (mongoose.connection.readyState === 1) return;
  const dbModuleUrl = pathToFileURL(path.resolve(__dirname, "../../db/connectDB.mjs")).href;
  const { default: connectDB } = await import(dbModuleUrl);
  await connectDB();
}

async function close() {
  try {
    await mongoose.connection.close();
  } catch {}
}

module.exports = { connect, close };
