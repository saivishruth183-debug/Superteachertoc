import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, BookOpen, Search } from 'lucide-react'
import { fetchCourses } from '../api/courses'

const colorMap = {
  coral: '#ff6b57',
  lime: '#8fc93a',
  sky: '#2fa8e0',
  violet: '#8b6ef2',
  yellow: '#ffc64b',
}

const Courses = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    fetchCourses()
      .then((data) => {
        if (mounted) setCourses(data)
      })
      .catch((err) => {
        if (mounted) setError(err.message)
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [])

  return (
    <main className="bg-white text-[#1c2430]">
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="flex items-center gap-2 text-sm font-medium text-[#5a6572]">
              <BookOpen className="h-4 w-4 text-[#ff6b57]" strokeWidth={2.25} />
              The library
            </p>
            <h2
              className="mt-2 text-3xl md:text-4xl"
              style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600 }}
            >
              Choose a course
            </h2>
          </div>
          <span className="rounded-full border border-[#1c2430]/10 px-3 py-1 text-sm text-[#5a6572]">
            {loading ? '...' : `${courses.length} learning paths`}
          </span>
        </div>

        {loading && (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-40 animate-pulse rounded-xl bg-[#f2f5f7]" />
            ))}
          </div>
        )}

        {!loading && error && (
          <p className="mt-10 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
        )}

        {!loading && !error && courses.length === 0 && (
          <div className="mt-10 flex flex-col items-center gap-3 rounded-xl border border-dashed border-[#1c2430]/15 px-6 py-14 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f2f5f7]">
              <Search className="h-5 w-5 text-[#5a6572]" strokeWidth={2} />
            </div>
            <p className="text-sm text-[#5a6572]">No courses available yet. Check back soon.</p>
          </div>
        )}

        {!loading && !error && courses.length > 0 && (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((item) => {
              const accent = colorMap[item.color] || '#5a6572'
              return (
                <Link
                  to={`/courses/${item.slug}`}
                  key={item._id}
                  className="group relative flex flex-col gap-4 overflow-hidden rounded-xl border border-[#1c2430]/8 bg-white p-6 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#1c2430]/5"
                >
                  <span
                    className="absolute inset-y-0 left-0 w-1"
                    style={{ backgroundColor: accent }}
                    aria-hidden="true"
                  />

                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-lg text-sm font-semibold text-white"
                    style={{ backgroundColor: accent }}
                  >
                    {item.short}
                  </span>

                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <strong className="text-lg font-semibold leading-snug">{item.name}</strong>
                      <ArrowUpRight
                        className="mt-0.5 h-4 w-4 shrink-0 text-[#5a6572] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        strokeWidth={2.25}
                        aria-hidden="true"
                      />
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-[#5a6572]">{item.description}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}

export default Courses