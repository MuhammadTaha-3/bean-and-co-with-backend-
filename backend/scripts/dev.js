const { spawn } = require("node:child_process");
const http = require("node:http");
const path = require("node:path");

const port = Number(process.env.PORT || 4000);
const url = `http://localhost:${port}`;

function checkExistingServer() {
  return new Promise((resolve, reject) => {
    const request = http.get(url, (response) => {
      const chunks = [];
      response.on("data", (chunk) => chunks.push(chunk));
      response.on("end", () => {
        const body = Buffer.concat(chunks).toString();
        const isThisBackend =
          response.headers["x-powered-by"] === "Next.js" ||
          body.includes('"service":"bean-and-co-backend"');

        if (isThisBackend) {
          resolve(true);
        } else {
          reject(new Error(`Port ${port} is already used by another service.`));
        }
      });
    });

    request.setTimeout(10000, () => {
      request.destroy(new Error(`Timed out checking ${url}.`));
    });

    request.on("error", (error) => {
      if (error.code === "ECONNREFUSED") {
        resolve(false);
      } else {
        reject(error);
      }
    });
  });
}

async function start() {
  try {
    if (await checkExistingServer()) {
      console.log(`Backend is already running at ${url}`);
      return;
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
    return;
  }

  const nextCli = path.join(__dirname, "..", "node_modules", "next", "dist", "bin", "next");
  const server = spawn(process.execPath, [nextCli, "dev", "-p", String(port)], {
    stdio: "inherit",
  });

  for (const signal of ["SIGINT", "SIGTERM"]) {
    process.on(signal, () => server.kill(signal));
  }

  server.on("error", (error) => {
    console.error(`Could not start the backend: ${error.message}`);
    process.exitCode = 1;
  });

  server.on("close", (code, signal) => {
    process.exitCode = code ?? (signal ? 1 : 0);
  });
}

start();
