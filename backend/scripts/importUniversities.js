require("dotenv").config();

const mongoose = require("mongoose");
const XLSX = require("xlsx");
const path = require("path");
const University = require("../models/University");

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected for importing data...");

    const filePath = path.join(
      __dirname,
      "data",
      "Edufindfinals.xlsx"
    );

    const workbook = XLSX.readFile(filePath);
    const worksheet = workbook.Sheets["Sheet1"];

    if (!worksheet) {
      throw new Error("Sheet1 tidak ditemukan!");
    }

    const universities = XLSX.utils.sheet_to_json(worksheet);

    console.log(`Found ${universities.length} universities`);

    const operations = universities.map((university) => ({
      updateOne: {
        filter: { kode_pt: Number(university.kode_pt) },
        update: { $set: university },
        upsert: true
      }
    }));

    const result = await University.bulkWrite(operations);

    console.log("Import completed!");
    console.log("Inserted:", result.upsertedCount);
    console.log("Updated:", result.modifiedCount);

    await mongoose.disconnect();
    process.exit(0);

  } catch (error) {
    console.error("Import failed:", error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

importData();
