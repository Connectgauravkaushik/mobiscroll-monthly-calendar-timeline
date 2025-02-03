import { useState } from "react";

const Calendar = () => {

  // State to store the current date
  const [currentDate, setCurrentDate] = useState(new Date());

  // Get the current month and year
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get the month name to display (e.g., January, February)
  const monthName = currentDate.toLocaleString("default", { month: "long" });
  const todayDate = currentDate.getDate(); // Get today's date (day of the month)

  // Get the first day of the month and number of days in the month
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Function to go to the next month
  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1));
 
    console.log(monthName);
  };

  // Function to go to the previous month
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1));
  };

  // Generate the days for the current month, including empty spaces for the first days
  const generateCalendarDays = () => {
    const days = [];

    // Add empty days for the first row of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    // Add the actual days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };


  return (
    <div className="flex mt-18 absolute z-30 top-0">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80 border border-gray-400 ml-20">
        <div className="flex justify-between items-center mb-4">
          <button
            className="text-xl text-gray-700 hover:text-gray-900"
            onClick={goToPreviousMonth}
          >
            &lt;
          </button>
          <h2 className="text-xl font-semibold">{`${monthName} ${year}`}</h2>
          <button
            className="text-xl text-gray-700 hover:text-gray-900"
            onClick={goToNextMonth}
          >
            &gt;
          </button>
        </div>

        {/* Days of the week */}
        <div className="grid grid-cols-7 text-center text-sm font-medium text-gray-700 mb-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="py-2">
              {day}
            </div>
          ))}
        </div>

        {/* creating Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {generateCalendarDays().map((day, index) => (
            <div
              key={index}
              className={`py-2 text-center ${
                day
                  ? day === todayDate
                    ? "bg-blue-500 text-white rounded-full" // Highlight today's date
                    : "bg-gray-100 text-gray-700"
                  : "bg-transparent text-transparent"
              } hover:bg-gray-200 rounded cursor-pointer`}
               // Only handle click if day exists
            >
              {day ? day : ""}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
