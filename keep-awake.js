// keep-awake.js
import axios from "axios";

const BACKEND_URL = "https://chat-backend-dhh7.onrender.com/health"; // your Render backend health URL

const ping = async () => {
  try {
    const res = await axios.get(BACKEND_URL);
    console.log(`${new Date().toLocaleTimeString()} - Ping successful ✅`);
  } catch (err) {
    console.error(`${new Date().toLocaleTimeString()} - Ping failed ❌`, err.message);
  }
};

// Ping every 5 minutes (300000 ms)
setInterval(ping, 300000);

// Ping immediately on start
ping();

