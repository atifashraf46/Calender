"use client"

import { useState, useEffect } from "react"
import dayjs from "dayjs"
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import eventsData from "../data/events.json"

interface Event {
  id: number
  title: string
  date: string
  time: string
  duration: number
  color: string
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(dayjs())
  const [events, setEvents] = useState<Event[]>([])
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  useEffect(() => {
    setEvents(eventsData)
  }, [])

  const today = dayjs()
  const startOfMonth = currentDate.startOf("month")
  const endOfMonth = currentDate.endOf("month")
  const startOfCalendar = startOfMonth.startOf("week")
  const endOfCalendar = endOfMonth.endOf("week")

  const calendarDays = []
  let day = startOfCalendar

  while (day.isBefore(endOfCalendar) || day.isSame(endOfCalendar, "day")) {
    calendarDays.push(day)
    day = day.add(1, "day")
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => (direction === "prev" ? prev.subtract(1, "month") : prev.add(1, "month")))
  }

  const getEventsForDate = (date: dayjs.Dayjs) => {
    return events.filter((event) => dayjs(event.date).isSame(date, "day"))
  }

  const hasTimeConflict = (events: Event[]) => {
    if (events.length <= 1) return false

    for (let i = 0; i < events.length; i++) {
      for (let j = i + 1; j < events.length; j++) {
        const event1 = events[i]
        const event2 = events[j]

        const start1 = dayjs(`${event1.date} ${event1.time}`)
        const end1 = start1.add(event1.duration, "minute")
        const start2 = dayjs(`${event2.date} ${event2.time}`)
        const end2 = start2.add(event2.duration, "minute")

        if (start1.isBefore(end2) && start2.isBefore(end1)) {
          return true
        }
      }
    }
    return false
  }

  const getColorClass = (color: string) => {
    const colors: { [key: string]: string } = {
      blue: "bg-blue-500",
      green: "bg-green-500",
      purple: "bg-purple-500",
      orange: "bg-orange-500",
      red: "bg-red-500",
      indigo: "bg-indigo-500",
      pink: "bg-pink-500",
    }
    return colors[color] || "bg-gray-500"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <CalendarIcon className="w-8 h-8 text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-800">Calendar</h1>
          </div>
          <p className="text-gray-600">Manage your events and schedule</p>
        </div>

        <Card className="p-6 shadow-xl bg-white/80 backdrop-blur-sm">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")} className="hover:bg-indigo-50">
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <h2 className="text-2xl font-semibold text-gray-800">{currentDate.format("MMMM YYYY")}</h2>

            <Button variant="outline" size="sm" onClick={() => navigateMonth("next")} className="hover:bg-indigo-50">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="p-3 text-center font-medium text-gray-600 text-sm">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              const dayEvents = getEventsForDate(day)
              const isCurrentMonth = day.isSame(currentDate, "month")
              const isToday = day.isSame(today, "day")
              const hasConflicts = hasTimeConflict(dayEvents)

              return (
                <div
                  key={index}
                  className={`
                    min-h-[120px] p-2 border border-gray-200 rounded-lg cursor-pointer transition-all duration-200
                    ${isCurrentMonth ? "bg-white hover:bg-gray-50" : "bg-gray-50 text-gray-400"}
                    ${isToday ? "ring-2 ring-indigo-500 bg-indigo-50" : ""}
                    ${selectedDate === day.format("YYYY-MM-DD") ? "ring-2 ring-blue-400" : ""}
                  `}
                  onClick={() => setSelectedDate(day.format("YYYY-MM-DD"))}
                >
                  <div
                    className={`
                    text-sm font-medium mb-1
                    ${isToday ? "text-indigo-700" : isCurrentMonth ? "text-gray-800" : "text-gray-400"}
                  `}
                  >
                    {day.format("D")}
                  </div>

                  <div className="space-y-1">
                    {dayEvents.slice(0, 3).map((event, eventIndex) => (
                      <div
                        key={event.id}
                        className={`
                          text-xs px-2 py-1 rounded text-white truncate
                          ${getColorClass(event.color)}
                          ${hasConflicts ? "animate-pulse" : ""}
                        `}
                        title={`${event.title} - ${event.time} (${event.duration}min)`}
                      >
                        {event.title}
                      </div>
                    ))}

                    {dayEvents.length > 3 && (
                      <div className="text-xs text-gray-500 px-2">+{dayEvents.length - 3} more</div>
                    )}

                    {hasConflicts && <div className="text-xs text-red-600 px-2 font-medium">⚠️ Conflicts</div>}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Selected Date Events */}
          {selectedDate && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-3">
                Events for {dayjs(selectedDate).format("MMMM D, YYYY")}
              </h3>

              {getEventsForDate(dayjs(selectedDate)).length === 0 ? (
                <p className="text-gray-500">No events scheduled</p>
              ) : (
                <div className="space-y-2">
                  {getEventsForDate(dayjs(selectedDate)).map((event) => (
                    <div key={event.id} className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                      <div className={`w-3 h-3 rounded-full ${getColorClass(event.color)}`} />
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">{event.title}</div>
                        <div className="text-sm text-gray-600">
                          {event.time} • {event.duration} minutes
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Legend */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-indigo-500" />
              <span>Today</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
              <span>Time Conflicts</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
