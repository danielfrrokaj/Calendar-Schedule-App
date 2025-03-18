'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CourseForm() {
  const router = useRouter()
  const [courses, setCourses] = useState([{
    id: 1,
    name: '',
    days: [],
    startTime: '',
    endTime: ''
  }])

  const daysOfWeek = [
    { id: 'MON', label: 'Monday' },
    { id: 'TUE', label: 'Tuesday' },
    { id: 'WED', label: 'Wednesday' },
    { id: 'THU', label: 'Thursday' },
    { id: 'FRI', label: 'Friday' }
  ]

  const addCourse = () => {
    setCourses([
      ...courses,
      {
        id: courses.length + 1,
        name: '',
        days: [],
        startTime: '',
        endTime: ''
      }
    ])
  }

  const removeCourse = (id) => {
    setCourses(courses.filter(course => course.id !== id))
  }

  const updateCourse = (id, field, value) => {
    setCourses(courses.map(course => {
      if (course.id === id) {
        return { ...course, [field]: value }
      }
      return course
    }))
  }

  const toggleDay = (courseId, day) => {
    setCourses(courses.map(course => {
      if (course.id === courseId) {
        const days = course.days.includes(day)
          ? course.days.filter(d => d !== day)
          : [...course.days, day]
        return { ...course, days }
      }
      return course
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    localStorage.setItem('courses', JSON.stringify(courses))
    router.push('/semester-end')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-neutral-white shadow-xl rounded-lg p-6">
      <div className="space-y-8">
        {courses.map((course) => (
          <div key={course.id} className="p-6 border border-primary-light rounded-lg space-y-4 bg-neutral-gray shadow-md hover:shadow-lg transition-all">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-primary-dark">Course {course.id}</h3>
              {courses.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeCourse(course.id)}
                  className="text-primary-dark hover:text-primary-medium transition-colors"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor={`name-${course.id}`} className="block text-sm font-medium text-primary-dark">
                  Course Name
                </label>
                <input
                  type="text"
                  id={`name-${course.id}`}
                  value={course.name}
                  onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                  className="mt-1 block w-full rounded-md bg-neutral-white border-primary-light text-primary-dark shadow-sm focus:border-primary-medium focus:ring-primary-medium focus:ring-opacity-50 placeholder-primary-dark/50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-dark mb-2">Days</label>
                <div className="flex flex-wrap gap-2">
                  {daysOfWeek.map((day) => (
                    <button
                      key={day.id}
                      type="button"
                      onClick={() => toggleDay(course.id, day.id)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-all
                        ${course.days.includes(day.id)
                          ? 'bg-primary-medium text-neutral-white shadow-lg'
                          : 'bg-neutral-white text-primary-dark border border-primary-light hover:border-primary-medium hover:shadow-md'
                        }`}
                    >
                      {day.id}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor={`startTime-${course.id}`} className="block text-sm font-medium text-primary-dark">
                    Start Time
                  </label>
                  <input
                    type="time"
                    id={`startTime-${course.id}`}
                    value={course.startTime}
                    onChange={(e) => updateCourse(course.id, 'startTime', e.target.value)}
                    className="mt-1 block w-full rounded-md bg-neutral-white border-primary-light text-primary-dark shadow-sm focus:border-primary-medium focus:ring-primary-medium focus:ring-opacity-50"
                    required
                  />
                </div>
                <div>
                  <label htmlFor={`endTime-${course.id}`} className="block text-sm font-medium text-primary-dark">
                    End Time
                  </label>
                  <input
                    type="time"
                    id={`endTime-${course.id}`}
                    value={course.endTime}
                    onChange={(e) => updateCourse(course.id, 'endTime', e.target.value)}
                    className="mt-1 block w-full rounded-md bg-neutral-white border-primary-light text-primary-dark shadow-sm focus:border-primary-medium focus:ring-primary-medium focus:ring-opacity-50"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={addCourse}
          className="inline-flex items-center px-4 py-2 border border-primary-light rounded-md shadow-sm text-sm font-medium text-primary-dark bg-neutral-white hover:bg-neutral-gray hover:border-primary-medium transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-medium"
        >
          Add Another Course
        </button>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-md text-sm font-medium text-neutral-white bg-primary-medium hover:bg-primary-dark transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-medium"
        >
          Continue to Next Step
        </button>
      </div>
    </form>
  )
} 