import IntermodulationSim from "@/app/components/IntermodulationSim";

export default function IntermodulationPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 lg:py-16">
      <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-orange-500 mb-4">
        Intermodulation Distortion
      </h1>
      <p className="text-zinc-800 dark:text-zinc-400 mb-8">
        Why power chords sound great but complex chords get muddy through
        distortion
      </p>

      {/* Interactive Simulation */}
      <IntermodulationSim className="mb-12" />

      {/* Physics explanation */}
      <div className="space-y-8">
        {/* What is Intermodulation */}
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-200 mb-4">
            What is Intermodulation?
          </h2>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            When two or more frequencies pass through a nonlinear system (like a
            distorted amplifier), the system generates new frequencies that were
            not present in the input. These new frequencies appear at sums and
            differences of the original frequencies.
          </p>

          <div className="bg-gradient-to-r from-purple-50 to-orange-50 dark:from-purple-900/20 dark:to-orange-900/20 p-6 rounded-xl my-6 border border-purple-200 dark:border-purple-800">
            <p className="text-center font-mono text-zinc-900 dark:text-zinc-300">
              Input: f₁ and f₂
              <br />
              <span className="text-sm text-zinc-700 dark:text-zinc-500">↓ nonlinear system ↓</span>
              <br />
              Output: f₁, f₂, <span className="text-red-500">(f₂-f₁)</span>,{" "}
              <span className="text-red-500">(f₁+f₂)</span>, 2f₁, 2f₂,{" "}
              <span className="text-red-500">(2f₁-f₂)</span>,{" "}
              <span className="text-red-500">(2f₂-f₁)</span>, ...
            </p>
          </div>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            The red terms are intermodulation products. They exist only because
            of the nonlinearity. A perfectly linear amplifier would output only
            f₁ and f₂.
          </p>
        </section>

        {/* The Math */}
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-200 mb-4">
            Why Nonlinearity Creates New Frequencies
          </h2>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            Consider two sine waves added together: sin(f₁t) + sin(f₂t). When
            this passes through a nonlinear function (like soft clipping), the
            output contains terms involving products of the input.
          </p>

          <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg my-4">
            <p className="text-sm text-zinc-800 dark:text-zinc-400">
              Using the trigonometric identity:
              <br />
              <span className="font-mono">
                sin(A) × sin(B) = ½[cos(A-B) - cos(A+B)]
              </span>
              <br />
              <br />
              When nonlinearity creates terms like sin(f₁t) × sin(f₂t), you get
              frequencies at (f₁-f₂) and (f₁+f₂).
            </p>
          </div>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            Higher-order nonlinearities (from stronger clipping) create
            higher-order products: 2f₁±f₂, 2f₂±f₁, 3f₁±f₂, etc. More gain means
            more intermodulation.
          </p>
        </section>

        {/* Power Chords */}
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-200 mb-4">
            Why Power Chords Work
          </h2>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            A power chord consists of the root and the fifth. The frequency ratio
            of a perfect fifth is 3:2 (or 1.5). Let&apos;s call the root f₁.
          </p>

          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800 my-6">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-300 mb-3">
              Power Chord Intermodulation
            </h3>
            <div className="font-mono text-sm space-y-1 text-zinc-800 dark:text-zinc-400">
              <p>Root: f₁ = 100 Hz (example)</p>
              <p>Fifth: f₂ = 150 Hz (1.5 × f₁)</p>
              <p className="pt-2 text-green-600 dark:text-green-400">
                Difference: f₂ - f₁ = 50 Hz = <strong>one octave below root</strong>
              </p>
              <p className="text-green-600 dark:text-green-400">
                Sum: f₁ + f₂ = 250 Hz = 2.5 × f₁ (major third above octave)
              </p>
            </div>
          </div>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            The difference tone (f₂-f₁) is exactly one octave below the root.
            This is a musically consonant relationship that reinforces the chord,
            adding bass weight and thickness. The distortion creates a &quot;phantom
            bass note&quot; that makes power chords sound huge.
          </p>

          <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg">
            <p className="text-sm text-zinc-800 dark:text-zinc-400">
              <strong>Try it:</strong> In the simulation above, select
              &quot;Perfect Fifth&quot; and increase the gain. Watch the f₂-f₁
              bar appear. This is the sub-octave that thickens the sound.
            </p>
          </div>
        </section>

        {/* Why Complex Chords Get Muddy */}
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-200 mb-4">
            Why Full Chords Sound Muddy
          </h2>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            A major chord has three notes: root, major third, and fifth. The
            major third has a ratio of 5:4 (1.25). Now you have three frequencies
            generating intermodulation products with each other.
          </p>

          <div className="grid md:grid-cols-2 gap-6 my-6">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
              <h3 className="text-lg font-semibold text-green-700 dark:text-green-400 mb-2">
                Power Chord (2 notes)
              </h3>
              <p className="text-zinc-800 dark:text-zinc-400 text-sm mb-2">
                Intermodulation products:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-zinc-800 dark:text-zinc-400 text-sm">
                <li>f₂-f₁ (octave below root) ✓</li>
                <li>f₁+f₂ (consonant)</li>
                <li>2f₁-f₂, 2f₂-f₁ (related tones)</li>
              </ul>
              <p className="mt-2 text-green-600 dark:text-green-400 text-sm font-medium">
                All products are musically related
              </p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border border-red-200 dark:border-red-800">
              <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">
                Major Chord (3 notes)
              </h3>
              <p className="text-zinc-800 dark:text-zinc-400 text-sm mb-2">
                Intermodulation products:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-zinc-800 dark:text-zinc-400 text-sm">
                <li>f₂-f₁, f₃-f₁, f₃-f₂</li>
                <li>f₁+f₂, f₁+f₃, f₂+f₃</li>
                <li>2f₁-f₂, 2f₁-f₃, 2f₂-f₁...</li>
                <li>Many more combinations</li>
              </ul>
              <p className="mt-2 text-red-600 dark:text-red-400 text-sm font-medium">
                Dense cluster of dissonant frequencies
              </p>
            </div>
          </div>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            With three notes, you get intermodulation products between every pair.
            Many of these fall at non-harmonic frequencies that clash with the
            chord tones, creating a muddy, indistinct sound.
          </p>
        </section>

        {/* Practical Implications */}
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-200 mb-4">
            Practical Implications
          </h2>

          <div className="space-y-4 my-6">
            <div className="flex gap-4 items-start">
              <div className="w-3 h-3 rounded-full bg-purple-600 mt-1.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-200">
                  High gain = power chords and single notes
                </h3>
                <p className="text-zinc-800 dark:text-zinc-400 text-sm">
                  Metal and hard rock guitarists use power chords specifically
                  because they sound clear through heavy distortion. Complex
                  chords are reserved for clean or lightly overdriven tones.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-3 h-3 rounded-full bg-purple-600 mt-1.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-200">
                  Less gain for chord clarity
                </h3>
                <p className="text-zinc-800 dark:text-zinc-400 text-sm">
                  Blues and classic rock players use moderate overdrive that
                  allows for fuller chords while still adding harmonic richness.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-3 h-3 rounded-full bg-purple-600 mt-1.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-200">
                  Dissonance as an effect
                </h3>
                <p className="text-zinc-800 dark:text-zinc-400 text-sm">
                  Some genres intentionally use the muddy intermodulation of
                  close intervals (like minor seconds) for aggressive, chaotic
                  textures.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Summary */}
        <section className="bg-gradient-to-br from-purple-100 to-orange-100 dark:from-purple-900/30 dark:to-orange-900/30 p-6 rounded-xl border border-purple-200 dark:border-purple-800">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-200 mb-4">
            Summary
          </h2>
          <ol className="list-decimal pl-6 space-y-2 text-zinc-900 dark:text-zinc-300">
            <li>
              Nonlinear systems (distortion) create new frequencies at sums and
              differences of input frequencies
            </li>
            <li>
              Power chords (root + fifth) produce intermodulation at one octave
              below the root, which sounds musical
            </li>
            <li>
              Complex chords produce many intermodulation products that clash and
              sound muddy
            </li>
            <li>
              Higher gain means more intermodulation, so heavy distortion demands
              simpler note choices
            </li>
            <li>
              This is why metal uses power chords and single-note riffs, while
              jazz uses clean tones for complex harmony
            </li>
          </ol>
        </section>
      </div>
    </div>
  );
}
