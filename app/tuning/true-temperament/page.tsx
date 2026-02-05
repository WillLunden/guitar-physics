import TrueTemperamentSim from "@/app/components/TrueTemperamentSim";
import StringStretchDiagram from "@/app/components/StringStretchDiagram";

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
            Deviations from 12-Tone Equal Temperament Due to String Stretching
          </h2>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            Equal temperament solves the global problem of tuning across keys.
            But there is a separate, mechanical problem: when you press a string
            down to a fret, you physically stretch it. This effect is desirable
            when we bend notes for expression, but it also insidiously raises
            the pitch of every fretted note above its ideal equal-temperament
            frequency. The result is that chords can sound slightly out of tune,
            especially higher up the neck where the stretch effect is more
            pronounced.
          </p>

          <div className="bg-gradient-to-r from-purple-50 to-orange-50 dark:from-purple-900/20 dark:to-orange-900/20 p-6 rounded-xl my-6 border border-purple-200 dark:border-purple-800">
            <p className="text-center text-lg text-zinc-900 dark:text-zinc-300 font-medium">
              Fretting a string changes its tension and vibrating length,
              causing intonation issues that vary by string and fret position.
            </p>
          </div>
        </section>

        {/* Why Fretting Raises Pitch - Dedicated Section */}
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-200 mb-4">
            Why Fretting Raises Pitch
          </h2>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed mb-6">
            When you press a string down to a fret, you are forcing it to travel
            a longer path than when it sits at rest. The string must now travel
            down from the nut, to the fret, and back up to the bridge. This
            detour increases the total length of the string, stretching it.
          </p>

          <StringStretchDiagram className="mb-6" />

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            The fundamental frequency of a vibrating string is determined by the
            equation:
          </p>

          <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg my-4 font-mono text-center">
            f = (1/2L) &times; &radic;(T/&mu;)
          </div>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            When tension (T) increases due to stretching, the frequency goes up.
            This means the fretted note is slightly sharper than the ideal
            equal-temperament pitch. The effect is small but audible, especially
            in chords where multiple slightly-sharp notes compound the error.
          </p>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed mt-4">
            The amount of stretch depends on several factors:
          </p>

          <ul className="list-disc pl-6 space-y-2 text-zinc-900 dark:text-zinc-300 my-4">
            <li>
              <strong>Action height:</strong> Higher action means pressing the
              string down further, causing more stretch.
            </li>
            <li>
              <strong>String gauge:</strong> Thicker strings have a higher &mu;
              (mass per unit length), which affects how much the frequency
              changes with tension.
            </li>
            <li>
              <strong>Fret position:</strong> The geometry changes along the
              neck, so the stretch amount varies by fret.
            </li>
            <li>
              <strong>Scale length:</strong> Longer scale lengths mean higher
              base tension, which can make the stretch effect more or less
              pronounced depending on other factors.
            </li>
          </ul>
        </section>

        {/* The True Temperament Solution */}
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-200 mb-4">
            The Solution: Per-String Fret Positioning
          </h2>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            True Temperament frets are individually calculated for each string
            at each fret position. The result is the characteristic curved or
            &quot;squiggly&quot; appearance.
          </p>

          <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg my-4">
            <p className="text-sm text-zinc-800 dark:text-zinc-400">
              Each point on the fret is positioned to give the correct pitch for
              that specific string when fretted, accounting for its gauge,
              tension, and the geometry at that position.
            </p>
          </div>
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
                  Chords sound more in tune
                </h3>
                <p className="text-zinc-800 dark:text-zinc-400 text-sm">
                  All notes in a chord are properly in tune with each other,
                  eliminating the need to "retune" certain strings to compensate
                  for intonation issues, especially during recording.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-3 h-3 rounded-full bg-purple-600 mt-1.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-200">
                  Not just for one tuning
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
            <li>Fretting a string stretches it, raising its pitch slightly</li>
            <li>
              The amount of stretch varies by string gauge, action, and fret
              position
            </li>
            <li>Straight frets cannot compensate for per-string variations</li>
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
