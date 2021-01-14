import axios from "axios";
import express from "express";
import morgan from "morgan";

const app = express(),
  port = process.env.PORT || 8000;

// Middlewares
app.use(morgan("short"));

// Routes
app.get("/", (req, res) => {
  res.send("Hello, Enye");
});

app.get("/api/rates", (req, res) => {
  try {
    const { base, currency, date } = req.query;

    const apiUrl = base
      ? `https://api.exchangeratesapi.io/latest?base=${base}&currency=${currency}`
      : "https://api.exchangeratesapi.io/latest";
    showData(apiUrl);

    async function showData(api) {
      const { data } = await axios.get(api);
      res.status(201).json(data);
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.listen(port, () =>
  console.log(`Listening on port http://localhost:${port}`)
);
