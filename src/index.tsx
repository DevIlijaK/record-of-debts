import { Elysia } from "elysia";
import { html } from "@elysiajs/html";

const app = new Elysia()
  .use(html())
  .get(
    "/html",
    () => `
            <html lang='en'>
                <head>
                    <title>Hello World</title>
                </head>
                <body>
                    <h1>Hello World</h1>
                </body>
            </html>`
  )
  .get("/jsx", () => (
    <html lang="en">
      <head>
        <title>Hello World</title>
      </head>
      <body>
        <h1>Evide</h1>
      </body>
    </html>
  ))
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
