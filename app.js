import axios from "axios";
import express from "express";
import morgan from "morgan";

const app = express(),
  port = process.env.PORT || 8000;

// Middlewares
app.use(morgan("short"));

// Routes
app.get("/", (req, res) => {
  res.send("Hello, Enye BACKEND");
});

app.get("/api/rates", async (req, res) => {
  try {
    let { base, currency } = req.query;

    function filterQuery(arr, data) {
      return Object.keys(data)
        .filter((key) => arr.includes(key))
        .reduce((obj, key) => {
          obj[key] = data[key];
          return obj;
        }, {});
    }

    if (base && currency) {
      base = base.toUpperCase();
      currency = currency.toUpperCase().split(",");
      const api = `https://api.exchangeratesapi.io/latest?base=${base}&currency=${currency}`,
        { data } = await axios.get(api);
      return res
        .status(201)
        .json({ ...data, rates: filterQuery(currency, data.rates) });
    } else {
      const api = "https://api.exchangeratesapi.io/latest",
        { data } = await axios.get(api);
      return res.status(201).json(data);
    }
  } catch (err) {
    res.status(400).json({ status: err.code, message: err.message });
  }
});

//Server
app.listen(port, () =>
  console.log(`Listening on port http://localhost:${port}`)
);
