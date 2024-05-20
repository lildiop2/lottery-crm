import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//aqui vão as variáveis de rotas
import userRoute from "./routes/userRoute.js";

//aplicando CORS
app.use(cors());
//we are configuring dist to serve site files
app.use(express.static(path.join(__dirname, "public")));
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true })); //apenas dados simples
app.use(bodyParser.json({ limit: "50mb" })); // apenas json de entrada no body
app.use(cookieParser());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization,"
  );

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "OPTIONS,GET,POST,PUT,DELETE");
    return res.status(200).send({
      //retorna um objeto vazio
    });
  }
  next();
});

//aqui vão as rotas
// app.use("/", (req, res) => {
//   return res.send("Lottery CRM API");
// });

app.use("/api", userRoute);

// app.use('/api', moderatorRoute);

//quando não encontrar rota, entra aqui
app.use((req, res, next) => {
  const err = new Error("Not found");
  err.status = 404;
  next(err);
});

// handle error, print stacktrace
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ status: err.status, message: err.message });
});

export default app;
