'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Generate() {
  const router = useRouter()
  const [courses, setCourses] = useState([])
  const [endDate, setEndDate] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    const savedCourses = localStorage.getItem('courses')
    const savedEndDate = localStorage.getItem('semesterEnd')
    
    if (!savedCourses || !savedEndDate) {
      router.push('/')
      return
    }

    setCourses(JSON.parse(savedCourses))
    setEndDate(savedEndDate)
  }, [router])

  const generateICS = () => {
    setIsGenerating(true)
    
    try {
      let icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Calendar Schedule Generator//EN',
        'CALSCALE:GREGORIAN',
      ]

      const endDateTime = new Date(endDate)
      const startDateTime = new Date() // Using current date as start
      
      courses.forEach(course => {
        course.days.forEach(day => {
          // Map days to numbers (0 = Monday, 6 = Sunday)
          const dayMap = { MON: 1, TUE: 2, WED: 3, THU: 4, FRI: 5 }
          const dayNumber = dayMap[day]
          
          let currentDate = new Date(startDateTime)
          
          // Set to first occurrence of this day
          while (currentDate.getDay() !== dayNumber) {
            currentDate.setDate(currentDate.getDate() + 1)
          }

          // Create events for each occurrence until end date
          while (currentDate <= endDateTime) {
            const dateStr = currentDate.toISOString().split('T')[0].replace(/-/g, '')
            const [startHour, startMinute] = course.startTime.split(':')
            const [endHour, endMinute] = course.endTime.split(':')

            icsContent = icsContent.concat([
              'BEGIN:VEVENT',
              `SUMMARY:${course.name}`,
              `DTSTART:${dateStr}T${startHour}${startMinute}00`,
              `DTEND:${dateStr}T${endHour}${endMinute}00`,
              'RRULE:FREQ=WEEKLY;UNTIL=' + endDate.replace(/-/g, '') + 'T235959Z',
              'END:VEVENT'
            ])

            // Move to next week
            currentDate.setDate(currentDate.getDate() + 7)
          }
        })
      })

      icsContent.push('END:VCALENDAR')

      // Create and download the file
      const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'semester_schedule.ics'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error generating ICS file:', error)
      alert('There was an error generating your calendar file. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Generate Calendar
          </h1>
          <p className="text-lg text-gray-600">
            Review your schedule and generate your calendar file
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Schedule Summary</h2>
          <div className="space-y-6">
            {courses.map((course) => (
              <div key={course.id} className="border-b pb-4">
                <h3 className="font-medium">{course.name}</h3>
                <p className="text-gray-600">
                  Days: {course.days.join(', ')}
                </p>
                <p className="text-gray-600">
                  Time: {course.startTime} - {course.endTime}
                </p>
              </div>
            ))}
            <div className="pt-4">
              <p className="text-gray-600">
                Semester End Date: {new Date(endDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => router.push('/semester-end')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back to End Date
          </button>
          <button
            onClick={generateICS}
            disabled={isGenerating}
            className={`inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white
              ${isGenerating
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
          >
            {isGenerating ? 'Generating...' : 'Generate ICS File'}
          </button>
        </div>
      </div>
    </main>
  )
} 