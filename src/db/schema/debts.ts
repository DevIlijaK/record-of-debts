import { integer, real, sqliteTable } from "drizzle-orm/sqlite-core";

// export const dailyBudget = sqliteTable("daily_budget", {
//   id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
//   dailyBudget: real("daily_budget").notNull(),
// });
export const dailyReceipt = sqliteTable("daily_receipt", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  date: integer("date", { mode: "timestamp" }).notNull(),
  dailyBudget: real("daily_budget").notNull(),
  dailySpent: real("daily_spent").notNull(),
  numberOfMeals: integer("number_of_meals").notNull(),
  difference: real("difference").notNull(),
});
// export type InsertBudget = typeof dailyBudget.$inferInsert;

export type InsertDailyReceipt = typeof dailyReceipt.$inferInsert;
export type SelectDailyReceipt = typeof dailyReceipt.$inferSelect;
