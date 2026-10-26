import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { createCourse } from "../api/courses"

const colorMap = {
  coral: "#ff6b57",
  lime: "#8fc93a",
  sky: "#2fa8e0",
  violet: "#8b6ef2",
  yellow: "#ffc64b",
}

const emptyForm = { name: "", short: "", color: "coral", description: "" }

const AdminAddCourse = () => {
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await createCourse(form)
      navigate("/admin/courses")
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="bg-white text-[#1c2430]">
      <section className="mx-auto max-w-3xl px-6 py-16 md:py-20">
        <p className="text-sm font-medium text-[#5a6572]">Course management</p>
        <h1 className="mt-2 text-3xl md:text-4xl" style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600 }}>
          Add a new course
        </h1>

        {error && <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

        <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-1 gap-5 rounded-xl border border-[#1c2430]/8 p-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-[#5a6572]">Course name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="e.g. HappyCoder 3.0"
              className="mt-1.5 w-full rounded-lg border border-[#1c2430]/15 px-3.5 py-2.5 text-sm focus:border-[#ff6b57] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[#5a6572]">Short badge (max 5 chars)</label>
            <input
              name="short"
              value={form.short}
              onChange={handleChange}
              required
              maxLength={5}
              placeholder="e.g. HC"
              className="mt-1.5 w-full rounded-lg border border-[#1c2430]/15 px-3.5 py-2.5 text-sm focus:border-[#ff6b57] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[#5a6572]">Accent color</label>
            <select
              name="color"
              value={form.color}
              onChange={handleChange}
              className="mt-1.5 w-full rounded-lg border border-[#1c2430]/15 px-3.5 py-2.5 text-sm focus:border-[#ff6b57] focus:outline-none"
            >
              {Object.keys(colorMap).map((c) => (
                <option key={c} value={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-[#5a6572]">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={3}
              placeholder="Short one-liner shown on the course card"
              className="mt-1.5 w-full rounded-lg border border-[#1c2430]/15 px-3.5 py-2.5 text-sm focus:border-[#ff6b57] focus:outline-none"
            />
          </div>

          {/* live preview */}
          <div className="sm:col-span-2">
            <p className="text-sm font-medium text-[#5a6572]">Preview</p>
            <div className="relative mt-2 flex max-w-xs flex-col gap-3 overflow-hidden rounded-xl border border-[#1c2430]/8 p-5">
              <span className="absolute inset-y-0 left-0 w-1" style={{ backgroundColor: colorMap[form.color] }} aria-hidden="true" />
              <span
                className="flex h-10 w-10 items-center justify-center rounded-lg text-xs font-semibold text-white"
                style={{ backgroundColor: colorMap[form.color] }}
              >
                {form.short || "??"}
              </span>
              <strong className="text-base font-semibold">{form.name || "Course name"}</strong>
              <p className="text-sm text-[#5a6572]">{form.description || "Description will appear here."}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-lg bg-[#ff6b57] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#ff8a7a] disabled:opacity-60"
            >
              {submitting ? "Saving…" : "Add course"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/courses")}
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

export default AdminAddCourse