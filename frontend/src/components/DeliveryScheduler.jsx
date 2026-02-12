import React, { useState, useEffect } from "react";
import { Calendar, Clock, Truck, ChevronDown } from "lucide-react";
import {
  format,
  addDays,
  setHours,
  setMinutes,
  isAfter,
  addMinutes,
  addHours,
  startOfHour,
} from "date-fns";

const DeliveryScheduler = ({ type = "food", onScheduleChange }) => {
  const [deliveryType, setDeliveryType] = useState("now"); // 'now' | 'scheduled'
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);

  // Generate slots on mount or date change
  useEffect(() => {
    const slots = [];
    const now = new Date();
    const isToday =
      format(selectedDate, "yyyy-MM-dd") === format(now, "yyyy-MM-dd");

    // Standard business hours: 8 AM to 10 PM
    const startHour = 8;
    const endHour = 22;

    for (let i = startHour; i < endHour; i++) {
      // Create slot start time for the selected date
      let slotStart = setHours(setMinutes(new Date(selectedDate), 0), i);
      let slotEnd = addHours(slotStart, 2); // 2-hour windows

      // Validation
      let isValid = true;
      if (isToday) {
        // Must be in the future
        if (isAfter(now, slotStart)) {
          isValid = false;
        }
        // For food, maybe add a buffer, e.g. 1 hour
        if (type === 'food' && isAfter(addMinutes(now, 60), slotStart)) {
          isValid = false;
        }
      }

      if (isValid) {
        slots.push({
          label: `${format(slotStart, "hh:mm a")} to ${format(slotEnd, "hh:mm a")}`,
          value: `${format(slotStart, "HH:mm")}-${format(slotEnd, "HH:mm")}`
        });
      }
    }
    setAvailableTimeSlots(slots);
  }, [selectedDate, type]);


  // Notify parent
  useEffect(() => {
    onScheduleChange({
      deliveryType,
      deliveryDate: deliveryType === "scheduled" ? selectedDate : null,
      deliveryTimeSlot: deliveryType === "scheduled" ? selectedTimeSlot : null,
    });
  }, [deliveryType, selectedDate, selectedTimeSlot, onScheduleChange]);

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-orange-50 mb-4">
      <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Truck className="w-5 h-5 text-[#ff8100]" />
        Delivery Options
      </h3>

      {/* Main Toggles */}
      <div className="flex gap-4 mb-6">
        <div
          onClick={() => setDeliveryType("now")}
          className={`flex-1 p-4 rounded-xl border relative cursor-pointer transition-all flex items-center justify-between ${deliveryType === "now"
            ? "border-[#ff8100] bg-white shadow-sm ring-1 ring-[#ff8100]"
            : "border-gray-200 bg-white text-gray-400 opacity-60 hover:opacity-100"
            }`}
        >
          <div>
            <span
              className={`block text-sm font-bold ${deliveryType === "now" ? "text-gray-900" : "text-gray-500"
                }`}
            >
              Deliver Now
            </span>
            <span className="text-[10px] text-gray-400 font-medium">
              8-12 mins
            </span>
          </div>
          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${deliveryType === "now" ? "border-[#ff8100]" : "border-gray-300"
              }`}
          >
            {deliveryType === "now" && <div className="w-2.5 h-2.5 bg-[#ff8100] rounded-full" />}
          </div>
        </div>

        <div
          onClick={() => setDeliveryType("scheduled")}
          className={`flex-1 p-4 rounded-xl border relative cursor-pointer transition-all flex items-center justify-between ${deliveryType === "scheduled"
            ? "border-[#ff8100] bg-orange-50/10 shadow-sm ring-1 ring-[#ff8100]"
            : "border-gray-200 bg-white text-gray-400 opacity-60 hover:opacity-100"
            }`}
        >
          <div>
            <span
              className={`block text-sm font-bold ${deliveryType === "scheduled" ? "text-gray-900" : "text-gray-500"
                }`}
            >
              Schedule
            </span>
            <span className="text-[10px] text-gray-400 font-medium">
              Select time
            </span>
          </div>
          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${deliveryType === "scheduled" ? "border-[#ff8100]" : "border-gray-300"
              }`}
          >
            {deliveryType === "scheduled" && <div className="w-2.5 h-2.5 bg-[#ff8100] rounded-full" />}
          </div>
        </div>
      </div>

      {/* Schedule Options */}
      {deliveryType === "scheduled" && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          {/* Date */}
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Select Date
            </p>
            <div className="relative">
              <button
                className="w-full flex items-center justify-between bg-orange-50/50 border border-orange-200 text-orange-900 rounded-xl px-4 py-3 shadow-sm hover:border-[#ff8100] transition-colors"
                onClick={() => document.getElementById("scheduler-date-picker").showPicker()}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-[#ff8100] p-2 rounded-lg text-white">
                    <Calendar size={18} />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">Date</span>
                    <span className="text-sm font-bold text-gray-900">
                      {format(selectedDate, "EEE, MMM d")}
                    </span>
                  </div>
                </div>
                <ChevronDown size={16} className="text-orange-400" />
              </button>
              <input
                id="scheduler-date-picker"
                type="date"
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                value={
                  !isNaN(selectedDate.getTime())
                    ? format(selectedDate, "yyyy-MM-dd")
                    : ""
                }
                min={format(new Date(), "yyyy-MM-dd")}
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  if (!isNaN(date.getTime())) {
                    setSelectedDate(date);
                  }
                }}
              />
            </div>
          </div>

          {/* Time Slot */}
          <div>
            <p className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Select Time Slot
            </p>
            <div className="relative">
              <select
                value={selectedTimeSlot}
                onChange={(e) => setSelectedTimeSlot(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-200 text-gray-900 text-sm rounded-xl p-3 shadow-sm focus:outline-none focus:border-[#ff8100] focus:ring-1 focus:ring-[#ff8100] font-medium cursor-pointer"
              >
                <option value="" disabled>Choose a time slot</option>
                {availableTimeSlots.map((slot) => (
                  <option key={slot.value} value={slot.value}>{slot.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryScheduler;
