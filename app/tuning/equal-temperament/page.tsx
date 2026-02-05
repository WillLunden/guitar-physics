import EqualTemperamentSim from "@/app/components/EqualTemperamentSim";

export default function EqualTemperamentPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 lg:py-16">
      <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-orange-500 mb-4">
        Equal Temperament
      </h1>
      <p className="text-zinc-800 dark:text-zinc-400 mb-8">
        Why guitars have straight frets, and how the 12-tone equal temperament
        system allows us to play in any key at the cost of perfect consonance
      </p>

      {/* Interactive Simulation */}
      <EqualTemperamentSim className="mb-12" />

      {/* Physics explanation */}
      <div className="space-y-8">
        {/* Just Intonation */}
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-200 mb-4">
            Just Intonation and Consonant Ratios
          </h2>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            When we pluck a string, it vibrates at both its fundamental
            frequency and at integer multiples: 2×, 3×, 4×, etc. These are the{" "}
            <strong>harmonics</strong> or <strong>overtones</strong>.
          </p>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed mt-4">
            <strong>Just intonation</strong> systems build the intervals of a
            scale from these natural ratios. When two notes have frequencies in
            simple ratios, their harmonics align and they sound consonant to the
            human ear. The simpler the ratio, the more consonant the interval:
            2:1 (octave) sounds more resolved than 3:2 (fifth), which sounds
            more "resolved" than 5:4 (major third).
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-200 dark:border-zinc-800 text-center">
              <div className="text-2xl font-mono font-bold text-purple-600 dark:text-purple-400">
                2:1
              </div>
              <div className="text-sm text-zinc-800 dark:text-zinc-400 mt-1">
                Octave
              </div>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-200 dark:border-zinc-800 text-center">
              <div className="text-2xl font-mono font-bold text-purple-600 dark:text-purple-400">
                3:2
              </div>
              <div className="text-sm text-zinc-800 dark:text-zinc-400 mt-1">
                Perfect 5th
              </div>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-200 dark:border-zinc-800 text-center">
              <div className="text-2xl font-mono font-bold text-purple-600 dark:text-purple-400">
                4:3
              </div>
              <div className="text-sm text-zinc-800 dark:text-zinc-400 mt-1">
                Perfect 4th
              </div>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-200 dark:border-zinc-800 text-center">
              <div className="text-2xl font-mono font-bold text-purple-600 dark:text-purple-400">
                5:4
              </div>
              <div className="text-sm text-zinc-800 dark:text-zinc-400 mt-1">
                Major 3rd
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-orange-50 dark:from-purple-900/20 dark:to-orange-900/20 p-6 rounded-xl my-6 border border-purple-200 dark:border-purple-800">
            <p className="text-center text-zinc-900 dark:text-zinc-300 font-medium">
              In a just intonation system, the intervals are perfectly
              consonant, but only in one key.
            </p>
          </div>
        </section>

        {/* The Problem */}
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-200 mb-4">
            The Problem with Just Intonation
          </h2>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            If you tune a piano (or set guitar frets) using just intonation in,
            e.g., the key of C, the intervals in other keys will be{" "}
            <em>wrong</em>.
          </p>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed mt-4">
            For example, in C-based just intonation, D is tuned as 9/8 of C, and
            A as 5/3 of C. The D-to-A interval is (5/3)÷(9/8) = 40/27 ≈ 1.481,
            but a pure fifth is 3/2 = 1.5. That D-A "power chord" interval
            &quot;fifth&quot; is 22 cents flat. This is enough to sound
            noticeably sour!
          </p>

          <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl my-6 border border-red-200 dark:border-red-800">
            <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-3">
              The Circle of Fifths Doesn&apos;t "Close"
            </h3>
            <p className="text-zinc-900 dark:text-zinc-300 mb-3">
              Stack 12 perfect fifths (3:2 ratio each):
            </p>
            <div className="bg-white dark:bg-zinc-900 p-3 rounded-lg font-mono text-sm text-center">
              (3/2)¹² = 129.746...
            </div>
            <p className="text-zinc-900 dark:text-zinc-300 mt-3">
              Stack 7 octaves (2:1 ratio each):
            </p>
            <div className="bg-white dark:bg-zinc-900 p-3 rounded-lg font-mono text-sm text-center">
              2⁷ = 128
            </div>
            <p className="text-zinc-900 dark:text-zinc-300 mt-3">
              They <strong>don&apos;t match!</strong> This ~1.4% discrepancy is
              called the{" "}
              <strong className="text-red-600 dark:text-red-400">
                Pythagorean comma
              </strong>
              .
            </p>
          </div>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            This means if you tune by pure fifths starting from C, by the time
            you get back to C (via B♯), you&apos;ll be noticeably sharp. How do
            we solve this problem?
          </p>
        </section>

        {/* The Solution */}
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-200 mb-4">
            The Solution: Equally Distributed Errors
          </h2>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            <strong>12-tone equal temperament (12-TET)</strong> solves this by
            making every semitone exactly the same size: the 12th root of 2.
          </p>

          <div className="bg-zinc-100 dark:bg-zinc-800 p-6 rounded-xl my-6">
            <div className="text-center">
              <div className="text-3xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-orange-500 mb-2">
                ¹²√2 ≈ 1.05946
              </div>
              <p className="text-zinc-800 dark:text-zinc-400 text-sm">
                Each fret multiplies the frequency by this ratio
              </p>
            </div>
          </div>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            Now 12 semitones = exactly one octave (1.05946¹² = 2), and every key
            is equally &quot;in tune&quot;, or more accurately, equally{" "}
            <em>out</em> of tune by tiny amounts.
          </p>

          <div className="grid md:grid-cols-2 gap-6 my-6">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
              <h3 className="text-lg font-semibold text-green-700 dark:text-green-400 mb-2">
                Benefits of Equal Temperament
              </h3>
              <ul className="list-disc pl-6 space-y-1 text-zinc-800 dark:text-zinc-400 text-sm">
                <li>Modulate freely between any keys</li>
                <li>Transpose without retuning</li>
                <li>Straight frets on guitars</li>
                <li>Standardized instrument manufacturing</li>
              </ul>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800">
              <h3 className="text-lg font-semibold text-yellow-700 dark:text-yellow-400 mb-2">
                Drawbacks of Equal Temperament
              </h3>
              <ul className="list-disc pl-6 space-y-1 text-zinc-800 dark:text-zinc-400 text-sm">
                <li>Major 3rds are 14 cents sharp</li>
                <li>Perfect 5ths are 2 cents flat</li>
                <li>No interval except octave is pure</li>
                <li>Subtle &quot;beating&quot; in sustained chords</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Fret Placement */}
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-200 mb-4">
            Guitar Fret Placement
          </h2>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            For a vibrating string, frequency is inversely proportional to
            length:
          </p>

          <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg my-4 font-mono text-center">
            f = (1/2L) × √(T/μ)
          </div>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            To raise the pitch by one semitone, we need to shorten the string by
            a factor of ¹²√2. Each fret is placed at:
          </p>

          <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg my-4 font-mono text-center">
            Distance from nut = L × (1 − 1/2^(n/12))
          </div>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            Because this formula only depends on <em>n</em> (the fret number)
            and <em>L</em> (the scale length), and not on which string
            you&apos;re playing, all six strings can share the same fret
            positions.
          </p>
        </section>

        {/* Cents */}
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-200 mb-4">
            Measuring the Difference: Cents
          </h2>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            Musicians measure small pitch differences in <strong>cents</strong>.
            One semitone = 100 cents, so one octave = 1200 cents.
          </p>

          <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg my-4 font-mono text-center">
            cents = 1200 × log₂(f₂/f₁)
          </div>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            The human ear can typically detect differences of about 5-10 cents.
            The major 3rd in equal temperament is about 14 cents sharp compared
            to just intonation. This is noticeable if you listen carefully, but
            acceptable for most music.
          </p>

          <div className="space-y-3 my-6">
            <div className="flex items-center gap-4">
              <div className="w-24 text-sm text-zinc-800 dark:text-zinc-400">
                Perfect 5th
              </div>
              <div className="flex-1 bg-zinc-200 dark:bg-zinc-700 rounded-full h-4 relative">
                <div
                  className="absolute inset-y-0 left-0 bg-green-500 rounded-full"
                  style={{ width: "15%" }}
                />
              </div>
              <div className="w-16 text-sm font-mono text-green-600 dark:text-green-400">
                −2¢
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-24 text-sm text-zinc-800 dark:text-zinc-400">
                Perfect 4th
              </div>
              <div className="flex-1 bg-zinc-200 dark:bg-zinc-700 rounded-full h-4 relative">
                <div
                  className="absolute inset-y-0 left-0 bg-green-500 rounded-full"
                  style={{ width: "15%" }}
                />
              </div>
              <div className="w-16 text-sm font-mono text-green-600 dark:text-green-400">
                +2¢
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-24 text-sm text-zinc-800 dark:text-zinc-400">
                Major 3rd
              </div>
              <div className="flex-1 bg-zinc-200 dark:bg-zinc-700 rounded-full h-4 relative">
                <div
                  className="absolute inset-y-0 left-0 bg-red-500 rounded-full"
                  style={{ width: "70%" }}
                />
              </div>
              <div className="w-16 text-sm font-mono text-red-600 dark:text-red-400">
                +14¢
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-24 text-sm text-zinc-800 dark:text-zinc-400">
                Minor 3rd
              </div>
              <div className="flex-1 bg-zinc-200 dark:bg-zinc-700 rounded-full h-4 relative">
                <div
                  className="absolute inset-y-0 left-0 bg-orange-500 rounded-full"
                  style={{ width: "80%" }}
                />
              </div>
              <div className="w-16 text-sm font-mono text-orange-600 dark:text-orange-400">
                −16¢
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
              <strong>Just intonation</strong> uses simple frequency ratios
              (3:2, 5:4, etc.) that sound perfectly consonant
            </li>
            <li>
              The problem: these ratios don&apos;t divide the octave evenly,
              making key changes impossible
            </li>
            <li>
              <strong>Equal temperament</strong> divides the octave into 12
              equal semitones (ratio = ¹²√2)
            </li>
            <li>
              This distributes small errors across all intervals, making all
              keys equally usable
            </li>
            <li>
              Guitar frets are placed according to the equal temperament
              formula, allowing straight frets to work for all strings and keys
            </li>
          </ol>
        </section>
      </div>
    </div>
  );
}
