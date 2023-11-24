type MyComponentProps = {
  date: string;
  dailySpent?: string;
};

export const DebtForm = ({ date, dailySpent }: MyComponentProps) => {
  return (
    <form
      method="post"
      hx-post="/create"
      xh-swap="innerHTML"
      hx-target="closest div"
      hx-ext="json-enc"
    >
      <h1 class="text-2xl font-semibold mb-4">Praćenje Troškova</h1>

      <div class="mb-4">
        <label for="date" class="block text-gray-600 text-sm font-medium">
          Datum
        </label>
        <input
          value={date}
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
          _="on htmx:beforeSend log my.value"
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
        <label for="dailySpent" class="block text-gray-600 text-sm font-medium">
          Potrošeno:
        </label>
        <input
          value={dailySpent}
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
          class="bg-blue-500 w-full text-white px-4 py-2 rounded-md"
        >
          Kreiraj
        </button>
      </div>
    </form>
  );
};
