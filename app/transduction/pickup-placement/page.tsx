import PickupPlacementSim from "@/app/components/PickupPlacementSim";

export default function PickupPlacementPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 lg:py-16">
      <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-orange-500 mb-4">
        Pickup Placement
      </h1>
      <p className="text-zinc-800 dark:text-zinc-400 mb-8">
        How the position of the pickup affects the harmonic content and tone of
        an electric guitar
      </p>

      {/* Interactive Simulation */}
      <PickupPlacementSim className="mb-12" />

      {/* Physics explanation */}
      <div className="space-y-8">
        {/* The Key Insight */}
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-200 mb-4">
            Position Dependence of the String's Motion
          </h2>

          <div className="bg-gradient-to-r from-purple-50 to-orange-50 dark:from-purple-900/20 dark:to-orange-900/20 p-6 rounded-xl my-6 border border-purple-200 dark:border-purple-800">
            <p className="text-center text-lg text-zinc-900 dark:text-zinc-300 font-medium">
              Near the center of the string, the fundamental dominates. Near the
              edges, higher harmonics account for more of the string's motion.
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
            Why Higher Frequencies Have More Motion Near the Edges
          </h2>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            The maximum amplitude of the nth harmonic at position x along the
            string follows a sine wave pattern:
          </p>

          <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg my-4 font-mono text-center">
            Mode n shape: sin(nπx/L)
          </div>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            As n increases, so does the number of &quot;ripples&quot; each mode
            has:
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
            (approaching zero). In contrast, sin(10πx/L) is still oscillating
            rapidly. The pickup detects velocity (slope in time), so higher
            modes contribute more to the velocity near the edges, and therefore
            to the output signal.
          </p>
        </section>

        {/* Sharper Waveforms */}
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-200 mb-4">
            "Shape" of the Output Waveform Changes with Pickup Position
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
            captures these high frequencies, resulting in a more complex, jagged
            output. The neck pickup, on the other hand, captures more of the low
            frequency modes the fundamental, producing a smoother waveform.
          </p>
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
              Higher harmonics have more &quot;ripples,&quot; meaning more
              motion near the string&apos;s ends
            </li>
            <li>
              A pickup placed near the bridge captures more high-frequency
              content (brighter tone)
            </li>
            <li>
              A pickup placed near the neck captures more of the fundamental
              (warmer tone)
            </li>

            <li>
              The "jaggedness" output waveform shape directly reflects the
              harmonic content
            </li>
          </ol>
        </section>
      </div>
    </div>
  );
}
