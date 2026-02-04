import HumbuckerSim from "@/app/components/HumbuckerSim";

export default function HumbuckersPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 lg:py-16">
      <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-orange-500 mb-4">
        Humbuckers: Noise Cancellation
      </h1>
      <p className="text-zinc-800 dark:text-zinc-400 mb-8">
        How two coils work together to eliminate 60Hz hum while preserving your
        signal
      </p>

      {/* Interactive Simulation */}
      <HumbuckerSim className="mb-12" />

      {/* Physics explanation */}
      <div className="space-y-8">
        {/* The Problem */}
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-200 mb-4">
            The Problem: 60Hz Hum
          </h2>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            Single-coil pickups are essentially antennas. They&apos;re designed
            to detect changing magnetic fields from the vibrating string, but
            they also pick up <em>any</em> changing magnetic field nearby.
          </p>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-xl my-6 border border-yellow-200 dark:border-yellow-800">
            <h3 className="text-lg font-semibold text-yellow-700 dark:text-yellow-400 mb-2">
              Sources of 60Hz Interference
            </h3>
            <ul className="list-disc pl-6 space-y-1 text-zinc-900 dark:text-zinc-300">
              <li>Power transformers in amplifiers</li>
              <li>Fluorescent lighting ballasts</li>
              <li>Dimmer switches</li>
              <li>Computer monitors and power supplies</li>
              <li>Any device connected to AC mains</li>
            </ul>
          </div>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            AC power runs at 60Hz (50Hz in Europe), creating oscillating
            magnetic fields that induce voltage in the pickup coil, the dreaded
            &quot;hum&quot; that plagues single-coil guitars in electrically
            noisy environments.
          </p>
        </section>

        {/* The Solution */}
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-200 mb-4">
            The Solution: Two Coils, Clever Wiring
          </h2>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            The humbucker, invented by Seth Lover at Gibson in 1955, uses two
            coils with a specific arrangement:
          </p>

          <div className="grid md:grid-cols-2 gap-6 my-6">
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800">
              <h3 className="text-lg font-semibold text-red-500 dark:text-red-400 mb-3">
                Coil 1
              </h3>
              <ul className="space-y-2 text-zinc-800 dark:text-zinc-400 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500" />
                  North pole facing string
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-lg">↻</span>
                  Clockwise winding
                </li>
              </ul>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800">
              <h3 className="text-lg font-semibold text-blue-500 dark:text-blue-400 mb-3">
                Coil 2
              </h3>
              <ul className="space-y-2 text-zinc-800 dark:text-zinc-400 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-500" />
                  South pole facing string
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-lg">↺</span>
                  Counter-clockwise winding
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-orange-50 dark:from-purple-900/20 dark:to-orange-900/20 p-6 rounded-xl my-6 border border-purple-200 dark:border-purple-800">
            <p className="text-center text-lg text-zinc-900 dark:text-zinc-300 font-medium">
              Opposite magnets + Opposite windings = <br />
              <span className="text-green-600 dark:text-green-400">
                String signal adds
              </span>
              ,{" "}
              <span className="text-red-500 dark:text-red-400">
                Hum cancels
              </span>
            </p>
          </div>
        </section>

        {/* The Physics */}
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-200 mb-4">
            Why It Works: Faraday&apos;s Law Applied Twice
          </h2>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed mb-4">
            Recall that a pickup generates voltage based on the rate of change
            of magnetic flux through the coil:
          </p>

          <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg my-4 font-mono text-center">
            V = -N × dΦ/dt
          </div>

          <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-200 mt-6 mb-3">
            For the String Signal:
          </h3>

          <div className="space-y-4 text-zinc-900 dark:text-zinc-300">
            <p>
              <strong>Coil 1 (N-up):</strong> When the string moves toward the
              pickup, it increases the flux through the coil. With north facing
              up and clockwise winding, this produces a{" "}
              <span className="text-green-600 dark:text-green-400 font-medium">
                positive voltage
              </span>
              .
            </p>
            <p>
              <strong>Coil 2 (S-up):</strong> The same string motion now
              decreases the flux (south pole means field points the other way).
              But the winding is also reversed, so the induced voltage is still{" "}
              <span className="text-green-600 dark:text-green-400 font-medium">
                positive
              </span>
              .
            </p>
            <p className="font-medium">
              Result: Both coils produce the same polarity signal → they{" "}
              <span className="text-green-600 dark:text-green-400">ADD</span>
            </p>
          </div>

          <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-200 mt-6 mb-3">
            For the 60Hz Hum:
          </h3>

          <div className="space-y-4 text-zinc-900 dark:text-zinc-300">
            <p>
              External electromagnetic interference passes through{" "}
              <em>both coils equally</em>. It doesn&apos;t care about the magnet
              polarity because it&apos;s not interacting with the magnet at all.
            </p>
            <p>
              <strong>Coil 1:</strong> Hum induces a{" "}
              <span className="text-yellow-600 dark:text-yellow-400 font-medium">
                positive voltage
              </span>{" "}
              (clockwise winding)
            </p>
            <p>
              <strong>Coil 2:</strong> Same hum induces a{" "}
              <span className="text-yellow-600 dark:text-yellow-400 font-medium">
                negative voltage
              </span>{" "}
              (counter-clockwise winding)
            </p>
            <p className="font-medium">
              Result: Hum signals are opposite polarity → they{" "}
              <span className="text-red-500 dark:text-red-400">CANCEL</span>
            </p>
          </div>
        </section>

        {/* Coil Splitting */}
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-200 mb-4">
            Coil Splitting (Coil Tap)
          </h2>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            Many guitars with humbuckers include a switch that disconnects one
            of the coils, converting the humbucker into a single-coil pickup.
            This is called <strong>coil splitting</strong> (often incorrectly
            called &quot;coil tapping&quot;).
          </p>

          <div className="grid md:grid-cols-2 gap-6 my-6">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
              <h3 className="text-lg font-semibold text-green-700 dark:text-green-400 mb-2">
                Humbucker Mode
              </h3>
              <ul className="list-disc pl-6 space-y-1 text-zinc-800 dark:text-zinc-400 text-sm">
                <li>Full hum cancellation</li>
                <li>Higher output (both coils)</li>
                <li>Warmer, fatter tone</li>
                <li>Less high-frequency content</li>
              </ul>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800">
              <h3 className="text-lg font-semibold text-yellow-700 dark:text-yellow-400 mb-2">
                Split (Single Coil) Mode
              </h3>
              <ul className="list-disc pl-6 space-y-1 text-zinc-800 dark:text-zinc-400 text-sm">
                <li>No hum cancellation</li>
                <li>Lower output (one coil)</li>
                <li>Brighter, twangier tone</li>
                <li>More high-frequency content</li>
              </ul>
            </div>
          </div>

          <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg">
            <p className="text-sm text-zinc-800 dark:text-zinc-400">
              <strong>Try it:</strong> In the simulation above, toggle between
              humbucker and single-coil modes while watching the waveforms. With
              the hum level turned up, you&apos;ll see the dramatic difference
              in noise rejection.
            </p>
          </div>
        </section>

        {/* Tonal Differences */}
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-200 mb-4">
            Why Humbuckers Sound Different
          </h2>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            Beyond noise cancellation, humbuckers have a distinctly different
            tone than single coils:
          </p>

          <div className="space-y-4 my-6">
            <div className="flex gap-4 items-start">
              <div className="w-3 h-3 rounded-full bg-purple-600 mt-1.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-200">
                  Wider Sensing Area
                </h3>
                <p className="text-zinc-800 dark:text-zinc-400 text-sm">
                  Two coils sample a wider portion of the string. This averages
                  out some high-frequency content (similar to moving a single
                  pickup toward the neck).
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-3 h-3 rounded-full bg-purple-600 mt-1.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-200">
                  Higher Inductance
                </h3>
                <p className="text-zinc-800 dark:text-zinc-400 text-sm">
                  More wire means more inductance, which lowers the resonant
                  peak frequency. This reduces &quot;sparkle&quot; and adds
                  &quot;thickness.&quot;
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-3 h-3 rounded-full bg-purple-600 mt-1.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-200">
                  Higher Output
                </h3>
                <p className="text-zinc-800 dark:text-zinc-400 text-sm">
                  Two coils in series produce roughly double the voltage,
                  driving the amp harder. Great for distortion and sustain.
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
              Single-coil pickups act as antennas, picking up 60Hz hum from
              nearby electronics
            </li>
            <li>
              Humbuckers use two coils with opposite magnet polarity and
              opposite winding direction
            </li>
            <li>
              The string signal sees both differences (magnet + winding) → adds
              constructively
            </li>
            <li>
              External hum only sees the winding difference → cancels
              destructively
            </li>
            <li>
              Coil splitting disables one coil for single-coil tone at the cost
              of hum rejection
            </li>
            <li>
              The wider sensing area and higher inductance give humbuckers their
              characteristic warm tone
            </li>
          </ol>
        </section>
      </div>
    </div>
  );
}
