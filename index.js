const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config(); // ✅ Make sure this is at the top!

const app = express();
const PORT = 3000;

app.use(cors());

// ✅ Check that .env is loaded and print key on startup
const apiKey = process.env.STOCK_API_KEY;
console.log("🛠️ Server starting...");
console.log("🔑 API key from .env:", apiKey || "❌ NOT FOUND! Check .env file!");

// ✅ Route handler
app.get('/api/stock/:symbol', async (req, res) => {
  const symbol = req.params.symbol;

  console.log("📩 Incoming request for:", symbol);
  console.log("🔐 Using API key:", apiKey);

  if (!apiKey) {
    return res.status(500).json({ error: "API key is missing. Check .env setup." });
  }

  try {
    const response = await axios.get('https://api.twelvedata.com/time_series', {
      params: {
        symbol,
        interval: '1day',
        outputsize: 1,
        apikey: apiKey,
      },
    });

    console.log("✅ API Response:", response.data);
    res.json(response.data);
  } catch (error) {
    console.error("❌ API request failed!");

    if (error.response) {
      console.error("Status Code:", error.response.status);
      console.error("Response Data:", error.response.data);
    } else {
      console.error("Error Message:", error.message);
    }

    res.status(500).json({
      error: "Failed to fetch stock data",
      details: error.response?.data || error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
