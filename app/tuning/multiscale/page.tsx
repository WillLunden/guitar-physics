import MultiscaleSim from "@/app/components/MultiscaleSim";

export default function MultiscalePage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 lg:py-16">
      <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-orange-500 mb-4">
        Multiscale / Fanned Frets
      </h1>
      <p className="text-zinc-800 dark:text-zinc-400 mb-8">
        Optimizing string tension and playability by varying scale length
      </p>

      {/* Interactive Simulation */}
      <MultiscaleSim className="mb-12" />

      {/* Physics explanation */}
      <div className="space-y-8">
        {/* The Core Physics */}
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-200 mb-4">
            Scale Length and Tension
          </h2>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            The fundamental frequency of a string depends on three factors:
            length, tension, and linear mass density. The relationship is:
          </p>

          <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg my-4 font-mono text-center">
            f = (1/2L) × √(T/μ)
          </div>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            Rearranging to solve for tension:
          </p>

          <div className="bg-gradient-to-r from-purple-50 to-orange-50 dark:from-purple-900/20 dark:to-orange-900/20 p-6 rounded-xl my-6 border border-purple-200 dark:border-purple-800">
            <div className="text-center font-mono text-xl text-zinc-900 dark:text-zinc-200">
              T = 4 × L² × f² × μ
            </div>
          </div>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            Notice that tension scales with the <strong>square</strong> of the
            scale length. If we increase the string length, more tension is
            required to reach the same pitch.
          </p>
        </section>

        {/* The Problem with Standard Scale */}
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-200 mb-4">
            The Problem with Standard Guitars
          </h2>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            On a standard guitar, all strings share the same scale length
            (typically 25.5&quot; for Fender or 24.75&quot; for Gibson). This
            creates a tension imbalance:
          </p>

          <div className="grid md:grid-cols-2 gap-6 my-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-400 mb-2">
                Low Strings
              </h3>
              <ul className="list-disc pl-6 space-y-1 text-zinc-800 dark:text-zinc-400 text-sm">
                <li>Floppy feel, especially on extended range guitars</li>
                <li>Less sustain and definition</li>
                <li>Intonation problems due to string stretching</li>
                <li>
                  Requires thicker gauge strings as compensation, which can be
                  harder to play{" "}
                </li>
              </ul>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-6 border border-orange-200 dark:border-orange-800">
              <h3 className="text-lg font-semibold text-orange-700 dark:text-orange-400 mb-2">
                High Strings
              </h3>
              <ul className="list-disc pl-6 space-y-1 text-zinc-800 dark:text-zinc-400 text-sm">
                <li>Higher tension means harder bends and vibrato</li>
                <li>Wider fret spacing makes stretching harder</li>
                <li>
                  Can use thinner gauge strings, but they may feel too tight and
                  have a brittle tone
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* The Multiscale Solution */}
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-200 mb-4">
            A Solution: Vary the Scale Length Across the Strings
          </h2>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            Multiscale guitars use different scale lengths for each string,
            increasing gradually from treble to bass. A typical configuration
            might be:
          </p>

          <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg my-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-zinc-800 dark:text-zinc-400">
                High E string:
              </div>
              <div className="font-mono text-zinc-900 dark:text-zinc-200">
                25.5&quot;
              </div>
              <div className="text-zinc-800 dark:text-zinc-400">
                Low E string:
              </div>
              <div className="font-mono text-zinc-900 dark:text-zinc-200">
                27.0&quot;
              </div>
            </div>
          </div>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            This gives us the best of both worlds:
          </p>

          <div className="space-y-4 my-6">
            <div className="flex gap-4 items-start">
              <div className="w-3 h-3 rounded-full bg-purple-600 mt-1.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-200">
                  More tension on low strings
                </h3>
                <p className="text-zinc-800 dark:text-zinc-400 text-sm">
                  Keeps them stiff. Improved sustain and more consistent
                  intonation.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-3 h-3 rounded-full bg-purple-600 mt-1.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-200">
                  Comfortable tension on high strings
                </h3>
                <p className="text-zinc-800 dark:text-zinc-400 text-sm">
                  Easier string bending and vibrato for lead playing. Closer
                  fret spacing for faster runs and smaller stretches.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-3 h-3 rounded-full bg-purple-600 mt-1.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-200">
                  Ergonomics and Playability
                </h3>
                <p className="text-zinc-800 dark:text-zinc-400 text-sm">
                  The fanned frets actually match the natural angle of your
                  fretting hand better, especially in lower positions!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Fanned Frets? */}
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-200 mb-4">
            Why the Frets &quot;Fan&quot; Out
          </h2>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            If the bass strings are longer than the treble strings, the nut and
            bridge can&apos;t both be perpendicular to the strings. The frets
            must be angled to maintain proper intonation on each string. This is
            still achieving the correct fret positions for 12-tone equal
            temperament, just at an angle rather than straight across.
          </p>

          <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg my-4">
            <p className="text-sm text-zinc-800 dark:text-zinc-400">
              <strong>
                The math for 12-tone equal temperatment still works:
              </strong>{" "}
              Each fret is still placed at the correct ratio (2^(n/12)) along
              each individual string, achieving 12 equal-tempered semitones per
              octave. The frets just connect these points at an angle rather
              than straight across.
            </p>
          </div>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            There&apos;s typically a &quot;neutral point&quot; where the fret is
            perpendicular, often around the 7th-9th fret. Above this point, the
            frets angle one way; below, they angle the other way.
          </p>
        </section>

        {/* Extended Range */}
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-200 mb-4">
            Extended Range Guitars
          </h2>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            Multiscale design becomes increasingly important as you add lower
            strings. On 7, 8, or 9-string guitars tuned to drop tunings:
          </p>

          <div className="bg-gradient-to-r from-purple-50 to-orange-50 dark:from-purple-900/20 dark:to-orange-900/20 p-6 rounded-xl my-6 border border-purple-200 dark:border-purple-800">
            <p className="text-center text-zinc-900 dark:text-zinc-300 font-medium">
              A standard 25.5&quot; scale makes a low F# (on an 8-string) feel
              too loose to play well, while a longer 27&quot; or longer scale
              makes the high strings too tight and hard to bend.
            </p>
          </div>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            This is why multiscale designs have become so common in the extended
            range guitar market. They allow players to have a playable tension
            on all strings without resorting to extreme string gauges or
            sacrificing tone and sustain on the low end.
          </p>
        </section>

        {/* Summary */}
        <section className="bg-gradient-to-br from-purple-100 to-orange-100 dark:from-purple-900/30 dark:to-orange-900/30 p-6 rounded-xl border border-purple-200 dark:border-purple-800">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-200 mb-4">
            Summary
          </h2>
          <ol className="list-decimal pl-6 space-y-2 text-zinc-900 dark:text-zinc-300">
            <li>
              String tension increases with the square of scale length (T ∝ L²)
            </li>
            <li>
              Longer bass strings = more tension = stiffer, more articulate low
              end
            </li>
            <li>
              Shorter treble strings = easier bends, closer fret spacing for
              leads
            </li>
            <li>
              Frets must fan out to maintain proper intonation at different
              scale lengths
            </li>
            <li>
              The angled frets actually improve ergonomics for many players
            </li>
            <li>
              Multiscale is strongly preferred for extended range guitars to
              balance tension and increase playability
            </li>
          </ol>
        </section>
      </div>
    </div>
  );
}
