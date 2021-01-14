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

app.get("/api/rates", async (req, res) => {
  try {
    let { base, currency } = req.query;

    // Check if query parameters were passed
    if (base && currency) {
      const api = `https://api.exchangeratesapi.io/latest?base=${base}&currency=${currency}`;
      const { data } = await axios.get(api);

      // split currencies into an array
      let arrOfCurrencies = currency.split(",");

      const filtered = Object.keys(data.rates)
        .filter((key) => arrOfCurrencies.includes(key))
        .reduce((obj, key) => {
          obj[key] = data.rates[key];
          return obj;
        }, {});
      return res.status(201).json({ ...data, rates: filtered });
    } else {
      const api = "https://api.exchangeratesapi.io/latest";
      const { data } = await axios.get(api);
      return res.status(201).json(data);
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.listen(port, () =>
  console.log(`Listening on port http://localhost:${port}`)
);
