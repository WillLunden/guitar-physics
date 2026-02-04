import SimulationTabs from "@/app/components/SimulationTabs";

export default function WaveEquationPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 lg:py-16">
      <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-orange-500 mb-4">
        The Wave Equation
      </h1>
      <p className="text-zinc-800 dark:text-zinc-400 mb-8">
        Understanding the mathematics and physics of vibrating strings
      </p>

      {/* Interactive Simulations */}
      <SimulationTabs className="mb-12" />

      {/* Step-by-step explanation */}
      <div className="space-y-12">
        {/* Section 1: Physical Interpretation */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-600 text-white text-sm font-bold">
              1
            </span>
            Physical Interpretation
          </h2>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            When you pluck a guitar string, you create a disturbance that
            travels along the string. The{" "}
            <strong>one-dimensional wave equation</strong> describes how this
            disturbance propagates:
          </p>

          <div className="bg-gradient-to-r from-purple-50 to-orange-50 dark:from-purple-900/20 dark:to-orange-900/20 p-6 rounded-xl my-6 border border-purple-200 dark:border-purple-800">
            <div className="text-center font-mono text-2xl" style={{ color: 'var(--text-primary)' }}>
              ∂²y/∂t² = c² · ∂²y/∂x²
            </div>
          </div>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            Let&apos;s break down what each term means:
          </p>

          <ul className="list-none space-y-4 my-6">
            <li className="flex gap-4 items-start">
              <span className="font-mono text-purple-600 dark:text-purple-400 font-bold">
                y(x,t)
              </span>
              <span className="text-zinc-900 dark:text-zinc-300">
                The vertical displacement of the string at position x and time
                t. This is what we see when the string vibrates.
              </span>
            </li>
            <li className="flex gap-4 items-start">
              <span className="font-mono text-purple-600 dark:text-purple-400 font-bold">
                ∂²y/∂t²
              </span>
              <span className="text-zinc-900 dark:text-zinc-300">
                The acceleration of the string at each point. This represents
                how quickly the velocity is changing. This is Newton&apos;s F = ma in
                disguise.
              </span>
            </li>
            <li className="flex gap-4 items-start">
              <span className="font-mono text-purple-600 dark:text-purple-400 font-bold">
                ∂²y/∂x²
              </span>
              <span className="text-zinc-900 dark:text-zinc-300">
                The curvature of the string. A more curved section experiences a
                greater restoring force pulling it back toward equilibrium.
              </span>
            </li>
            <li className="flex gap-4 items-start">
              <span className="font-mono text-purple-600 dark:text-purple-400 font-bold">
                c
              </span>
              <span className="text-zinc-900 dark:text-zinc-300">
                The wave velocity, determined by the string&apos;s physical
                properties: c = √(T/μ), where T is tension and μ is linear mass
                density.
              </span>
            </li>
          </ul>

          <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg">
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              <strong>Physical intuition:</strong> The wave equation says that
              the acceleration at any point is proportional to how curved the
              string is there. More curvature → more force → more acceleration.
              This is why waves propagate: a displaced region pulls its
              neighbors, which pull their neighbors, and so on.
            </p>
          </div>
        </section>

        {/* Section 2: Solving the Equation */}
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-200 mb-4 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-600 text-white text-sm font-bold">
              2
            </span>
            Solving the Equation
          </h2>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            We solve the wave equation using{" "}
            <strong>separation of variables</strong>. We assume the solution can
            be written as a product of a function of space and a function of
            time:
          </p>

          <div className="bg-gradient-to-r from-purple-50 to-orange-50 dark:from-purple-900/20 dark:to-orange-900/20 p-6 rounded-xl my-6 border border-purple-200 dark:border-purple-800">
            <div className="text-center font-mono text-xl" style={{ color: 'var(--text-primary)' }}>
              y(x,t) = X(x) · T(t)
            </div>
          </div>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            Substituting this into the wave equation and dividing both sides by
            X·T:
          </p>

          <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg my-4 font-mono text-center" style={{ color: 'var(--text-primary)' }}>
            (1/T) · d²T/dt² = c² · (1/X) · d²X/dx² = -ω²
          </div>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            Since the left side depends only on t and the right side only on x,
            both must equal the same constant (which we call -ω² for reasons
            that will become clear). This gives us two ordinary differential
            equations:
          </p>

          <div className="grid md:grid-cols-2 gap-4 my-6">
            <div className="bg-white dark:bg-zinc-900 p-4 rounded-lg border border-zinc-200 dark:border-zinc-700">
              <p className="font-mono text-center" style={{ color: 'var(--text-primary)' }}>
                d²X/dx² + k²X = 0
              </p>
              <p className="text-sm text-center mt-2" style={{ color: 'var(--text-muted)' }}>
                where k = ω/c
              </p>
            </div>
            <div className="bg-white dark:bg-zinc-900 p-4 rounded-lg border border-zinc-200 dark:border-zinc-700">
              <p className="font-mono text-center" style={{ color: 'var(--text-primary)' }}>
                d²T/dt² + ω²T = 0
              </p>
              <p className="text-sm text-center mt-2" style={{ color: 'var(--text-muted)' }}>
                Simple harmonic motion!
              </p>
            </div>
          </div>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            These are both simple harmonic oscillator equations with solutions:
          </p>

          <ul className="list-disc pl-6 space-y-2 text-zinc-900 dark:text-zinc-300">
            <li>
              <strong>Spatial part:</strong> X(x) = A·sin(kx) + B·cos(kx)
            </li>
            <li>
              <strong>Temporal part:</strong> T(t) = C·sin(ωt) + D·cos(ωt)
            </li>
          </ul>
        </section>

        {/* Section 3: Boundary Conditions */}
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-200 mb-4 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-600 text-white text-sm font-bold">
              3
            </span>
            Boundary Conditions
          </h2>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            A guitar string is fixed at both ends, at the nut (x = 0) and at the
            bridge (x = L). This gives us our{" "}
            <strong>boundary conditions</strong>:
          </p>

          <div className="bg-gradient-to-r from-purple-50 to-orange-50 dark:from-purple-900/20 dark:to-orange-900/20 p-6 rounded-xl my-6 border border-purple-200 dark:border-purple-800">
            <div className="text-center font-mono text-xl space-y-2" style={{ color: 'var(--text-primary)' }}>
              <div>y(0, t) = 0 for all t</div>
              <div>y(L, t) = 0 for all t</div>
            </div>
          </div>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            Applying the first boundary condition y(0, t) = 0:
          </p>

          <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg my-4">
            <p className="font-mono text-center" style={{ color: 'var(--text-primary)' }}>
              X(0) = A·sin(0) + B·cos(0) = B = 0
            </p>
            <p className="text-sm text-center mt-2" style={{ color: 'var(--text-muted)' }}>
              So B must be zero, leaving only the sine term.
            </p>
          </div>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            Applying the second boundary condition y(L, t) = 0:
          </p>

          <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg my-4">
            <p className="font-mono text-center" style={{ color: 'var(--text-primary)' }}>
              X(L) = A·sin(kL) = 0
            </p>
            <p className="text-sm text-center mt-2" style={{ color: 'var(--text-muted)' }}>
              This requires kL = nπ, where n = 1, 2, 3, ...
            </p>
          </div>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            This is the crucial result:{" "}
            <strong>
              only certain wavelengths (and therefore frequencies) are allowed
            </strong>
            . The wave number must satisfy:
          </p>

          <div className="bg-gradient-to-r from-purple-50 to-orange-50 dark:from-purple-900/20 dark:to-orange-900/20 p-6 rounded-xl my-6 border border-purple-200 dark:border-purple-800">
            <div className="text-center font-mono text-xl" style={{ color: 'var(--text-primary)' }}>
              k_n = nπ/L → λ_n = 2L/n
            </div>
          </div>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            The longest allowed wavelength is λ₁ = 2L (the fundamental), then
            λ₂ = L, λ₃ = 2L/3, and so on. Each corresponds to a standing wave
            pattern with n antinodes.
          </p>
        </section>

        {/* Section 4: Initial Conditions */}
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-200 mb-4 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-600 text-white text-sm font-bold">
              4
            </span>
            Initial Conditions
          </h2>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            To fully specify the string&apos;s motion, we need two initial
            conditions, the initial displacement and initial velocity at t = 0:
          </p>

          <div className="bg-gradient-to-r from-purple-50 to-orange-50 dark:from-purple-900/20 dark:to-orange-900/20 p-6 rounded-xl my-6 border border-purple-200 dark:border-purple-800">
            <div className="text-center font-mono text-lg space-y-2" style={{ color: 'var(--text-primary)' }}>
              <div>y(x, 0) = f(x) : initial shape</div>
              <div>∂y/∂t(x, 0) = g(x) : initial velocity</div>
            </div>
          </div>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            For a plucked string:
          </p>

          <ul className="list-disc pl-6 space-y-2 text-zinc-900 dark:text-zinc-300">
            <li>
              <strong>Initial shape f(x):</strong> A triangle shape, zero at both
              ends, peaked where you pluck. If you pluck at position x₀ with
              height h, the shape is two line segments meeting at (x₀, h).
            </li>
            <li>
              <strong>Initial velocity g(x):</strong> Zero everywhere. When you
              release the string, it&apos;s momentarily stationary before it
              starts moving.
            </li>
          </ul>

          <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg mt-4">
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              <strong>Why does pluck position matter?</strong> Plucking at
              different positions creates different triangular shapes, which
              decompose into different mixtures of harmonics. Plucking near the
              bridge emphasizes higher harmonics (brighter tone), while plucking
              near the middle emphasizes the fundamental (mellower tone).
            </p>
          </div>
        </section>

        {/* Section 5: Normal Modes */}
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-200 mb-4 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-600 text-white text-sm font-bold">
              5
            </span>
            Normal Modes & Superposition
          </h2>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            The solutions that satisfy the boundary conditions are the{" "}
            <strong>normal modes</strong>, the natural vibration patterns of the
            string:
          </p>

          <div className="bg-gradient-to-r from-purple-50 to-orange-50 dark:from-purple-900/20 dark:to-orange-900/20 p-6 rounded-xl my-6 border border-purple-200 dark:border-purple-800">
            <div className="text-center font-mono text-lg" style={{ color: 'var(--text-primary)' }}>
              y_n(x,t) = sin(nπx/L) · [A_n cos(ω_n t) + B_n sin(ω_n t)]
            </div>
          </div>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            The frequencies of these modes are:
          </p>

          <div className="bg-gradient-to-r from-purple-50 to-orange-50 dark:from-purple-900/20 dark:to-orange-900/20 p-6 rounded-xl my-6 border border-purple-200 dark:border-purple-800">
            <div className="text-center font-mono text-xl" style={{ color: 'var(--text-primary)' }}>
              f_n = n · √(T/μ) / (2L) = n · f₁
            </div>
          </div>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            Notice that the frequencies form a <strong>harmonic series</strong>:
            f₂ = 2f₁, f₃ = 3f₁, etc. This is why stringed instruments sound
            musical because the overtones are integer multiples of the fundamental.
          </p>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed mt-4">
            The general solution is a{" "}
            <strong>superposition of all modes</strong>:
          </p>

          <div className="bg-gradient-to-r from-purple-50 to-orange-50 dark:from-purple-900/20 dark:to-orange-900/20 p-6 rounded-xl my-6 border border-purple-200 dark:border-purple-800">
            <div className="text-center font-mono text-lg" style={{ color: 'var(--text-primary)' }}>
              y(x,t) = Σ A_n · sin(nπx/L) · cos(ω_n t)
            </div>
          </div>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            The coefficients A_n are determined by decomposing the initial shape
            f(x) using Fourier analysis:
          </p>

          <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg my-4 font-mono text-center" style={{ color: 'var(--text-primary)' }}>
            A_n = (2/L) ∫₀ᴸ f(x) · sin(nπx/L) dx
          </div>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            This is exactly what the simulation above does: it takes your pluck
            shape, computes the Fourier coefficients for each mode, and then
            sums up all the modes oscillating at their natural frequencies.
          </p>

          <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg mt-6">
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              <strong>Try it:</strong> In the simulation, enable &quot;Show
              first 5 modes&quot; to see how the individual harmonics combine.
              Pluck at different positions and watch how the mode amplitudes
              change. Pluck exactly at the center (L/2) and notice that all even
              harmonics vanish!
            </p>
          </div>
        </section>

        {/* Summary */}
        <section className="bg-gradient-to-br from-purple-100 to-orange-100 dark:from-purple-900/30 dark:to-orange-900/30 p-6 rounded-xl border border-purple-200 dark:border-purple-800">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-200 mb-4">
            Summary: From Pluck to Sound
          </h2>
          <ol className="list-decimal pl-6 space-y-2 text-zinc-900 dark:text-zinc-300">
            <li>
              You pluck the string, creating an initial triangular displacement.
            </li>
            <li>
              The wave equation governs how this shape evolves. Curvature creates
              restoring forces.
            </li>
            <li>
              Boundary conditions (fixed ends) quantize the allowed wavelengths.
            </li>
            <li>
              The initial shape decomposes into a sum of normal modes via
              Fourier analysis.
            </li>
            <li>
              Each mode oscillates at its natural frequency f_n = n·f₁, creating
              the harmonic series.
            </li>
            <li>
              The resulting vibration is detected by pickups (next section) and
              becomes the sound you hear.
            </li>
          </ol>
        </section>
      </div>
    </div>
  );
}
