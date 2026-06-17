import "dotenv/config";
import connectDB from "../src/config/db.js";
import User from "../src/models/User.js";

const [, , emailArg, passwordArg, nameArg = "Admin"] = process.argv;

const email = emailArg?.trim().toLowerCase();
const password = passwordArg;
const name = nameArg.trim() || "Admin";

if (!email || !password) {
  console.error(
    "Usage: npm.cmd run create-admin -- admin@example.com password123 \"Admin Name\""
  );
  process.exit(1);
}

if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  console.error("Please provide a valid email address.");
  process.exit(1);
}

if (password.length < 6) {
  console.error("Password must be at least 6 characters.");
  process.exit(1);
}

try {
  await connectDB();

  let user = await User.findOne({ email }).select("+password +tokenVersion");

  if (user) {
    user.name = user.name || name;
    user.password = password;
    user.role = "admin";
    user.isBlocked = false;
    user.isDeleted = false;
    user.tokenVersion = (user.tokenVersion || 0) + 1;
    await user.save();
    console.log(`Admin updated: ${email}`);
  } else {
    user = await User.create({
      name,
      email,
      password,
      role: "admin",
    });
    console.log(`Admin created: ${user.email}`);
  }

  process.exit(0);
} catch (err) {
  console.error("Failed to create admin:", err.message);
  process.exit(1);
}
