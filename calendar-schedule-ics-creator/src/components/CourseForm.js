"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CourseForm() {
  const router = useRouter();
  const [courses, setCourses] = useState([
    {
      id: 1,
      name: "",
      days: [],
      startTime: "",
      endTime: "",
      room: "",
    },
  ]);

  const daysOfWeek = [
    { id: "MON", label: "Mon" },
    { id: "TUE", label: "Tue" },
    { id: "WED", label: "Wed" },
    { id: "THU", label: "Thu" },
    { id: "FRI", label: "Fri" },
  ];

  const addCourse = () => {
    setCourses([
      ...courses,
      {
        id: courses.length + 1,
        name: "",
        days: [],
        startTime: "",
        endTime: "",
        room: "",
      },
    ]);
  };

  const removeCourse = (id) => {
    setCourses(courses.filter((course) => course.id !== id));
  };

  const updateCourse = (id, field, value) => {
    setCourses(
      courses.map((course) => {
        if (course.id === id) {
          return { ...course, [field]: value };
        }
        return course;
      }),
    );
  };

  const toggleDay = (courseId, day) => {
    setCourses(
      courses.map((course) => {
        if (course.id === courseId) {
          const days = course.days.includes(day)
            ? course.days.filter((d) => d !== day)
            : [...course.days, day];
          return { ...course, days };
        }
        return course;
      }),
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("courses", JSON.stringify(courses));
    router.push("/semester-end");
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <div className="space-y-4">
        {courses.map((course) => (
          <div
            key={course.id}
            className="p-4 bg-white border rounded-lg"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Course {course.id}
              </h3>
              {courses.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeCourse(course.id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor={`name-${course.id}`}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Course Name
                </label>
                <input
                  type="text"
                  id={`name-${course.id}`}
                  value={course.name}
                  onChange={(e) =>
                    updateCourse(course.id, "name", e.target.value)
                  }
                  className="block w-full px-3 py-2 rounded-md border text-gray-900 placeholder-gray-400"
                  placeholder="e.g., Mathematics 101"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Days
                </label>
                <div className="flex flex-wrap gap-2">
                  {daysOfWeek.map((day) => (
                    <button
                      key={day.id}
                      type="button"
                      onClick={() => toggleDay(course.id, day.id)}
                      className={`px-3 py-1 rounded-md text-sm font-medium
                        ${
                          course.days.includes(day.id)
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-700 border"
                        }`}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor={`startTime-${course.id}`}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Start Time
                  </label>
                  <input
                    type="time"
                    id={`startTime-${course.id}`}
                    value={course.startTime}
                    onChange={(e) => {
                      const [hours] = e.target.value.split(":");
                      updateCourse(course.id, "startTime", `${hours}:00`);
                    }}
                    step="3600"
                    className="block w-full px-3 py-2 rounded-md border text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor={`endTime-${course.id}`}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    End Time
                  </label>
                  <input
                    type="time"
                    id={`endTime-${course.id}`}
                    value={course.endTime}
                    onChange={(e) => {
                      const [hours] = e.target.value.split(":");
                      updateCourse(course.id, "endTime", `${hours}:00`);
                    }}
                    step="3600"
                    className="block w-full px-3 py-2 rounded-md border text-gray-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor={`room-${course.id}`}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Room
                </label>
                <input
                  type="text"
                  id={`room-${course.id}`}
                  value={course.room}
                  onChange={(e) =>
                    updateCourse(course.id, "room", e.target.value)
                  }
                  className="block w-full px-3 py-2 rounded-md border text-gray-900 placeholder-gray-400"
                  placeholder="e.g., Room 101"
                  required
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={addCourse}
          className="button-secondary px-4 py-2"
        >
          Add Another Course
        </button>
        <button
          type="submit"
          className="button-primary px-6 py-2"
        >
          Continue
        </button>
      </div>
    </form>
  );
}
