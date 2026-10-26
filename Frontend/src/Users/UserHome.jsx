import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, BookOpen, Users, Code2, Palette, Rocket, CheckCircle2 } from 'lucide-react'

const features = [
  {
    icon: Code2,
    title: 'Learn by building',
    description: 'Every lesson ends with a real project, not just theory.',
    color: '#ff6b57',
  },
  {
    icon: Palette,
    title: 'Creative freedom',
    description: 'Turn code into animations, games, and interactive art.',
    color: '#2fa8e0',
  },
  {
    icon: Rocket,
    title: 'Progress at your pace',
    description: 'Structured grades that build on each other, step by step.',
    color: '#8fc93a',
  },
]

const stats = [
  { value: '12+', label: 'Courses' },
  { value: '2.4k', label: 'Learners' },
  { value: '98%', label: 'Completion rate' },
]

const UserHome = () => {
  return (
    <div className="bg-white text-[#1c2430]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#f2f5f7]">
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
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-medium text-[#5a6572] shadow-sm">
              <Sparkles className="h-4 w-4 text-[#ff6b57]" strokeWidth={2.25} />
              Your curriculum, clearly mapped
            </span>

            <h1
              className="mt-6 text-5xl leading-[1.05] md:text-6xl"
              style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600 }}
            >
              Make room for
              <br />
              curiosity.
            </h1>

            <p className="mt-6 max-w-md text-lg leading-relaxed text-[#5a6572]">
              Find the right course, open a grade, and see exactly what your learners will discover next.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                to="/user/courses"
                className="group inline-flex items-center gap-2 rounded-lg bg-[#ff6b57] px-6 py-3.5 text-base font-semibold text-white transition-all hover:bg-[#ff8a7a] hover:shadow-lg hover:shadow-[#ff6b57]/25"
              >
                Explore courses
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.5} />
              </Link>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[#5a6572]">
                <CheckCircle2 className="h-4 w-4 text-[#8fc93a]" strokeWidth={2.25} />
                No credit card required
              </span>
            </div>

            {/* mini stats */}
            <div className="mt-12 flex gap-8 border-t border-[#1c2430]/10 pt-6">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p
                    className="text-2xl font-semibold"
                    style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600 }}
                  >
                    {stat.value}
                  </p>
                  <p className="text-sm text-[#5a6572]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: floating composition */}
          <div className="relative mx-auto h-80 w-full max-w-md md:h-96">
            <div className="absolute left-1/2 top-2 w-48 -translate-x-1/2 -rotate-3 rounded-2xl bg-white p-5 shadow-lg shadow-[#1c2430]/10 md:left-auto md:right-4 md:translate-x-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#ff6b57]/10">
                <BookOpen className="h-4.5 w-4.5 text-[#ff6b57]" strokeWidth={2.25} />
              </div>
              <p className="mt-3 text-lg font-semibold">Curiosity</p>
              <p className="text-sm text-[#5a6572]">starts here</p>
            </div>

            <div className="absolute bottom-16 left-0 flex h-28 w-28 rotate-3 flex-col items-center justify-center rounded-full bg-[#2fa8e0] text-white shadow-lg shadow-[#2fa8e0]/30 md:bottom-20">
              <Users className="h-6 w-6" strokeWidth={2} />
              <span className="mt-1 text-sm font-medium">Ideas</span>
            </div>

            <div className="absolute bottom-0 right-2 -rotate-2 rounded-xl bg-[#1c2430] px-6 py-4 text-white shadow-lg shadow-[#1c2430]/20 md:right-6">
              <Rocket className="h-5 w-5 text-[#ffc64b]" strokeWidth={2.25} />
              <p className="mt-2 text-lg font-semibold leading-tight">
                Learn by
                <br />
                doing
              </p>
            </div>

            <div className="absolute right-16 top-24 h-4 w-4 rounded-full bg-[#8fc93a]" aria-hidden="true" />
            <div className="absolute left-10 top-0 h-3 w-3 rounded-full bg-[#ffc64b]" aria-hidden="true" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <div className="max-w-lg">
          <p className="text-sm font-medium text-[#5a6572]">Why learners stick around</p>
          <h2
            className="mt-2 text-3xl md:text-4xl"
            style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600 }}
          >
            Built for curiosity, not cramming.
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-xl border border-[#1c2430]/8 p-6 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-[#1c2430]/5"
              >
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${feature.color}1a` }}
                >
                  <Icon className="h-5 w-5" style={{ color: feature.color }} strokeWidth={2.25} />
                </div>
                <p className="mt-5 text-lg font-semibold">{feature.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-[#5a6572]">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </section>

    </div>
  )
}

export default UserHome