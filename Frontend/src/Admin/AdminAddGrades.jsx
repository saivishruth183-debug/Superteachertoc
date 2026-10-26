import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { fetchGradesByCourse, createGrade } from "../api/grades"

const colorMap = {
  coral: "#ff6b57",
  lime: "#8fc93a",
  sky: "#2fa8e0",
  violet: "#8b6ef2",
  yellow: "#ffc64b",
}

const emptyForm = { name: "", description: "" }
const maxPdfSize = 4 * 1024 * 1024

const AdminAddGrade = () => {
  const { slug } = useParams()
  const [course, setCourse] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [file, setFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchGradesByCourse(slug)
      .then((data) => setCourse(data.course))
      .catch((err) => setError(err.message))
  }, [slug])

  const accent = course ? colorMap[course.color] || "#5a6572" : "#5a6572"

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleFileChange = (e) => {
    const picked = e.target.files?.[0]
    if (picked && picked.type !== "application/pdf") {
      setError("Only PDF files are allowed")
      e.target.value = ""
      return
    }
    if (picked && picked.size > maxPdfSize) {
      setError("PDF files must be 4 MB or smaller")
      e.target.value = ""
      return
    }
    setError(null)
    setFile(picked || null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await createGrade(slug, form, file)
      navigate(`/admin/courses/${slug}/grades`)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="bg-white text-[#1c2430]">
      <section className="mx-auto max-w-3xl px-6 py-16 md:py-20">
        <p className="text-sm font-medium text-[#5a6572]">
          Grade management {course && `· ${course.name}`}
        </p>
        <h1 className="mt-2 text-3xl md:text-4xl" style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600 }}>
          Add a new grade
        </h1>

        {error && <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

        <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-1 gap-5 rounded-xl border border-[#1c2430]/8 p-6">
          <div>
            <label className="text-sm font-medium text-[#5a6572]">Grade name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="e.g. Grade 1"
              className="mt-1.5 w-full rounded-lg border border-[#1c2430]/15 px-3.5 py-2.5 text-sm focus:outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[#5a6572]">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={3}
              placeholder="What learners will cover in this grade"
              className="mt-1.5 w-full rounded-lg border border-[#1c2430]/15 px-3.5 py-2.5 text-sm focus:outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[#5a6572]">Attach PDF (optional)</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="mt-1.5 w-full rounded-lg border border-dashed border-[#1c2430]/20 px-3.5 py-2.5 text-sm file:mr-3 file:rounded-md file:border-0 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white"
              style={{ "--file-bg": accent }}
            />
            {file && <p className="mt-1.5 text-sm text-[#5a6572]">Selected: {file.name}</p>}
          </div>

          {/* live preview */}
          <div>
            <p className="text-sm font-medium text-[#5a6572]">Preview</p>
            <div className="relative mt-2 flex max-w-xs flex-col gap-2 overflow-hidden rounded-xl border border-[#1c2430]/8 p-5">
              <span className="absolute inset-y-0 left-0 w-1" style={{ backgroundColor: accent }} aria-hidden="true" />
              <strong className="text-base font-semibold">{form.name || "Grade name"}</strong>
              <p className="text-sm text-[#5a6572]">{form.description || "Description will appear here."}</p>
              <p className="text-sm text-[#5a6572]">{file ? `📄 ${file.name}` : "No PDF attached"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white transition-colors disabled:opacity-60"
              style={{ backgroundColor: accent }}
            >
              {submitting ? "Saving…" : "Add grade"}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/admin/courses/${slug}/grades`)}
              className="text-sm font-medium text-[#5a6572] hover:text-[#1c2430]"
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}

export default AdminAddGrade