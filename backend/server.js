import 'dotenv/config';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import app from './app.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const port = process.env.PORT || "8080"
const server = http.createServer(
  app
  );
server.listen(port,() => {
    console.log(`api listening on port ${port}`)
  });

export default server;
