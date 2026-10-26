import { Link } from 'react-router-dom'

const AdminHome = () => {
  return (
    <div className="bg-white text-[#1c2430]">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600&display=swap');`}</style>

      <section className="relative overflow-hidden bg-[#f2f5f7]">
        {/* subtle dot-grid texture, nods to "patterns & logic" */}
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage: 'radial-gradient(#1c2430 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            maskImage: 'radial-gradient(ellipse 70% 60% at 70% 30%, black, transparent)',
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 px-6 py-20 md:grid-cols-2 md:py-28">
          {/* Left: copy */}
          <div>
            <p className="text-sm font-medium text-[#5a6572]">Your control room</p>
            <h1
              className="mt-4 text-5xl leading-[1.05] md:text-6xl"
              style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600 }}
            >
              Run the
              <br />
              whole show.
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-[#5a6572]">
              Manage courses, track learners, and keep every grade and update moving in one place.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                to="/admin/courses"
                className="inline-flex items-center gap-2 rounded-lg bg-[#ff6b57] px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-[#ff8a7a]"
              >
                Manage courses
                <span aria-hidden="true">→</span>
              </Link>
              <Link
                to="/admin/students"
                className="inline-flex items-center gap-2 rounded-lg border border-[#1c2430]/15 bg-white px-6 py-3.5 text-base font-semibold text-[#1c2430] transition-colors hover:border-[#1c2430]/30"
              >
                View learners
              </Link>
            </div>
          </div>

          {/* Right: floating composition */}
          <div className="relative mx-auto h-80 w-full max-w-md md:h-96">
            <div className="absolute left-1/2 top-2 w-48 -translate-x-1/2 -rotate-3 rounded-2xl bg-white p-5 shadow-lg shadow-[#1c2430]/10 md:left-auto md:right-4 md:translate-x-0">
              <span className="text-sm font-medium text-[#ff6b57]">01</span>
              <p className="mt-1 text-lg font-semibold">Courses</p>
              <p className="text-sm text-[#5a6572]">12 active</p>
            </div>

            <div className="absolute bottom-16 left-0 flex h-28 w-28 rotate-3 flex-col items-center justify-center rounded-full bg-[#2fa8e0] text-white md:bottom-20">
              <span className="text-2xl font-semibold leading-none">248</span>
              <span className="mt-1 text-sm font-medium">Learners</span>
            </div>

            <div className="absolute bottom-0 right-2 -rotate-2 rounded-xl bg-[#1c2430] px-6 py-4 text-white shadow-lg shadow-[#1c2430]/20 md:right-6">
              <p className="text-lg font-semibold leading-tight">
                5 grades
                <br />
                pending review
              </p>
            </div>

            <div className="absolute right-16 top-24 h-4 w-4 rounded-full bg-[#8fc93a]" aria-hidden="true" />
            <div className="absolute left-10 top-0 h-3 w-3 rounded-full bg-[#ffc64b]" aria-hidden="true" />
          </div>
        </div>
      </section>
    </div>
  )
}

export default AdminHome