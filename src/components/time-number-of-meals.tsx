type Props = {
  month: string;
};


export const TimeNumberOfMeals = ({month}: Props) => {
  const date = new Date().toISOString().split("T")[0];

  console.log();
  return (
    <div class="max-w-md mx-auto bg-white p-8 rounded-md shadow-md">
      <h1 class="text-2xl font-bold mb-6">Date Filter</h1>

      <form action="/submit" method="POST" class="space-y-4">
        {/* <div>
          <label
            for="start-date"
            class="block text-sm font-medium text-gray-600"
          >
            Start Date
          </label>
          <input
            value={date}
            type="date"
            id="start-date"
            name="start-date"
            class="mt-1 p-2 border rounded-md w-full"
          />
        </div>

        <div>
          <label for="end-date" class="block text-sm font-medium text-gray-600">
            End Date
          </label>
          <input
            value={date}
            type="date"
            id="end-date"
            name="end-date"
            class="mt-1 p-2 border rounded-md w-full"
          />
        </div> */}

        <div>
          <label for="month" class="block text-sm font-medium text-gray-600">
            Select Month
          </label>
          <input
            value="2023-04"
            type="month"
            id="month"
            name="month"
            class="mt-1 p-2 border rounded-md w-full"
          />
        </div>

        <button
          type="submit"
          class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
      <div class="py-2">
        <label
          for="numeric-value"
          class="block text-sm font-medium text-gray-600"
        >
          Numeric Value
        </label>
        <input
          type="number"
          id="numeric-value"
          name="numeric-value"
          class="mt-1 p-2 border rounded-md w-full"
        />
      </div>
    </div>
  );
};
