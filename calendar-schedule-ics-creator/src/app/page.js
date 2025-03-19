import CourseForm from '@/components/CourseForm'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-float">
          <h1 className="heading-1 text-white mb-6">
            Course Schedule to Calendar
          </h1>
          <p className="text-xl text-blue-50 max-w-2xl mx-auto">
            Create your semester schedule and export it to your calendar
          </p>
        </div>
        <CourseForm />
      </div>
    </main>
  )
}
