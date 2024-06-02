import {Elysia, t} from "elysia";
import {html} from "@elysiajs/html";
import {db} from "./db";
import {InsertDailyReceipt, dailyReceipt} from "./db/schema/debts";
import {sql} from "drizzle-orm";
import {BaseHtml} from "./components/base-html";
import {DebtForm} from "./components/debt-form";
import {Difference} from "./components/difference";
import {TimeNumberOfMeals} from "./components/time-number-of-meals";
import {staticPlugin} from '@elysiajs/static'

const app = new Elysia()
    .use(html())
    .use(staticPlugin())
    .get("/record-of-debts", () => {
        const date = new Date().toISOString().split("T")[0];

        return (
            <BaseHtml>
                <div class="max-w-md mx-auto bg-white p-6 rounded-md shadow-md">
                    <div>
                        <DebtForm date={date}/>
                        <Difference/>
                    </div>
                </div>
            </BaseHtml>
        );
    })
    .ws('/ws', {
        open(ws) {
            ws.send(`<div id="testiranje" class="bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div class="bg-green-500 h-full rounded-full" style="width: 80%;"></div>
                    </div>`)
        },
        message(ws, message) {

            ws.send(`<div class="bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div class="bg-blue-500 h-full rounded-full" style="width: 50%;"></div>
                    </div>`)
        }
    })
    .get("/test", () => {
        return (
            <BaseHtml>
                <div class="container mx-auto px-4">
                    <div>
                        Ovo radi kako treba
                    </div>
                    <div id="progressbarContainer">
                        <div id="progresbar">

                        </div>

                    </div>
                </div>
                {/*<div*/}
                {/*    hx-ext="ws"*/}
                {/*    ws-connect="/ws"*/}
                {/*    class="w-full max-w-md mx-auto">*/}

                {/*</div>*/}

                <div class="w-full max-w-md mx-auto p-4">
                    <div class="relative pt-1">
                        <div class="flex mb-2 items-center justify-between">
                            <div>
                                <span
                                    class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                                    Task Progress
                                </span>
                            </div>
                            <div class="text-right">
                                 <span class="text-xs font-semibold inline-block text-blue-600">
                                     50%
                                 </span>
                            </div>
                        </div>
                        <div id="testiranje" class="bg-gray-200 rounded-full h-4 overflow-hidden">
                            <div class="bg-green-500 h-full rounded-full" style="width: 20%;"></div>
                        </div>
                    </div>
                </div>


            </BaseHtml>
        );
    })
    .get("/example", () => {
        return (
            <BaseHtml>
                <div class="max-w-md mx-auto bg-white p-6 rounded-md shadow-md">
                    <div class="flex flex-wrap">
                        <div class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-4">
                            <div class="bg-white rounded-lg overflow-hidden shadow-md">
                                <div class="p-4">
                                    <h2 class="text-xl font-semibold mb-2">Card 1</h2>
                                    <p class="text-gray-600">Property 1: Lorem ipsum</p>
                                    <p class="text-gray-600">Property 2: Dolor sit amet</p>
                                    <p class="text-gray-600">
                                        Property 3: Consectetur adipiscing
                                    </p>
                                    <p class="text-gray-600">Property 4: Sed do eiusmod</p>
                                </div>
                            </div>
                        </div>
                        <div class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-4">
                            <div class="bg-white rounded-lg overflow-hidden shadow-md">
                                <div class="p-4">
                                    <h2 class="text-xl font-semibold mb-2">Card 3</h2>
                                </div>
                            </div>
                        </div>

                        <div class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-4">
                            <div class="bg-white rounded-lg overflow-hidden shadow-md">
                                <div class="p-4">
                                    <h2 class="text-xl font-semibold mb-2">Card 4</h2>
                                </div>
                            </div>
                        </div>

                        <div class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-4">
                            <div class="bg-white rounded-lg overflow-hidden shadow-md">
                                <div class="p-4">
                                    <h2 class="text-xl font-semibold mb-2">Card 5</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </BaseHtml>
        );
    })
    .get("/example2", () => {
        const month = new Date().toLocaleString("default", {month: "long"});
        return (
            <BaseHtml>
                <TimeNumberOfMeals month={month}/>
            </BaseHtml>
        );
    })
    .post(
        "/create",
        async ({body: {date, dailyBudget, dailySpent, numberOfMeals}}) => {
            const convertedDate = new Date(`${date}T00:00:00.000Z`);
            // const budget = parseFloat(dailyBudget);
            console.log(convertedDate);
            const receipRequest = {
                date: convertedDate,
                dailyBudget,
                dailySpent,
                numberOfMeals,
                difference: dailyBudget * numberOfMeals - dailySpent,
            } satisfies InsertDailyReceipt;
            await db.insert(dailyReceipt).values(receipRequest);
            return (
                <>
                    <DebtForm date={date} dailySpent={dailySpent.toString()}/>
                    <Difference/>
                </>
            );
        },
        {
            body: t.Object({
                date: t.String(),
                dailyBudget: t.Numeric(),
                dailySpent: t.Numeric(),
                numberOfMeals: t.Numeric(),
            }),
        }
    )
    .get("/difference", async () => {
        const array = await db
            .select({
                count: sql<number>`sum(
                ${dailyReceipt.difference}
                )`,
            })
            .from(dailyReceipt);
        return array[0]["count"];
    })
    .listen(3000);

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
