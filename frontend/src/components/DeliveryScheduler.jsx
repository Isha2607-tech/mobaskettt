import React, { useState, useEffect } from "react";
import { Calendar, Clock, Truck } from "lucide-react";
import {
  format,
  addDays,
  setHours,
  setMinutes,
  isAfter,
  startOfHour,
  addHours,
} from "date-fns";

const DeliveryScheduler = ({ type = "food", onScheduleChange }) => {
  const [deliveryType, setDeliveryType] = useState("now");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);

  // Initialize default date (Today)
  useEffect(() => {
    const today = new Date();
    setSelectedDate(format(today, "yyyy-MM-dd"));
  }, []);

  // Sync state with parent
  useEffect(() => {
    onScheduleChange({
      deliveryType,
      deliveryDate: deliveryType === "scheduled" ? selectedDate : null,
      deliveryTimeSlot: deliveryType === "scheduled" ? selectedTimeSlot : null,
    });
  }, [deliveryType, selectedDate, selectedTimeSlot, onScheduleChange]);

  // Generate Available Time Slots
  useEffect(() => {
    if (!selectedDate || deliveryType !== "scheduled") return;

    const generateSlots = () => {
      const slots = [];
      const now = new Date();
      const isToday = selectedDate === format(now, "yyyy-MM-dd");

      // Start generating slots from 8 AM to 10 PM (example business hours)
      // or 24 hours if needed. Let's do 8 AM - 10 PM for realism.
      const startHour = 8;
      const endHour = 22;

      for (let i = startHour; i < endHour; i++) {
        const slotStart = setMinutes(setHours(new Date(selectedDate), i), 0);
        const slotEnd = addHours(slotStart, 1);

        // Validation Logic
        let isValid = true;

        if (isToday) {
          // Food: Must be at least 60 mins from now
          if (type === "food") {
            if (isAfter(addMinutes(now, 60), slotStart)) {
              isValid = false;
            }
          }
          // Grocery: Must be in future (simple check)
          else {
            if (isAfter(now, slotStart)) {
              isValid = false;
            }
          }
        }

        if (isValid) {
          slots.push({
            label: `${format(slotStart, "h:mm a")} - ${format(slotEnd, "h:mm a")}`,
            value: `${format(slotStart, "HH:mm")}-${format(slotEnd, "HH:mm")}`,
          });
        }
      }
      setAvailableTimeSlots(slots);
    };

    generateSlots();
  }, [selectedDate, deliveryType, type]);

  // Helper to add minutes
  const addMinutes = (date, minutes) => {
    return new Date(date.getTime() + minutes * 60000);
  };

  // Handle Radio Change
  const handleTypeChange = (value) => {
    setDeliveryType(value);
    // Reset validation/slots if switching back to 'now' is handled by effect
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
      <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
        <Truck className="w-4 h-4 text-[#ff8100]" />
        Delivery Options
      </h3>

      {/* Radio Options */}
      <div className="flex gap-4 mb-4">
        <label
          className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
            deliveryType === "now"
              ? "border-[#ff8100] bg-orange-50 text-[#ff8100]"
              : "border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          <input
            type="radio"
            name="deliveryType"
            value="now"
            checked={deliveryType === "now"}
            onChange={() => handleTypeChange("now")}
            className="hidden"
          />
          <span className="text-sm font-semibold">Deliver Now</span>
        </label>

        <label
          className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
            deliveryType === "scheduled"
              ? "border-[#ff8100] bg-orange-50 text-[#ff8100]"
              : "border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          <input
            type="radio"
            name="deliveryType"
            value="scheduled"
            checked={deliveryType === "scheduled"}
            onChange={() => handleTypeChange("scheduled")}
            className="hidden"
          />
          <span className="text-sm font-semibold">Schedule</span>
        </label>
      </div>

      {/* Schedule Selectors */}
      {deliveryType === "scheduled" && (
        <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Date Selector */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Select Date
            </label>
            <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
              {/* Generate dates based on type */}
              {[0, 1, 2].map((offset) => {
                if (type === "food" && offset > 0) return null; // Food is same day only usually? Prompt says "allow same-day slots". Doesn't strictly forbid next day, but usually food is immediate. Let's assume Food = Today, Grocery = Today + Next Day.
                if (type === "grocery" && offset > 1) return null; // Grocery: Same day and next day.

                const date = addDays(new Date(), offset);
                const dateStr = format(date, "yyyy-MM-dd");
                const isSelected = selectedDate === dateStr;
                const label =
                  offset === 0
                    ? "Today"
                    : offset === 1
                      ? "Tomorrow"
                      : format(date, "EEE, MMM d");

                return (
                  <button
                    key={offset}
                    onClick={() => setSelectedDate(dateStr)}
                    className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                      isSelected
                        ? "bg-[#ff8100] text-white border-[#ff8100]"
                        : "bg-white text-gray-700 border-gray-200 hover:border-[#ff8100]"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Slot Selector */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Select Time Slot
            </label>
            <select
              value={selectedTimeSlot}
              onChange={(e) => setSelectedTimeSlot(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:border-[#ff8100] focus:ring-1 focus:ring-[#ff8100]"
            >
              <option value="" disabled>
                Choose a time slot
              </option>
              {availableTimeSlots.length > 0 ? (
                availableTimeSlots.map((slot) => (
                  <option key={slot.value} value={slot.value}>
                    {slot.label}
                  </option>
                ))
              ) : (
                <option disabled>No slots available</option>
              )}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryScheduler;
