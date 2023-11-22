import { Elysia } from "elysia";
import { html } from "@elysiajs/html";
import { db } from "./db";
import { dailyBudget } from "./db/schema";
import { InsertBudget } from "./db/schema/debts";

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
  .get("set-daily-budget/:budget", async ({ params: { budget } }) => {
    const insert = {
      dailyBudget: Number(budget),
    } satisfies InsertBudget;
    console.log("Uslo je ovde! ");
    await db.insert(dailyBudget).values(insert);
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
