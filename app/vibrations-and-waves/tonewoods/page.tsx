import TonewoodSim from "@/app/components/TonewoodSim";

export default function TonewoodsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 lg:py-16">
      <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-orange-500 mb-4">
        Tonewoods & Electric Guitars
      </h1>
      <p className="text-zinc-800 dark:text-zinc-400 mb-8">
        A simplified look at how wood properties can affect electric guitar tone
        through coupled oscillation
      </p>

      {/* Interactive Simulation */}
      <TonewoodSim className="mb-12" />

      {/* Physics explanation */}
      <div className="space-y-8">
        {/* The Debate */}
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-200 mb-4">
            The Great Tonewood Debate
          </h2>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            Few topics in guitar circles spark more heated discussion than
            whether wood affects the tone of a <em>solid-body electric</em>{" "}
            guitar. After all, the pickup only senses the string&apos;s
            motion. It doesn&apos;t &quot;hear&quot; the wood vibrating.
          </p>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-xl my-6 border border-yellow-200 dark:border-yellow-800">
            <p className="text-zinc-900 dark:text-zinc-300">
              <strong>The skeptic&apos;s view:</strong> The pickup is an
              electromagnetic sensor. It converts string velocity into voltage.
              The wood doesn&apos;t enter this equation, so how could it matter?
            </p>
          </div>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            The answer lies in <strong>boundary conditions</strong>. The string
            isn&apos;t attached to an infinitely rigid fixture. It&apos;s
            attached to wood, which can flex and absorb energy.
          </p>
        </section>

        {/* The Physics */}
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-200 mb-4">
            Coupled Oscillators
          </h2>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            When you solve the wave equation for a vibrating string, you assume
            fixed boundary conditions: y(0,t) = y(L,t) = 0. But what if the
            boundary itself can move?
          </p>

          <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg my-4 font-mono text-center text-sm">
            <p>String: y(0,t) = y_wood(t) ≠ 0</p>
            <p className="mt-2">
              Wood: m·y&quot; + c·y&apos; + k·y = F_string
            </p>
          </div>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            The string and wood form a <strong>coupled oscillator system</strong>
            . The vibrating string exerts a force on the wood (through the nut
            and neck), and the wood&apos;s motion affects the string&apos;s
            boundary condition.
          </p>

          <div className="grid md:grid-cols-3 gap-4 my-6">
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-200 dark:border-zinc-800">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-200 mb-2">
                Mass (m)
              </h3>
              <p className="text-zinc-800 dark:text-zinc-400 text-sm">
                Effective mass of the wood at the coupling point. Denser woods
                move less.
              </p>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-200 dark:border-zinc-800">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-200 mb-2">
                Stiffness (k)
              </h3>
              <p className="text-zinc-800 dark:text-zinc-400 text-sm">
                How much the wood resists deformation. Higher k = higher
                resonant frequency.
              </p>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-200 dark:border-zinc-800">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-200 mb-2">
                Damping (c)
              </h3>
              <p className="text-zinc-800 dark:text-zinc-400 text-sm">
                Energy dissipation in the wood. The simulation uses 3× the
                string&apos;s air damping.
              </p>
            </div>
          </div>
        </section>

        {/* How Wood Affects Tone */}
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-200 mb-4">
            How Wood Properties Affect Tone
          </h2>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed mb-4">
            The wood acts as a <strong>frequency-dependent energy sink</strong>.
            When the wood&apos;s natural resonant frequency matches a string
            harmonic, energy transfers efficiently from string to wood and is
            dissipated as heat.
          </p>

          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <div
                className="w-6 h-6 rounded flex-shrink-0 mt-1"
                style={{ backgroundColor: "#a3a3a3" }}
              />
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-200">
                  Very Stiff Wood (e.g., Hard Maple)
                </h3>
                <p className="text-zinc-800 dark:text-zinc-400 text-sm">
                  High resonant frequency, minimal coupling with string modes.
                  Approaches the &quot;ideal&quot; fixed boundary. Maximum
                  sustain, full frequency response.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div
                className="w-6 h-6 rounded flex-shrink-0 mt-1"
                style={{ backgroundColor: "#d4a574" }}
              />
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-200">
                  Medium Stiffness (e.g., Soft Maple, Ash)
                </h3>
                <p className="text-zinc-800 dark:text-zinc-400 text-sm">
                  Resonates with higher harmonics. Can absorb treble frequencies,
                  resulting in a slightly warmer tone with reduced &quot;ice
                  pick&quot; highs.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div
                className="w-6 h-6 rounded flex-shrink-0 mt-1"
                style={{ backgroundColor: "#8b5a2b" }}
              />
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-200">
                  Lower Stiffness (e.g., Mahogany, Basswood)
                </h3>
                <p className="text-zinc-800 dark:text-zinc-400 text-sm">
                  Resonates with lower harmonics. Can absorb bass frequencies,
                  potentially thinning the low end while preserving highs and
                  midrange definition.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-orange-50 dark:from-purple-900/20 dark:to-orange-900/20 p-6 rounded-xl my-6 border border-purple-200 dark:border-purple-800">
            <p className="text-center text-zinc-900 dark:text-zinc-300 font-medium">
              The wood doesn&apos;t add frequencies. It selectively{" "}
              <em>removes</em> them by absorbing energy at its resonant
              frequency.
            </p>
          </div>
        </section>

        {/* Caveats */}
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-200 mb-4">
            Important Caveats
          </h2>

          <div className="bg-zinc-100 dark:bg-zinc-800 p-6 rounded-xl">
            <p className="text-zinc-900 dark:text-zinc-300 mb-4">
              This simulation is <strong>highly simplified</strong> to
              illustrate the concept. Real-world tonewood effects are:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-zinc-800 dark:text-zinc-400">
              <li>
                <strong>Very subtle</strong>: far less dramatic than pickup
                choice, amp settings, or playing technique
              </li>
              <li>
                <strong>Difficult to isolate</strong>: two guitars differ in many
                variables beyond wood species
              </li>
              <li>
                <strong>Multi-dimensional</strong>: real wood has grain
                direction, moisture content, density variations, and complex
                resonant modes
              </li>
              <li>
                <strong>Construction-dependent</strong>: neck joint type, body
                shape, and hardware mass all contribute
              </li>
              <li>
                <strong>Controversial</strong>: double-blind studies have shown
                mixed results on whether players can reliably distinguish
                tonewoods
              </li>
            </ul>
          </div>
        </section>

        {/* The Pickup's Perspective */}
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-200 mb-4">
            What the Pickup Actually Sees
          </h2>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            Remember: the pickup converts <strong>string velocity</strong> to
            voltage. It doesn&apos;t care <em>why</em> the string is moving a
            certain way, only <em>how</em> it&apos;s moving.
          </p>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed mt-4">
            If the wood absorbs energy from certain harmonics, those harmonics
            will have lower amplitude in the string&apos;s motion. The pickup
            faithfully reports this modified motion. The effect is real, but
            it&apos;s the string that changed, not the pickup&apos;s sensing
            mechanism.
          </p>

          <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg mt-4">
            <p className="text-sm text-zinc-800 dark:text-zinc-400">
              <strong>Try it:</strong> In the simulation, watch the
              &quot;Pickup Output&quot; waveform as you switch between wood
              types. With bass-absorbing wood, notice how the low-frequency
              content diminishes over time compared to stiff wood.
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
              The string and guitar body form a coupled oscillator system
            </li>
            <li>
              Wood properties (mass, stiffness, damping) determine the
              body&apos;s resonant behavior
            </li>
            <li>
              Energy transfers from string to wood most efficiently at resonant
              frequencies
            </li>
            <li>
              This acts as a frequency-selective damping mechanism
            </li>
            <li>
              The pickup sees the modified string motion, not the wood directly
            </li>
            <li>
              Real-world effects are subtle and difficult to isolate from other
              variables
            </li>
          </ol>
        </section>
      </div>
    </div>
  );
}
