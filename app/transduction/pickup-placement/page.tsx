import PickupPlacementSim from "@/app/components/PickupPlacementSim";

export default function PickupPlacementPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 lg:py-16">
      <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-orange-500 mb-4">
        Pickup Placement
      </h1>
      <p className="text-zinc-800 dark:text-zinc-400 mb-8">
        How position along the string affects which harmonics the pickup
        &quot;sees&quot;
      </p>

      {/* Interactive Simulation */}
      <PickupPlacementSim className="mb-12" />

      {/* Physics explanation */}
      <div className="space-y-8">
        {/* The Key Insight */}
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-200 mb-4">
            The Key Insight
          </h2>

          <div className="bg-gradient-to-r from-purple-50 to-orange-50 dark:from-purple-900/20 dark:to-orange-900/20 p-6 rounded-xl my-6 border border-purple-200 dark:border-purple-800">
            <p className="text-center text-lg text-zinc-900 dark:text-zinc-300 font-medium">
              A larger percentage of the string&apos;s motion near the bridge is
              due to higher harmonics.
            </p>
          </div>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            This is why bridge pickups sound brighter and neck pickups sound
            warmer. It&apos;s not just about proximity to the bridge, it&apos;s
            about <em>which harmonics</em> have significant amplitude at each
            position.
          </p>
        </section>

        {/* Why More Ripples = More Edge Motion */}
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-200 mb-4">
            Why Higher Harmonics Dominate Near the Bridge
          </h2>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            Each harmonic has a different spatial pattern along the string:
          </p>

          <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg my-4 font-mono text-center">
            Mode n shape: sin(nπx/L)
          </div>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            The key is the number of &quot;ripples&quot; each mode has:
          </p>

          <ul className="list-disc pl-6 space-y-2 text-zinc-900 dark:text-zinc-300 my-4">
            <li>
              <strong>Mode 1 (fundamental):</strong> One half-wave. Maximum
              amplitude at the center, tapering to zero at the ends.
            </li>
            <li>
              <strong>Mode 2:</strong> One full wave. Two antinodes, with a node
              at the center.
            </li>
            <li>
              <strong>Mode n:</strong> n half-waves. More ripples = steeper
              slopes near the edges.
            </li>
          </ul>

          <div className="bg-gradient-to-r from-purple-50 to-orange-50 dark:from-purple-900/20 dark:to-orange-900/20 p-6 rounded-xl my-6 border border-purple-200 dark:border-purple-800">
            <p className="text-center text-zinc-900 dark:text-zinc-300 font-medium">
              More ripples in a harmonic = more motion near the edge
            </p>
          </div>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            Near the bridge (x ≈ L), the fundamental sin(πx/L) is nearly flat
            (approaching zero). But sin(10πx/L) is still oscillating rapidly. It
            has significant slope there. The pickup detects velocity
            (slope in time), and higher modes contribute more to the velocity
            near the edges.
          </p>
        </section>

        {/* Nodes and Nulls */}
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-200 mb-4">
            Nodes: Where Harmonics Vanish
          </h2>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            Each harmonic has <strong>nodes</strong>, positions where it has zero
            amplitude. If you place a pickup at a node of a particular harmonic,
            that harmonic disappears from the output.
          </p>

          <div className="grid md:grid-cols-2 gap-6 my-6">
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800">
              <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-400 mb-2">
                Example: The 24th Fret
              </h3>
              <p className="text-zinc-800 dark:text-zinc-400 text-sm">
                The 24th fret is at exactly L/2 (half the scale length). This is
                a node for all even harmonics (2nd, 4th, 6th...). A pickup here
                would miss all even harmonics.
              </p>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800">
              <h3 className="text-lg font-semibold text-orange-500 dark:text-orange-400 mb-2">
                Example: The 7th Fret
              </h3>
              <p className="text-zinc-800 dark:text-zinc-400 text-sm">
                The 7th fret is at roughly L/3. This is a node for the 3rd, 6th,
                9th harmonics. The &quot;sweet spot&quot; for a warm, fundamental-heavy
                tone.
              </p>
            </div>
          </div>

          <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg">
            <p className="text-sm text-zinc-800 dark:text-zinc-400">
              <strong>Try it:</strong> In the simulation above, move the pickup
              to 50% (center). Notice how the even harmonics (2, 4, 6...) drop
              to zero sensitivity. This is why some players avoid the exact neck
              position.
            </p>
          </div>
        </section>

        {/* Sharper Waveforms */}
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-200 mb-4">
            Sharper Waveforms = More High-Frequency Content
          </h2>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            The output waveform changes shape depending on pickup position:
          </p>

          <div className="grid md:grid-cols-2 gap-6 my-6">
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800">
              <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-400 mb-3">
                Neck Position
              </h3>
              <div className="h-16 flex items-center justify-center mb-3">
                <svg viewBox="0 0 100 30" className="w-full h-full">
                  <path
                    d="M0,15 Q25,0 50,15 Q75,30 100,15"
                    fill="none"
                    stroke="#7c3aed"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <p className="text-zinc-800 dark:text-zinc-400 text-sm">
                Smooth, rounded waveform dominated by the fundamental. Warm,
                full tone with less &quot;edge.&quot;
              </p>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800">
              <h3 className="text-lg font-semibold text-orange-500 dark:text-orange-400 mb-3">
                Bridge Position
              </h3>
              <div className="h-16 flex items-center justify-center mb-3">
                <svg viewBox="0 0 100 30" className="w-full h-full">
                  <path
                    d="M0,15 L10,5 L20,25 L30,5 L40,25 L50,5 L60,25 L70,5 L80,25 L90,5 L100,15"
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <p className="text-zinc-800 dark:text-zinc-400 text-sm">
                Sharp, jagged waveform with many harmonics. Bright, cutting tone
                with more &quot;attack.&quot;
              </p>
            </div>
          </div>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            This is a direct consequence of Fourier analysis: sharp features in
            a waveform require high-frequency components. The bridge pickup
            captures these components; the neck pickup filters them out.
          </p>
        </section>

        {/* Practical Implications */}
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-200 mb-4">
            Practical Implications
          </h2>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed mb-4">
            Note that all pickup positions on a real guitar are relatively close
            to the bridge, typically in the last 25% of the string length (75%+
            from the nut). Even small position differences in this region create
            noticeable tonal changes.
          </p>

          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="w-3 h-3 rounded-full bg-purple-600 mt-1.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-200">
                  Neck Pickup (~70-75% from nut)
                </h3>
                <p className="text-zinc-800 dark:text-zinc-400 text-sm">
                  Near the end of the fretboard. Emphasizes the fundamental,
                  fewer higher harmonics. Jazz, clean tones, warm leads.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-3 h-3 rounded-full bg-zinc-400 mt-1.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-200">
                  Middle Pickup (~80-85%)
                </h3>
                <p className="text-zinc-800 dark:text-zinc-400 text-sm">
                  Between neck and bridge. Balanced harmonic content. The
                  &quot;quacky&quot; positions 2 and 4 on a Strat come from
                  combining this with other pickups.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-3 h-3 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-200">
                  Bridge Pickup (~90-95%)
                </h3>
                <p className="text-zinc-800 dark:text-zinc-400 text-sm">
                  Very close to the bridge. Enhanced higher harmonics, reduced
                  fundamental. Bright, cutting, aggressive. Essential for
                  high-gain where clarity matters.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg mt-6">
            <p className="text-sm text-zinc-800 dark:text-zinc-400">
              <strong>Note:</strong> The simulation above lets you explore the
              full string length for educational purposes, but real pickups
              operate only in the last 25% of the string (75%+ from nut).
            </p>
          </div>
        </section>

        {/* Summary */}
        <section className="bg-gradient-to-br from-purple-100 to-orange-100 dark:from-purple-900/30 dark:to-orange-900/30 p-6 rounded-xl border border-purple-200 dark:border-purple-800">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-200 mb-4">
            Summary
          </h2>
          <ol className="list-decimal pl-6 space-y-2 text-zinc-900 dark:text-zinc-300">
            <li>
              Each harmonic has a unique spatial pattern with nodes (zeros) and
              antinodes (maxima)
            </li>
            <li>
              Higher harmonics have more &quot;ripples,&quot; meaning more motion near the
              string&apos;s ends
            </li>
            <li>
              A pickup placed near the bridge captures more high-frequency
              content (brighter tone)
            </li>
            <li>
              A pickup placed near the neck captures mostly the fundamental
              (warmer tone)
            </li>
            <li>
              Placing a pickup at a node of a harmonic eliminates that harmonic
              from the output
            </li>
            <li>
              The output waveform shape directly reflects the harmonic content:
              smooth = fundamental, jagged = harmonics
            </li>
          </ol>
        </section>
      </div>
    </div>
  );
}
