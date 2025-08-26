import dotenv from "dotenv";
import pkg from "pg";
const { Client } = pkg;

dotenv.config();

async function testConnection() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log("⏳ Connecting to Supabase PostgreSQL...");
    await client.connect();
    console.log("✅ Connected!");

    const res = await client.query("SELECT NOW()");
    console.log("📅 Server time:", res.rows[0]);
  } catch (err) {
    console.error("❌ Query error:", err.message);
  } finally {
    await client.end().catch(() => {}); // safe shutdown
  }
}

// listen for unexpected connection drops
process.on("unhandledRejection", (err) => {
  console.error("⚠️ Unhandled rejection:", err);
});
process.on("uncaughtException", (err) => {
  console.error("⚠️ Uncaught exception:", err);
});

testConnection();
