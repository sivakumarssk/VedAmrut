const app = require("./app");
const pool = require("./config/db");

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await pool.query("SELECT NOW()");
    console.log("✅ PostgreSQL Connected Successfully");

    app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://192.168.0.112:${PORT}`);
});
  } catch (error) {
    console.error("❌ Database Connection Failed");
    console.error(error.message);
  }
}

startServer();