import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { fetchCourses, deleteCourses } from "../api/courses"

const colorMap = {
  coral: "#ff6b57",
  lime: "#8fc93a",
  sky: "#2fa8e0",
  violet: "#8b6ef2",
  yellow: "#ffc64b",
}

const AdminCourseList = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState(new Set())
  const [deleting, setDeleting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchCourses()
      .then(setCourses)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const toggleSelected = (id) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const clearSelection = () => setSelected(new Set())

  const handleBulkDelete = async () => {
    const count = selected.size
    if (count === 0) return
    if (!window.confirm(`Delete ${count} course${count > 1 ? "s" : ""} and all their grades? This cannot be undone.`)) return

    setDeleting(true)
    setError(null)
    try {
      await deleteCourses(Array.from(selected))
      setCourses((prev) => prev.filter((c) => !selected.has(c._id)))
      clearSelection()
    } catch (err) {
      setError(err.message)
    } finally {
      setDeleting(false)
    }
  }

  const allSelected = courses.length > 0 && selected.size === courses.length

  const toggleSelectAll = () => {
    setSelected(allSelected ? new Set() : new Set(courses.map((c) => c._id)))
  }

  return (
    <main className="bg-white text-[#1c2430]">
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#5a6572] hover:text-[#1c2430]"
        >
          ← Back
        </button>

        <div className="mt-4 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-medium text-[#5a6572]">Course management</p>
            <h1 className="mt-2 text-3xl md:text-4xl" style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600 }}>
              All courses
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {selected.size > 0 && (
              <button
                onClick={handleBulkDelete}
                disabled={deleting}
                className="inline-flex items-center gap-2 rounded-lg border border-[#ff6b57] px-5 py-2.5 text-sm font-semibold text-[#ff6b57] transition-colors hover:bg-[#ff6b57] hover:text-white disabled:opacity-60"
              >
                {deleting ? "Deleting…" : `Delete (${selected.size})`}
              </button>
            )}
            <Link
              to="/admin/courses/add"
              className="inline-flex items-center gap-2 rounded-lg bg-[#ff6b57] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#ff8a7a]"
            >
              + Add course
            </Link>
          </div>
        </div>

        {error && <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

        {!loading && courses.length > 0 && (
          <div className="mt-8 flex items-center gap-2">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleSelectAll}
              className="h-4 w-4 cursor-pointer rounded border-[#1c2430]/30 accent-[#ff6b57]"
            />
            <span className="text-sm text-[#5a6572]">
              {selected.size > 0 ? `${selected.size} selected` : "Select all"}
            </span>
          </div>
        )}

        {loading ? (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-40 animate-pulse rounded-xl bg-[#f2f5f7]" />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <p className="mt-10 text-sm text-[#5a6572]">No courses yet — add your first one.</p>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((item) => {
              const accent = colorMap[item.color] || "#5a6572"
              const isSelected = selected.has(item._id)
              return (
                <div
                  key={item._id}
                  onClick={() => navigate(`/admin/courses/${item.slug}/grades`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && navigate(`/admin/courses/${item.slug}/grades`)}
                  className={`group relative flex cursor-pointer flex-col gap-4 overflow-hidden rounded-xl border bg-white p-6 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#1c2430]/5 ${
                    isSelected ? "border-[#ff6b57] ring-1 ring-[#ff6b57]" : "border-[#1c2430]/8"
                  }`}
                >
                  <span className="absolute inset-y-0 left-0 w-1" style={{ backgroundColor: accent }} aria-hidden="true" />

                  <div className="flex items-start justify-between">
                    <span
                      className="flex h-11 w-11 items-center justify-center rounded-lg text-sm font-semibold text-white"
                      style={{ backgroundColor: accent }}
                    >
                      {item.short}
                    </span>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onClick={(e) => e.stopPropagation()}
                      onChange={() => toggleSelected(item._id)}
                      className="h-4 w-4 cursor-pointer rounded border-[#1c2430]/30 accent-[#ff6b57]"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <strong className="text-lg font-semibold leading-snug">{item.name}</strong>
                      <span
                        className="shrink-0 text-[#5a6572] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      >
                        ↗
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-[#5a6572]">{item.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}

export default AdminCourseList