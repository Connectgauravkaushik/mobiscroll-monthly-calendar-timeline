import { useState, useEffect, useCallback } from "react";
import Calendar from "./CalenderComp";
import DeleteModal from "./DeleteComp";

const HeaderComp = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [updatedDate, setupdatedDate] = useState(false);
  const [daysInMonth, setDaysInMonth] = useState(28);
  const [showDate, setShowDate] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  // Get events from localStorage or set an empty array if there are no events in localStorage
  const [events, setEvents] = useState(() => {
    const savedEvents = localStorage.getItem("events");
    try {
      const parsedEvents = savedEvents ? JSON.parse(savedEvents) : [];
      return Array.isArray(parsedEvents) ? parsedEvents : [];
    } catch (error) {
      console.error("Error parsing events from localStorage", error);
      return [];
    }
  });

  // Create a random color for the event background color (hex format)
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Show the delete modal when an event is clicked
  const handleEventClick = (event) => {
    setEventToDelete(event);
    setShowDeleteModal(true);
  };

  // Delete the event from the events array and save the updated events to localStorage
  const handleDeleteEvent = (eventId) => {
    const updatedEvents = events.filter((event) => event.id !== eventId);
    setEvents(updatedEvents);
    saveEventsToLocalStorage(updatedEvents);
    setShowDeleteModal(false);
  };

  // Save the events array to localStorage
  const saveEventsToLocalStorage = (updatedEvents) => {
    try {
      localStorage.setItem("events", JSON.stringify(updatedEvents));
    } catch (error) {
      console.error("Error saving events to localStorage", error);
    }
  };

  // Create a new event when a column is clicked and save the updated events to localStorage
  const handleColumnClick = (resourceIndex, dayIndex) => {
    const existingEvent = events.find(
      (event) =>
        event.resourceIndex === resourceIndex && event.dayIndex === dayIndex
    );
    if (existingEvent) return;

    const newColor = getRandomColor();
    const newEvent = {
      resourceIndex,
      dayIndex,
      width: 100,
      left: dayIndex * 40,
      color: newColor,
      id: `${resourceIndex}-${dayIndex}-${new Date().getTime()}`,
    };

    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    saveEventsToLocalStorage(updatedEvents);
  };

  // Resize the event width and save the updated events to localStorage
  const handleResize = useCallback(
    (e, eventId) => {
      const newWidth = e.clientX - e.target.getBoundingClientRect().left;
      if (newWidth > 20) {
        const updatedEvents = events.map((event) => {
          if (event.id === eventId) {
            return { ...event, width: newWidth };
          }
          return event;
        });
        setEvents(updatedEvents);
        saveEventsToLocalStorage(updatedEvents);
      }
    },
    [events]
  );

  // Resize the event width when the mouse is moved and save the updated events to localStorage
  const handleMouseDown = (eventId) => {
    const onMouseMove = (e) => handleResize(e, eventId);
    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  // Retain the drag start data and update the event resourceIndex and dayIndex when the event is dropped
  const handleDragStart = (e, resourceIndex, dayIndex) => {
    e.dataTransfer.setData("resourceIndex", resourceIndex);
    e.dataTransfer.setData("dayIndex", dayIndex);
  };

  // Retain the drag over data
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Update the event resourceIndex and dayIndex when the event is dropped and save the updated events to localStorage
  const handleDrop = (e, newResourceIndex, newDayIndex) => {
    e.preventDefault();
    const resourceIndex = e.dataTransfer.getData("resourceIndex");
    const dayIndex = e.dataTransfer.getData("dayIndex");

    if (
      newResourceIndex !== parseInt(resourceIndex) ||
      newDayIndex !== parseInt(dayIndex)
    ) {
      const updatedEvents = events.map((event) => {
        if (
          event.resourceIndex === parseInt(resourceIndex) &&
          event.dayIndex === parseInt(dayIndex)
        ) {
          return {
            ...event,
            resourceIndex: newResourceIndex,
            dayIndex: newDayIndex,
          };
        }
        return event;
      });

      setEvents(updatedEvents);
      saveEventsToLocalStorage(updatedEvents);
    }
  };

  // Update the current date to the next month
  const goToNextMonth = () => {
    setupdatedDate(true);
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  // Update the current date to the previous month
  const goToPreviousMonth = () => {
    setupdatedDate(true);
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  // Get the month name
  const getMonthName = () =>
    currentDate.toLocaleString("default", { month: "long" });
  const getYear = () => currentDate.getFullYear();

  // Update the number of days in the month
  const updateDaysInMonth = () => {
    const days = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDate();
    setDaysInMonth(days);
  };

  // Get the day of the week
  const getDayOfWeek = (day) => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    const dayOfWeek = date.getDay();
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return daysOfWeek[dayOfWeek];
  };

  // Check if the day is today
  const isToday = (day) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === currentDate.getMonth() &&
      today.getFullYear() === currentDate.getFullYear()
    );
  };

  // Update the number of days in the month when the current date changes
  useEffect(() => {
    updateDaysInMonth();
  }, [currentDate]);

  return (
    <div>
      <nav className="bg-[#F7F7F7] fixed w-full z-20 top-0 start-0 border-b border-gray-300">
        <div className="max-w-screen-xl flex items-center justify-between mx-auto p-3">
          <div
            onClick={() => setShowDate(!showDate)}
            className="text-blue-500 cursor-pointer"
          >
            <span className="self-center text-2xl font-semibold whitespace-nowrap">
              {updatedDate ? `${getMonthName()} ${getYear()}` : "February 2025"}
            </span>
          </div>

          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <svg
              className="cursor-pointer fill-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="44"
              height="44"
              onClick={goToPreviousMonth}
            >
              <path d="M14 7l-5 5 5 5V7z" />
            </svg>

            <p className="text-blue-500 font-bold">Today</p>

            <svg
              className="cursor-pointer fill-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="44"
              height="44"
              onClick={goToNextMonth}
            >
              <path d="M10 17l5-5-5-5v10z" />
            </svg>
          </div>
        </div>
      </nav>

      <div className="flex mt-[66px] overflow-x-auto">
        <div className="flex flex-col flex-grow min-w-max">
          <div className="flex">
            <div className="flex items-center justify-center py-8 px-14 border-[1px] border-gray-300 text-sm font-semibold text-gray-700 w-40 border-collapse"></div>
            {Array.from({ length: daysInMonth }, (_, index) => (
              <div
                key={index}
                className="flex items-center justify-center py-8 px-2 border-[1px] border-gray-300 text-md font-semibold text-gray-700 w-40 border-collapse"
              >
                <div
                  className={
                    isToday(index + 1)
                      ? "bg-blue-500 border-blue-500 text-white rounded-lg"
                      : ""
                  }
                >
                  {index + 1} {getDayOfWeek(index + 1)}
                </div>
              </div>
            ))}
          </div>

          {Array.from({ length: 15 }, (_, index) => (
            <div key={index} className="flex">
              <div className="sticky z-10 left-0 bg-white py-2.5 px-1 font-bold border-[1px] border-gray-300 text-sm text-gray-700 w-40 border-collapse">
                Resource {String.fromCharCode(65 + index)}
              </div>

              {Array.from({ length: daysInMonth }, (_, dayIndex) => (
                <div
                  key={dayIndex}
                  onClick={() => handleColumnClick(index, dayIndex)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index, dayIndex)}
                  className="flex items-center justify-center py-1 px-2 border-[1px] border-gray-300 border-collapse text-sm text-gray-700 w-40 relative"
                >
                  {events
                    .filter(
                      (event) =>
                        event.resourceIndex === index &&
                        event.dayIndex === dayIndex
                    )
                    .map((event) => (
                      <div
                        key={event.id}
                        className="relative z-20 cursor-pointer"
                        style={{
                          position: "absolute",
                          left: event.left,
                          width: event.width,
                          backgroundColor: event.color,
                          opacity: 0.9, // Default opacity
                        }}
                        onClick={() => handleEventClick(event)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.opacity = 0.7;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.opacity = 0.9;
                        }}
                      >
                        <p
                          className="block text-white rounded-b-sm py-2 px-1"
                          draggable="true"
                          onDragStart={(e) =>
                            handleDragStart(e, index, dayIndex)
                          }
                          style={{ width: event.width }}
                        >
                          {`New Event ${event.dayIndex + 1}`}
                        </p>
                        <div
                          className="absolute top-0 right-0 w-2 h-full cursor-nwse-resize"
                          onMouseDown={() => handleMouseDown(event.id)}
                        />
                      </div>
                    ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {showDate && <Calendar />}
      {showDeleteModal && (
        <DeleteModal
          event={eventToDelete}
          onDelete={handleDeleteEvent}
          onClose={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
};

export default HeaderComp;
