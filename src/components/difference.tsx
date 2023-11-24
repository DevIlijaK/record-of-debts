import { sql } from "drizzle-orm";
import { db } from "../db";
import { dailyReceipt } from "../db/schema";

export const Difference = async () => {
  const array = await db
    .select({
      count: sql<number>`sum(${dailyReceipt.difference})`,
    })
    .from(dailyReceipt);
  return (
    <div
      class="mb-8"
      hx-get="/difference"
      hx-target="#calculatedDifference"
      hx-swap="innerHTML"
      hx-trigger="load"
    >
      <hr class="my-4" />
      <h2 class="text-xl font-semibold mb-2">Preostali budžet</h2>
      <p id="calculatedDifference" class="text-lg font-semibold text-green-500">
        {array[0]["count"]}
      </p>
    </div>
  );
};
