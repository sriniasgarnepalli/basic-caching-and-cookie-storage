import express from "express";
import cookieParser from "cookie-parser";

const app = express();
const PORT = 5002;

app.use(cookieParser());
app.use(express.json());

const cache = {};

const checkCache = (req, res, next) => {
  const { key } = req.params;
  if (cache[key]) {
    return res.send({ data: cache[key], source: "cache" });
  }
  next();
};

app.get("/set-cookie/:key", (req, res) => {
  const { key } = req.params;
  const value = `value for ${key}`;
  res.cookie(key, value, { maxAge: 900000, httpOnly: true });
  res.send(`Cookie set: ${key}=${value}`);
});

app.get("/data/:key", checkCache, (req, res) => {
  const { key } = req.params;

  // Simulating data fetching (this could be from a database)
  const value = `Value for ${key}`;

  // Cache the data
  cache[key] = value;

  res.send({ data: value, source: "database" });
});

app.get("/cookies", (req, res) => {
  res.send(req.cookies);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
