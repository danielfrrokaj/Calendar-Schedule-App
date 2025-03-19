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
      const startDateTime = new Date()
      
      courses.forEach(course => {
        course.days.forEach(day => {
          const dayMap = { MON: 1, TUE: 2, WED: 3, THU: 4, FRI: 5 }
          const dayNumber = dayMap[day]
          
          let currentDate = new Date(startDateTime)
          
          while (currentDate.getDay() !== dayNumber) {
            currentDate.setDate(currentDate.getDate() + 1)
          }

          while (currentDate <= endDateTime) {
            const dateStr = currentDate.toISOString().split('T')[0].replace(/-/g, '')
            const [startHour] = course.startTime.split(':')
            const [endHour] = course.endTime.split(':')

            icsContent = icsContent.concat([
              'BEGIN:VEVENT',
              `SUMMARY:${course.name}`,
              `LOCATION:${course.room || 'TBA'}`,
              `DTSTART:${dateStr}T${startHour}0000`,
              `DTEND:${dateStr}T${endHour}0000`,
              'RRULE:FREQ=WEEKLY;UNTIL=' + endDate.replace(/-/g, '') + 'T235959Z',
              'END:VEVENT'
            ])

            currentDate.setDate(currentDate.getDate() + 7)
          }
        })
      })

      icsContent.push('END:VCALENDAR')

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
    <main className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-float">
          <h1 className="heading-1 text-white mb-6">
            Generate Calendar
          </h1>
          <p className="text-xl text-blue-50 max-w-2xl mx-auto">
            Review your schedule and generate your calendar file
          </p>
        </div>

        <div className="card space-y-8">
          <div>
            <h2 className="heading-2 text-gray-900 mb-6">Schedule Summary</h2>
            <div className="divide-y divide-gray-100">
              {courses.map((course) => (
                <div key={course.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{course.name}</h3>
                      <div className="mt-1 space-y-1">
                        <p className="text-gray-600 flex items-center">
                          <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {course.days.join(', ')}
                        </p>
                        <p className="text-gray-600 flex items-center">
                          <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {course.startTime} - {course.endTime}
                        </p>
                        <p className="text-gray-600 flex items-center">
                          <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          {course.room || 'Room: TBA'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="pt-4">
                <p className="text-gray-600 flex items-center">
                  <svg className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Semester End Date: {new Date(endDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-6">
            <button
              type="button"
              onClick={() => router.push('/semester-end')}
              className="button-secondary px-6 py-3"
            >
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to End Date
            </button>
            <button
              onClick={generateICS}
              disabled={isGenerating}
              className={`button-primary px-8 py-3 ${isGenerating ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  Generate ICS File
                  <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
} 