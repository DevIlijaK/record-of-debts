import { integer, real, sqliteTable } from "drizzle-orm/sqlite-core";

export const dailyBudget = sqliteTable("daily_budget", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  dailyBudget: real("daily_budget").notNull(),
});
