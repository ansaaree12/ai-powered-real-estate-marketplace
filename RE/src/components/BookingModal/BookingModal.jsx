import React, { useContext, useState } from "react";
import { Modal, Button, Select } from "@mantine/core";
import { useMutation } from "react-query";
import UserDetailContext from "../../context/UserDetailContext.js";
import { bookVisit } from "../../utils/api.js";
import { toast } from "react-toastify";
import dayjs from "dayjs";

// Custom Calendar Component
const CustomCalendar = ({ selectedDate, onDateSelect, onMonthChange }) => {
  const getDaysInMonth = (year, month) => {
    const date = new Date(year, month + 1, 0);
    return Array.from({ length: date.getDate() }, (_, i) => i + 1);
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const handleMonthChange = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(selectedDate.getMonth() + direction);
    onMonthChange(newDate);
  };

  const daysInMonth = getDaysInMonth(selectedDate.getFullYear(), selectedDate.getMonth());
  const firstDayOfMonth = getFirstDayOfMonth(selectedDate.getFullYear(), selectedDate.getMonth());

  const handleDayClick = (day) => {
    onDateSelect(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day));
  };

  return (
    <div>
      <div className="month-name">
        <button className="nav-button" onClick={() => handleMonthChange(-1)}>
          {"<"}
        </button>
        {selectedDate.toLocaleString("default", { month: "long" })} {selectedDate.getFullYear()}
        <button className="nav-button" onClick={() => handleMonthChange(1)}>
          {">"}
        </button>
      </div>

      <div className="calendar-grid days-of-week">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
          <div key={index} className="calendar-day day-name">
            {day}
          </div>
        ))}
      </div>

      <div className="calendar-grid">
        {Array.from({ length: firstDayOfMonth }, (_, index) => (
          <div key={`blank-${index}`} className="calendar-day blank-day"></div>
        ))}
        {daysInMonth.map((day) => (
          <div
            key={day}
            className={`calendar-day ${selectedDate.getDate() === day ? "selected" : ""}`}
            onClick={() => handleDayClick(day)}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Booking Modal
const BookingModal = ({ opened, setOpened, email, propertyId }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const {
    userDetails: { token },
    setUserDetails,
  } = useContext(UserDetailContext);

  const handleBookingSuccess = () => {
    toast.success("You have booked your visit", { position: "bottom-right" });
    setUserDetails((prev) => ({
      ...prev,
      bookings: [
        ...prev.bookings,
        {
          id: propertyId,
          date: dayjs(selectedDate).format("DD/MM/YYYY"),
        },
      ],
    }));
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: () => {
      const formattedDate = dayjs(selectedDate).format("YYYY-MM-DD");
      return bookVisit(formattedDate, propertyId, email, token);
    },
    onSuccess: handleBookingSuccess,
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something went wrong!");
    },
    onSettled: () => setOpened(false),
  });

  const yearOptions = Array.from({ length: 6 }, (_, index) =>
    (new Date().getFullYear() + index).toString()
  );

  const handleYearChange = (year) => {
    const parsedYear = parseInt(year, 10);
    setSelectedYear(parsedYear);

    const updatedDate = new Date(selectedDate);
    updatedDate.setFullYear(parsedYear);
    setSelectedDate(updatedDate);
  };

  return (
    <Modal opened={opened} onClose={() => setOpened(false)} title="Select your date of visit" centered>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Select
          label="Select Year"
          value={selectedYear.toString()}
          onChange={handleYearChange}
          data={yearOptions}
          style={{ marginBottom: "15px", width: "100%", maxWidth: "200px" }}
        />
        <CustomCalendar selectedDate={selectedDate} onDateSelect={setSelectedDate} onMonthChange={setSelectedDate} />
        <Button style={{ marginTop: "10px" }} disabled={!selectedDate || isLoading} onClick={() => mutate()}>
          {isLoading ? "Booking..." : "Book Visit"}
        </Button>
      </div>

      <style>
        {`
          .month-name {
            font-size: 18px;
            font-weight: bold;
            text-align: center;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .calendar-grid {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            grid-gap: 5px;
          }

          .calendar-day {
            width: 40px;
            height: 40px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 5px;
            cursor: pointer;
            background-color: #f0f0f0;
            font-size: 14px;
          }

          .calendar-day:hover {
            background-color: #e0e0e0;
          }

          .calendar-day.selected {
            background-color: #4caf50;
            color: white;
          }

          .calendar-day.blank-day {
            background-color: transparent;
          }

          .calendar-day.day-name {
            font-weight: bold;
            text-align: center;
          }

          .nav-button {
            background: none;
            border: none;
            cursor: pointer;
            color: #4caf50;
            font-size: 20px;
          }
        `}
      </style>
    </Modal>
  );
};

export default BookingModal;
