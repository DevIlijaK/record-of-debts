import {Elysia, InputSchema, MergeSchema, TSchema, UnwrapRoute, t} from "elysia";
import {html} from "@elysiajs/html";
import {db} from "./db";
import {InsertDailyReceipt, dailyReceipt} from "./db/schema/debts";
import {sql} from "drizzle-orm";
import {BaseHtml} from "./components/base-html";
import {DebtForm} from "./components/debt-form";
import {Difference} from "./components/difference";
import {TimeNumberOfMeals} from "./components/time-number-of-meals";
import {staticPlugin} from '@elysiajs/static'
import {cron, Patterns} from '@elysiajs/cron'
import {ServerWebSocket} from "bun";
import {Cron} from "croner";
import {TypeCheck} from "elysia/dist/type-system";
import {ElysiaWS} from "elysia/dist/ws";


const connections: ElysiaWS<ServerWebSocket<{
    validator?: TypeCheck<TSchema> | undefined;
}>, MergeSchema<UnwrapRoute<InputSchema<never>, {}>, {}> & { params: Record<never, string>; }, {
    decorator: {};
    store: { cron: Record<"heartbeat", Cron>; };
    derive: {};
    resolve: {};
} & { derive: {} & {}; resolve: {} & {}; }>[] = [];

const app = new Elysia()
    .use(html())
    .use(staticPlugin())
    .use(cron({
            name: 'progressbar',
            pattern: Patterns.everySecond(),
            async run() {
                const response = await fetch("https://script.googleusercontent.com/macros/echo?user_content_key=tDXhw0uTcZTD8pSUgFQqoNBP6tYa_ArpSz-8kp148H8R1czHRm_uC20CNrv-9N9WZOnInuZgb_BgR1VdzHB_qa3FdUUtkOoQm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnE6xvnRQ5mlOOHD_vAOPr7RDHBEQMcKxW4UY-KkCyxLqlNbJ1fK8f5UiU2aCwVrjVRkvOG2enPzUJKJw6nbQYi-LO9uB-owqMdz9Jw9Md8uu&lib=MjIJ9WNa8_79q1-UZQlKeNapVbwD5X3mU");
                const body = await response.json();
                console.log('Heartbeat', body)
                const percentage = Math.round(body.data / 40000 * 100);
                console.log('Percentage: ', percentage);
                const html = `<div id="progressbar" class="bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div class="bg-green-500 h-full rounded-full" style="width: ${percentage}%;"></div>
                    </div>
                     <div id="progressbarProgress" class="flex mb-2 items-center justify-between">
                            <div>
                                <span class="text-xs font-semibold inline-block text-green-600">
                                   ${percentage}% 
                                </span>
                            </div>
                            <div class="text-right">
                                 <span class="text-xs font-semibold inline-block text-green-600">
                                     100%
                                 </span>
                            </div>
                        </div`
                for (const ws of connections) {
                    ws.send(`hello again: ${html}`);
                }
            }
        })
    )
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
            connections.push(ws);

        },
        message(ws, message) {

            // ws.send(`<div class="bg-gray-200 rounded-full h-4 overflow-hidden">
            //         <div class="bg-blue-500 h-full rounded-full" style="width: 50%;"></div>
            //         </div>`)
            // ws.send(`<div id="progressbar" class="bg-gray-200 rounded-full h-4 overflow-hidden">
            //         <div class="bg-green-500 h-full rounded-full" style="width: 80%;"></div>
            //         </div>
            //          <div id="test" class="flex mb-2 items-center justify-between">
            //                 <div style="width: 80%;" class="text-right">
            //                     <span
            //                         class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200"
            //                         >
            //                         Task Progress
            //                     </span>
            //                 </div>
            //                 <div class="text-right">
            //                      <span class="text-xs font-semibold inline-block text-green-600">
            //                          100%
            //                      </span>
            //                 </div>
            //             </div`)
        }
    })
    .get("/status/porudzbine", ({set}) => {
        set.headers = {
            'Content-Type': 'text/html',
        }
        return (
            <BaseHtml>
                {/*<div class="container mx-auto px-4">*/}
                {/*    <div>*/}
                {/*        Ovo radi kako treba*/}
                {/*    </div>*/}
                {/*    <div id="progressbarContainer">*/}
                {/*        <div id="progresbar">*/}

                {/*        </div>*/}

                {/*    </div>*/}
                {/*</div>*/}
                <div class="w-full max-w-md mx-auto p-4 rounded-lg border-solid border-2 border-indigo-600">
                    <h1 class="text-4xl font-bold text-center text-blue-600">
                        Status porudžbine:
                    </h1>
                    <div class="relative pt-1">
                        {/*<div class="flex mb-2 items-center justify-between">*/}
                        {/*    <div>*/}
                        {/*        <span*/}
                        {/*            class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">*/}
                        {/*            Task Progress*/}
                        {/*        </span>*/}
                        {/*    </div>*/}
                        {/*    <div class="text-right">*/}
                        {/*         <span class="text-xs font-semibold inline-block text-green-600">*/}
                        {/*             50%*/}
                        {/*         </span>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                        <div
                            hx-ext="ws"
                            ws-connect="/ws"
                            class="w-full max-w-md mx-auto">
                            <div id="progressbar" class="bg-gray-200 rounded-full h-4 overflow-hidden">
                                {/*<div class="bg-green-500 h-full rounded-full" style="width: 40%;"></div>*/}
                            </div>
                            <div id="progressbarProgress" class="bg-gray-200 rounded-full h-4 overflow-hidden">
                                {/*<div class="bg-green-500 h-full rounded-full" style="width: 80%;"></div>*/}
                            </div>
                        </div>
                    </div>
                    <div class="mb-2">
                        <p>Kopirajte ovaj link i pošaljite svojim prijateljima koji bi bili zainteresovani da poruče.
                            Kada
                            stignemo do 100%, objavljujemo datum dostave!</p>
                    </div>
                    <div class="p-6 rounded-lg border-solid border-2 border-indigo-600 relative">
                        <div class="m-2 text-center">
                            https://www.example.com
                        </div>
                        <button onclick="copyLink()"
                                class="bg-transparent text-indigo-600 px-4 py-2 rounded absolute top-0 right-0">
                            <span class="material-symbols-outlined">content_copy</span>
                        </button>
                    </div>
                    <div  class="mt-2">
                        <p>Pošaljite nam sliku sherovanog linka i ostvarite popust na porudžbinu od 10%!</p>
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
