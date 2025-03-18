'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SemesterEnd() {
  const router = useRouter()
  const [endDate, setEndDate] = useState('')
  const [courses, setCourses] = useState([])

  useEffect(() => {
    const savedCourses = localStorage.getItem('courses')
    if (!savedCourses) {
      router.push('/')
      return
    }
    setCourses(JSON.parse(savedCourses))
  }, [router])

  const handleSubmit = (e) => {
    e.preventDefault()
    localStorage.setItem('semesterEnd', endDate)
    router.push('/generate')
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-primary-dark to-primary-medium py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-white mb-4">
            Set Semester End Date
          </h1>
          <p className="text-lg text-neutral-gray">
            Choose when your semester ends to generate your calendar
          </p>
        </div>

        <div className="bg-neutral-white shadow-xl rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-primary-dark">
                Semester End Date
              </label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1 block w-full rounded-md bg-neutral-white border-primary-light text-primary-dark shadow-sm focus:border-primary-medium focus:ring-primary-medium focus:ring-opacity-50"
                required
              />
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => router.push('/')}
                className="inline-flex items-center px-4 py-2 border border-primary-light rounded-md shadow-sm text-sm font-medium text-primary-dark bg-neutral-white hover:bg-neutral-gray hover:border-primary-medium transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-medium"
              >
                Back to Courses
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-md text-sm font-medium text-neutral-white bg-primary-medium hover:bg-primary-dark transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-medium"
              >
                Continue to Generate
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
} 