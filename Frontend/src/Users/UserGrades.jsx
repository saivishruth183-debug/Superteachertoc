import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { ArrowLeft, Eye, Download, FileX2, GraduationCap } from "lucide-react"
import { fetchGradesByCourse, fileUrl } from "../api/grades"

const colorMap = {
  coral: "#ff6b57",
  lime: "#8fc93a",
  sky: "#2fa8e0",
  violet: "#8b6ef2",
  yellow: "#ffc64b",
}

const UserGrades = () => {
  const { slug } = useParams()
  const [course, setCourse] = useState(null)
  const [grades, setGrades] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    fetchGradesByCourse(slug)
      .then((data) => {
        if (!mounted) return
        setCourse(data.course)
        setGrades(data.grades)
      })
      .catch((err) => mounted && setError(err.message))
      .finally(() => mounted && setLoading(false))
    return () => {
      mounted = false
    }
  }, [slug])

  const accent = course ? colorMap[course.color] || "#5a6572" : "#5a6572"

  return (
    <main className="bg-white text-[#1c2430]">
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <Link
          to="/user/courses"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#5a6572] transition-colors hover:text-[#1c2430]"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2.25} />
          All courses
        </Link>

        {loading && (
          <div className="mt-6">
            <div className="h-14 w-64 animate-pulse rounded-lg bg-[#f2f5f7]" />
            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-36 animate-pulse rounded-xl bg-[#f2f5f7]" />
              ))}
            </div>
          </div>
        )}

        {!loading && error && (
          <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
        )}

        {!loading && !error && course && (
          <>
            <div className="mt-4 flex items-center gap-4">
              <span
                className="flex h-14 w-14 items-center justify-center rounded-xl text-base font-semibold text-white"
                style={{ backgroundColor: accent }}
              >
                {course.short}
              </span>
              <div>
                <h1
                  className="text-3xl md:text-4xl"
                  style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600 }}
                >
                  {course.name}
                </h1>
                <p className="mt-1 text-[#5a6572]">{course.description}</p>
              </div>
            </div>

            <div className="mt-12 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-[#5a6572]" strokeWidth={2} />
                <h2 className="text-xl font-semibold">Grades</h2>
              </div>
              <span className="rounded-full border border-[#1c2430]/10 px-3 py-1 text-sm text-[#5a6572]">
                {grades.length} {grades.length === 1 ? "grade" : "grades"}
              </span>
            </div>

            {grades.length === 0 ? (
              <div className="mt-6 flex flex-col items-center gap-3 rounded-xl border border-dashed border-[#1c2430]/15 px-6 py-14 text-center">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f2f5f7]">
                  <FileX2 className="h-5 w-5 text-[#5a6572]" strokeWidth={2} />
                </div>
                <p className="text-sm text-[#5a6572]">No grades published for this course yet.</p>
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {grades.map((grade) => {
                  const pdfUrl = grade.pdf?.url ? fileUrl(grade.pdf.url) : null
                  const pdfName = grade.pdf ? grade.pdf.originalName : null

                  return (
                    <div
                      key={grade._id}
                      className="relative flex flex-col gap-3 overflow-hidden rounded-xl border border-[#1c2430]/8 p-6 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#1c2430]/5"
                    >
                      <span
                        className="absolute inset-y-0 left-0 w-1"
                        style={{ backgroundColor: accent }}
                        aria-hidden="true"
                      />

                      <strong className="text-lg font-semibold leading-snug">{grade.name}</strong>
                      <p className="text-sm leading-relaxed text-[#5a6572]">{grade.description}</p>

                      {pdfUrl ? (
                        <div className="mt-2 flex flex-wrap items-center gap-3">

                          {/* View PDF */}
                          <a
                            href={pdfUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex w-fit items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors"
                            style={{ backgroundColor: accent }}
                          >
                            <Eye className="h-4 w-4" strokeWidth={2.25} />
                            View
                          </a>

                          {/* Download PDF */}
                          <a
                            href={pdfUrl}
                            download={pdfName}
                            className="inline-flex w-fit items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors hover:bg-[#f2f5f7]"
                            style={{ borderColor: accent, color: accent }}
                          >
                            <Download className="h-4 w-4" strokeWidth={2.25} />
                            Download
                          </a>

                        </div>
                      ) : (
                        <span className="mt-2 inline-flex w-fit items-center gap-2 rounded-lg bg-[#f2f5f7] px-4 py-2 text-sm text-[#5a6572]">
                          <FileX2 className="h-4 w-4" strokeWidth={2} />
                          No materials yet
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}
      </section>
    </main>
  )
}

export default UserGrades