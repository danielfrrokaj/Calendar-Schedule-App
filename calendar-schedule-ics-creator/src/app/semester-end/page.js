'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SemesterEnd() {
  const router = useRouter()
  const [endDate, setEndDate] = useState('')
  const [courses, setCourses] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    const savedCourses = localStorage.getItem('courses')
    if (!savedCourses) {
      router.push('/')
      return
    }
    setCourses(JSON.parse(savedCourses))
  }, [router])

  const validateDate = (dateStr) => {
    const [day, month, year] = dateStr.split('/')
    const date = new Date(year, month - 1, day)
    const today = new Date()
    
    if (isNaN(date.getTime())) {
      return 'Invalid date format'
    }
    
    if (date < today) {
      return 'End date must be in the future'
    }
    
    return ''
  }

  const handleDateChange = (e) => {
    const value = e.target.value
    let formattedValue = value

    // Remove any non-digit characters
    const digits = value.replace(/\D/g, '')
    
    // Format as dd/mm/yyyy
    if (digits.length > 0) {
      if (digits.length <= 2) {
        formattedValue = digits
      } else if (digits.length <= 4) {
        formattedValue = `${digits.slice(0, 2)}/${digits.slice(2)}`
      } else {
        formattedValue = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`
      }
    }

    setEndDate(formattedValue)
    setError(validateDate(formattedValue))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const error = validateDate(endDate)
    
    if (error) {
      setError(error)
      return
    }

    // Convert dd/mm/yyyy to yyyy-mm-dd for storage
    const [day, month, year] = endDate.split('/')
    const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    
    localStorage.setItem('semesterEnd', isoDate)
    router.push('/generate')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="heading-1 text-white mb-6">
            Set Semester End Date
          </h1>
          <p className="text-xl text-blue-50 max-w-2xl mx-auto">
            Choose when your semester ends to generate your calendar
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                Semester End Date
              </label>
              <input
                type="text"
                id="endDate"
                value={endDate}
                onChange={handleDateChange}
                placeholder="DD/MM/YYYY"
                className={`mt-1 block w-full px-3 py-2 rounded-md border ${
                  error ? 'border-red-500' : 'border-gray-200'
                } text-gray-900 placeholder-gray-400`}
                required
              />
              {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
              )}
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => router.push('/')}
                className="button-secondary px-4 py-2"
              >
                Back to Courses
              </button>
              <button
                type="submit"
                disabled={!!error}
                className={`button-primary px-6 py-2 ${error ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Continue
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
} 