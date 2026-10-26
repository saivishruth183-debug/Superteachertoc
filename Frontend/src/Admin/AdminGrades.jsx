import { useEffect, useRef, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { fetchGradesByCourse, deleteGrades, uploadGradePdf, deleteGradePdf, fileUrl } from "../api/grades"

const maxPdfSize = 4 * 1024 * 1024

const colorMap = {
  coral: "#ff6b57",
  lime: "#8fc93a",
  sky: "#2fa8e0",
  violet: "#8b6ef2",
  yellow: "#ffc64b",
}

const AdminGradeList = () => {
  const { slug } = useParams()
  const [course, setCourse] = useState(null)
  const [grades, setGrades] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState(new Set())
  const [deleting, setDeleting] = useState(false)
  const [pdfBusyId, setPdfBusyId] = useState(null)
  const fileInputRefs = useRef({})

  const load = () => {
    setLoading(true)
    fetchGradesByCourse(slug)
      .then((data) => {
        setCourse(data.course)
        setGrades(data.grades)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  const accent = course ? colorMap[course.color] || "#5a6572" : "#5a6572"

  const toggleSelected = (id) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const allSelected = grades.length > 0 && selected.size === grades.length
  const toggleSelectAll = () => {
    setSelected(allSelected ? new Set() : new Set(grades.map((g) => g._id)))
  }

  const handleBulkDelete = async () => {
    const count = selected.size
    if (count === 0) return
    if (!window.confirm(`Delete ${count} grade${count > 1 ? "s" : ""}? This cannot be undone.`)) return

    setDeleting(true)
    setError(null)
    try {
      await deleteGrades(Array.from(selected))
      setGrades((prev) => prev.filter((g) => !selected.has(g._id)))
      setSelected(new Set())
    } catch (err) {
      setError(err.message)
    } finally {
      setDeleting(false)
    }
  }

  const handlePdfPick = (gradeId) => {
    fileInputRefs.current[gradeId]?.click()
  }

  const handlePdfChange = async (gradeId, e) => {
    const file = e.target.files?.[0]
    e.target.value = "" // allow re-selecting the same file later
    if (!file) return

    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed")
      return
    }
    if (file.size > maxPdfSize) {
      setError("PDF files must be 4 MB or smaller")
      return
    }

    setPdfBusyId(gradeId)
    setError(null)
    try {
      const updated = await uploadGradePdf(gradeId, file)
      setGrades((prev) => prev.map((g) => (g._id === gradeId ? updated : g)))
    } catch (err) {
      setError(err.message)
    } finally {
      setPdfBusyId(null)
    }
  }

  const handlePdfRemove = async (gradeId) => {
    if (!window.confirm("Remove this PDF?")) return
    setPdfBusyId(gradeId)
    setError(null)
    try {
      const updated = await deleteGradePdf(gradeId)
      setGrades((prev) => prev.map((g) => (g._id === gradeId ? updated : g)))
    } catch (err) {
      setError(err.message)
    } finally {
      setPdfBusyId(null)
    }
  }

  return (
    <main className="bg-white text-[#1c2430]">
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <Link to="/admin/courses" className="text-sm font-medium text-[#5a6572] hover:text-[#1c2430]">
          ← All courses
        </Link>

        <div className="mt-4 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div className="flex items-center gap-4">
            {course && (
              <span
                className="flex h-12 w-12 items-center justify-center rounded-lg text-sm font-semibold text-white"
                style={{ backgroundColor: accent }}
              >
                {course.short}
              </span>
            )}
            <div>
              <p className="text-sm font-medium text-[#5a6572]">Grade management</p>
              <h1 className="text-2xl font-semibold md:text-3xl" style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600 }}>
                {course ? course.name : "Loading…"}
              </h1>
            </div>
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
              to={`/admin/courses/${slug}/grades/add`}
              className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-colors"
              style={{ backgroundColor: accent }}
            >
              + Add grade
            </Link>
          </div>
        </div>

        {error && <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

        {!loading && grades.length > 0 && (
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
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-36 animate-pulse rounded-xl bg-[#f2f5f7]" />
            ))}
          </div>
        ) : grades.length === 0 ? (
          <p className="mt-10 text-sm text-[#5a6572]">No grades yet — add the first one.</p>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {grades.map((grade) => {
              const isSelected = selected.has(grade._id)
              const hasPdf = Boolean(grade.pdf?.url)
              const busy = pdfBusyId === grade._id
              return (
                <div
                  key={grade._id}
                  className={`relative flex flex-col gap-3 overflow-hidden rounded-xl border p-5 transition-all ${
                    isSelected ? "border-[#ff6b57] ring-1 ring-[#ff6b57]" : "border-[#1c2430]/8"
                  }`}
                >
                  <span className="absolute inset-y-0 left-0 w-1" style={{ backgroundColor: accent }} aria-hidden="true" />

                  <div className="flex items-start justify-between">
                    <strong className="text-base font-semibold">{grade.name}</strong>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelected(grade._id)}
                      className="h-4 w-4 cursor-pointer rounded border-[#1c2430]/30 accent-[#ff6b57]"
                    />
                  </div>

                  <p className="text-sm leading-relaxed text-[#5a6572]">{grade.description}</p>

                  {/* PDF corner control */}
                  <div className="mt-auto flex items-center justify-between border-t border-[#1c2430]/8 pt-3">
                    {hasPdf ? (
                      <a
                        href={fileUrl(grade.pdf.url)}
                        target="_blank"
                        rel="noreferrer"
                        download={grade.pdf.originalName}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-[#2fa8e0] hover:underline"
                      >
                        📄 View PDF
                      </a>
                    ) : (
                      <span className="text-sm text-[#5a6572]">No PDF attached</span>
                    )}

                    <div className="flex items-center gap-3 text-sm font-medium">
                      <button
                        onClick={() => handlePdfPick(grade._id)}
                        disabled={busy}
                        className="text-[#5a6572] hover:text-[#1c2430] disabled:opacity-60"
                      >
                        {busy ? "…" : hasPdf ? "Replace" : "Add PDF"}
                      </button>
                      {hasPdf && (
                        <button
                          onClick={() => handlePdfRemove(grade._id)}
                          disabled={busy}
                          className="text-[#ff6b57] hover:underline disabled:opacity-60"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <input
                      type="file"
                      accept="application/pdf"
                      ref={(el) => (fileInputRefs.current[grade._id] = el)}
                      onChange={(e) => handlePdfChange(grade._id, e)}
                      className="hidden"
                    />
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

export default AdminGradeList