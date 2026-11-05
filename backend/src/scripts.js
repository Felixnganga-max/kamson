require("dotenv").config({ path: require("path").resolve(__dirname, ".env") });
const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");

// ── Inline Admin schema (no import needed) ────────────────────
const adminSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role:     { type: String, default: "superadmin" },
  active:   { type: Boolean, default: true },
}, { timestamps: true });

const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema);

// ── Args: node scripts.js <name> <email> <password> ──────────
const [,, name, email, password] = process.argv;

if (!name || !email || !password) {
  console.error("Usage: node scripts.js <name> <email> <password>");
  process.exit(1);
}

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");

    const exists = await Admin.findOne({ email });
    if (exists) {
      console.log(`Admin with email ${email} already exists`);
      process.exit(0);
    }

    const hashed = await bcrypt.hash(password, 12);
    const admin  = await Admin.create({ name, email, password: hashed, role: "superadmin" });

    console.log(`✓ Admin created successfully`);
    console.log(`  Name:  ${admin.name}`);
    console.log(`  Email: ${admin.email}`);
    console.log(`  Role:  ${admin.role}`);
    process.exit(0);
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

createAdmin();