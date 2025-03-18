import CourseForm from '@/components/CourseForm'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-primary-dark to-primary-medium py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-white mb-4">
            Course Schedule to Calendar
          </h1>
          <p className="text-lg text-neutral-gray">
            Create your semester schedule and export it to your calendar
          </p>
        </div>
        <CourseForm />
      </div>
    </main>
  )
}
