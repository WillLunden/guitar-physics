import TrueTemperamentSim from "@/app/components/TrueTemperamentSim";

export default function TrueTemperamentPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 lg:py-16">
      <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-orange-500 mb-4">
        True Temperament
      </h1>
      <p className="text-zinc-800 dark:text-zinc-400 mb-8">
        Curved frets that solve local intonation problems
      </p>

      {/* Interactive Simulation */}
      <TrueTemperamentSim className="mb-12" />

      {/* Physics explanation */}
      <div className="space-y-8">
        {/* The Local Problem */}
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-200 mb-4">
            The Local Problem: Fretting Stretches the String
          </h2>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            Equal temperament solves the global problem of tuning across keys. But
            there is a separate, local problem: when you press a string down to a
            fret, you physically stretch it.
          </p>

          <div className="bg-gradient-to-r from-purple-50 to-orange-50 dark:from-purple-900/20 dark:to-orange-900/20 p-6 rounded-xl my-6 border border-purple-200 dark:border-purple-800">
            <p className="text-center text-lg text-zinc-900 dark:text-zinc-300 font-medium">
              Stretching a string increases its tension, which raises its pitch.
            </p>
          </div>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            The amount of stretch depends on several factors:
          </p>

          <ul className="list-disc pl-6 space-y-2 text-zinc-900 dark:text-zinc-300 my-4">
            <li>
              <strong>Action height:</strong> Higher action means pressing the
              string down further, causing more stretch.
            </li>
            <li>
              <strong>String gauge:</strong> Thicker strings are stiffer and
              resist bending, causing more tension increase when fretted.
            </li>
            <li>
              <strong>Fret position:</strong> The geometry changes along the
              neck, so the stretch amount varies by fret.
            </li>
          </ul>
        </section>

        {/* Why Straight Frets Cannot Fully Compensate */}
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-200 mb-4">
            Why Straight Frets Are a Compromise
          </h2>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            Standard guitars use straight frets positioned according to equal
            temperament math. Bridge saddles are angled to provide some
            compensation, but this is a compromise.
          </p>

          <div className="grid md:grid-cols-2 gap-6 my-6">
            <div className="bg-zinc-100 dark:bg-zinc-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-300 mb-2">
                Bridge Compensation
              </h3>
              <p className="text-zinc-800 dark:text-zinc-400 text-sm">
                The angled bridge saddle adds a bit of length to bass strings,
                lowering their pitch to compensate for stretch. But this is a
                single adjustment that cannot account for variations at each fret.
              </p>
            </div>
            <div className="bg-zinc-100 dark:bg-zinc-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-300 mb-2">
                The Limitation
              </h3>
              <p className="text-zinc-800 dark:text-zinc-400 text-sm">
                Each string needs different compensation at each fret position.
                A straight fret forces all strings to share the same fret
                position, which cannot be optimal for all of them.
              </p>
            </div>
          </div>
        </section>

        {/* The True Temperament Solution */}
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-200 mb-4">
            The Solution: Per-String Fret Positioning
          </h2>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            True Temperament frets are individually calculated for each string at
            each fret position. The result is the characteristic curved or
            &quot;squiggly&quot; appearance.
          </p>

          <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg my-4">
            <p className="text-sm text-zinc-800 dark:text-zinc-400">
              <strong>The curve is not arbitrary:</strong> Each point on the fret
              is positioned to give the correct pitch for that specific string
              when fretted, accounting for its gauge, tension, and the geometry
              at that position.
            </p>
          </div>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            Bass strings (thicker, stiffer) generally need more compensation than
            treble strings, which is why the frets curve more dramatically on the
            bass side.
          </p>
        </section>

        {/* Practical Benefits */}
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-200 mb-4">
            Practical Benefits
          </h2>

          <div className="space-y-4 my-6">
            <div className="flex gap-4 items-start">
              <div className="w-3 h-3 rounded-full bg-purple-600 mt-1.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-200">
                  Chords ring true
                </h3>
                <p className="text-zinc-800 dark:text-zinc-400 text-sm">
                  All notes in a chord are properly in tune with each other,
                  eliminating the subtle &quot;sourness&quot; of standard frets.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-3 h-3 rounded-full bg-purple-600 mt-1.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-200">
                  Better higher-position intonation
                </h3>
                <p className="text-zinc-800 dark:text-zinc-400 text-sm">
                  Intonation errors accumulate as you move up the neck. True
                  Temperament corrects for this at every fret.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-3 h-3 rounded-full bg-purple-600 mt-1.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-200">
                  Works with any tuning
                </h3>
                <p className="text-zinc-800 dark:text-zinc-400 text-sm">
                  Since the compensation is based on physical string properties
                  rather than specific notes, it works in any tuning.
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
              Fretting a string stretches it, raising its pitch slightly
            </li>
            <li>
              The amount of stretch varies by string gauge, action, and fret
              position
            </li>
            <li>
              Straight frets cannot compensate for per-string variations
            </li>
            <li>
              True Temperament frets are curved to provide optimal positioning
              for each string at each fret
            </li>
            <li>
              The result is improved intonation across the entire fretboard
            </li>
          </ol>
        </section>
      </div>
    </div>
  );
}
