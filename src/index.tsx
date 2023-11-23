import { Elysia, t } from "elysia";
import { html } from "@elysiajs/html";
import { db } from "./db";
import { InsertDailyReceipt, dailyReceipt } from "./db/schema/debts";
import { sql } from "drizzle-orm";

const app = new Elysia()
  .use(html())
  .get("/record-of-debts", () => (
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Praćenje Troškova</title>
        <link
          href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
          rel="stylesheet"
        />
        <script
          src="https://unpkg.com/htmx.org@1.9.9"
          integrity="sha384-QFjmbokDn2DjBjq+fM+8LUIVrAgqcNW2s0PjAxHETgRn9l4fvX31ZxDxvwQnyMOX"
          crossorigin="anonymous"
        ></script>
      </head>
      <body class="bg-gray-100 p-8">
        <div class="max-w-md mx-auto bg-white p-6 rounded-md shadow-md">
          <form xh-swap="none">
            <h1 class="text-2xl font-semibold mb-4">Praćenje Troškova</h1>

            <div class="mb-4">
              <label for="date" class="block text-gray-600 text-sm font-medium">
                Datum
              </label>
              <input
                type="date"
                id="date"
                name="date"
                class="border p-2 w-full"
                required
              />
            </div>

            <div class="mb-4">
              <label
                for="dailyBudget"
                class="block text-gray-600 text-sm font-medium"
              >
                Dnevni budžet:
              </label>
              <input
                type="number"
                id="dailyBudget"
                name="dailyBudget"
                value="550"
                class="border p-2 w-full"
                required
              />
            </div>

            <div class="mb-4">
              <label
                for="numberOfMeals"
                class="block text-gray-600 text-sm font-medium"
              >
                Broj porcija:
              </label>
              <input
                type="number"
                id="numberOfMeals"
                name="numberOfMeals"
                value="1"
                class="border p-2 w-full"
                required
              />
            </div>

            <div class="mb-4">
              <label
                for="dailySpent"
                class="block text-gray-600 text-sm font-medium"
              >
                Potrošeno:
              </label>
              <input
                type="text"
                id="dailySpent"
                name="dailySpent"
                class="border p-2 w-full"
                required
              />
            </div>

            <div class="mb-4">
              <button
                type="submit"
                method="post"
                hx-post="/create"
                xh-swap="none"
                class="bg-blue-500 w-full text-white px-4 py-2 rounded-md"
              >
                Kreiraj
              </button>
            </div>
          </form>

          <div
            class="mb-8"
            hx-get="/difference"
            hx-target="#calculatedDifference"
            hx-swap="innerHTML"
            hx-trigger="load"
          >
            <hr class="my-4" />
            <h2 class="text-xl font-semibold mb-2">Preostali budžet</h2>
            <p
              id="calculatedDifference"
              class="text-lg font-semibold text-green-500"
            >
              -
            </p>
          </div>
        </div>
      </body>
    </html>
  ))
  .post(
    "/create",
    async ({ body: { date, dailyBudget, dailySpent, numberOfMeals } }) => {
      const convertedDate = new Date(`${date}T00:00:00.000Z`);
      const budget = parseFloat(dailyBudget);
      const spent = parseFloat(dailySpent);
      const meals = parseFloat(numberOfMeals);
      console.log(convertedDate);
      const receipRequest = {
        date: convertedDate,
        dailyBudget: budget,
        dailySpent: spent,
        numberOfMeals: meals,
        difference: budget * meals - spent,
      } satisfies InsertDailyReceipt;
      await db.insert(dailyReceipt).values(receipRequest);
    },
    {
      body: t.Object({
        date: t.String(),
        dailyBudget: t.String(),
        dailySpent: t.String(),
        numberOfMeals: t.String(),
      }),
    }
  )
  .get("/difference", async () => {
    const array = await db
      .select({
        count: sql<number>`sum(${dailyReceipt.difference})`,
      })
      .from(dailyReceipt);
    return array[0]["count"];
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
