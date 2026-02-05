import PickupOperationSim from "@/app/components/PickupOperationSim";
import PickupCircuitSim from "@/app/components/PickupCircuitSim";

export default function PickupOperationPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 lg:py-16">
      <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-orange-500 mb-4">
        Pickup Operation
      </h1>
      <p className="text-zinc-800 dark:text-zinc-400 mb-8">
        How electromagnetic pickups transduce string vibration into electric
        voltage
      </p>

      {/* Interactive Simulation */}
      <PickupOperationSim className="mb-12" />

      {/* Physics explanation */}
      <div className="space-y-8">
        {/* The Basic Setup */}
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-200 mb-4">
            The Setup
          </h2>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            There are three components to consider in order to understand how a
            guitar pickup works:
          </p>

          <div className="grid md:grid-cols-3 gap-4 my-6">
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-b from-red-500 to-blue-500 mb-3" />
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-200 mb-1">
                Permanent Magnets
              </h3>
              <p className="text-sm text-zinc-800 dark:text-zinc-400">
                Usually one per string, each creating a static magnetic field in
                the region of space near the string
              </p>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700">
              <div className="w-10 h-10 rounded-lg bg-zinc-400 mb-3" />
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-200 mb-1">
                Guitar String
              </h3>
              <p className="text-sm text-zinc-800 dark:text-zinc-400">
                Made of magnetically permeable material (e.g., steel, nickel)
                that interacts with the magnetic field and alters it when it
                vibrates
              </p>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700">
              <div className="w-10 h-10 rounded-lg bg-amber-600 mb-3" />
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-200 mb-1">
                Wire Coil
              </h3>
              <p className="text-sm text-zinc-800 dark:text-zinc-400">
                Thousands of turns of thin copper wire wrapped around the
                magnets, forming an inductor that picks up changes in magnetic
                flux
              </p>
            </div>
          </div>

          <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg">
            <p className="text-sm text-zinc-800 dark:text-zinc-400">
              <strong>Why metal strings?</strong> Nylon strings don&apos;t work
              with magnetic pickups because they&apos;re not magnetically
              permeable. The string must be able to interact with the magnetic
              field, which is why electric guitars use steel or nickel-wound
              strings.
            </p>
          </div>
        </section>

        {/* Faraday's Law */}
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-200 mb-4">
            Faraday&apos;s Law of Induction
          </h2>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            A pickup works because of one of the most important laws in
            electromagnetism: <strong>Faraday&apos;s Law</strong>. In this
            context, it states that a changing magnetic field through a coil
            induces a voltage:
          </p>

          <div className="bg-gradient-to-r from-purple-50 to-orange-50 dark:from-purple-900/20 dark:to-orange-900/20 p-6 rounded-xl my-6 border border-purple-200 dark:border-purple-800">
            <div className="text-center font-mono text-2xl text-zinc-900 dark:text-zinc-200">
              V = -N · dΦ/dt
            </div>
          </div>

          <ul className="list-none space-y-3 my-6">
            <li className="flex gap-4 items-start">
              <span className="font-mono text-purple-600 dark:text-purple-400 font-bold">
                V
              </span>
              <span className="text-zinc-900 dark:text-zinc-300">
                The induced voltage (EMF) across the coil.
              </span>
            </li>
            <li className="flex gap-4 items-start">
              <span className="font-mono text-purple-600 dark:text-purple-400 font-bold">
                N
              </span>
              <span className="text-zinc-900 dark:text-zinc-300">
                Number of turns in the coil (typically 5,000-10,000 for guitar
                pickups)
              </span>
            </li>
            <li className="flex gap-4 items-start">
              <span className="font-mono text-purple-600 dark:text-purple-400 font-bold">
                dΦ/dt
              </span>
              <span className="text-zinc-900 dark:text-zinc-300">
                Rate of change of magnetic flux through the coil
              </span>
            </li>
          </ul>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            As a <em>magnetically permeable</em> guitar string vibrates, it
            changes the magnetic field through the coil at the same frequencies
            as it is vibrating at. According to Faraday&apos;s law, this
            changing flux induces a voltage in the coil that mirrors the
            string&apos;s motion. By this mechanism, mechanical vibrations are
            <strong>transduced</strong> into an electrical signal!
          </p>
        </section>

        {/* Velocity, Not Position */}
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-200 mb-4">
            The Pickup Outputs Velocity, Not Position
          </h2>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            When the string vibrates, it perturbs the magnetic field passing
            through the coil. Since the amount of flux through the coil is
            determined by the position of the string, the{" "}
            <em>rate of change</em> of the string's position is what actually
            induces the voltage. In other words:
          </p>

          <div className="bg-gradient-to-r from-purple-50 to-orange-50 dark:from-purple-900/20 dark:to-orange-900/20 p-6 rounded-xl my-6 border border-purple-200 dark:border-purple-800">
            <div className="text-center font-mono text-xl text-zinc-900 dark:text-zinc-200">
              V<sub>out</sub> ∝ dΦ/dt ∝ dy/dt = velocity
            </div>
          </div>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            And so, the output voltage of the pickup is related to the{" "}
            <strong>derivative</strong> of the string position. In the
            simulation above, notice how:
          </p>

          <ul className="list-disc pl-6 space-y-2 text-zinc-900 dark:text-zinc-300">
            <li>
              When the string is the limits of its motion (top or bottom), the
              voltage is <strong>zero</strong> because the string has
              momentarily stopped
            </li>
            <li>
              When the string crosses through the center, the voltage is at{" "}
              <strong>maximum</strong> because the string is moving fastest
            </li>
            <li>
              The voltage waveform is out of phase with the position waveform by
              90° (quarter cycle)
            </li>
          </ul>
        </section>

        {/* Frequency Response */}
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-200 mb-4">
            Frequency Response and Treble Boost
          </h2>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            For a string vibrating sinusoidally at frequency f with amplitude A:
          </p>

          <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg my-4 space-y-2 font-mono text-center">
            <div>Position: y(t) = A · sin(2πft)</div>
            <div>Velocity: dy/dt = A · 2πf · cos(2πft)</div>
          </div>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            We can see that the peak velocity is proportional to both amplitude
            AND frequency:
          </p>

          <div className="bg-gradient-to-r from-purple-50 to-orange-50 dark:from-purple-900/20 dark:to-orange-900/20 p-6 rounded-xl my-6 border border-purple-200 dark:border-purple-800">
            <div className="text-center font-mono text-xl text-zinc-900 dark:text-zinc-200">
              V<sub>peak</sub> ∝ A · f
            </div>
          </div>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            So, even if two frequencies have the same displacement amplitude
            (i.e., two normal modes of the string have the same amplitude), the
            higher frequency will produce a stronger signal because the string
            moves faster. In the absence of any other effects, this gives
            pickups a natural <strong>treble boost</strong>. As we'll see later,
            the coil's inductance and parasitic capacitance actually modify this
            response quite a bit.
          </p>

          <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg mt-4">
            <p className="text-sm text-zinc-800 dark:text-zinc-400">
              <strong>Try it:</strong> In the simulation, increase the frequency
              while keeping amplitude constant. Watch the output voltage
              waveform grow larger even though the string displacement stays the
              same.
            </p>
          </div>
        </section>

        {/* More Coil Turns */}
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-200 mb-4 flex items-center gap-3">
            The Role of Coil Turns & The LC Circuit
            <span className="px-2 py-0.5 text-xs font-semibold bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full">
              Advanced
            </span>
          </h2>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            Recall from Faraday&apos;s law above that voltage scales linearly
            with the number of turns N. In order to produce a strong enough
            signal for downstream preamplifiers, guitar pickups typically have
            thousands of turns of wire. But there is another consequence to
            incrasing the number of turns: more inductance and capacitance,
            which together fundamentally shape the pickup&apos;s frequency
            response.
          </p>

          <div className="grid md:grid-cols-2 gap-6 my-6">
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800">
              <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-400 mb-2">
                More Turns = Higher Output
              </h3>
              <p className="text-zinc-800 dark:text-zinc-400 text-sm">
                A pickup with 8,000 turns produces roughly twice the voltage of
                one with 4,000 turns (all else being equal).
              </p>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800">
              <h3 className="text-lg font-semibold text-orange-500 dark:text-orange-400 mb-2">
                But Also More L (inductance) and C (capacitance)
              </h3>
              <p className="text-zinc-800 dark:text-zinc-400 text-sm">
                The presence of inductance and capacitance creates a resonant
                peak in the frequency response, which shifts lower with more
                turns, resulting in a darker tone.
              </p>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-200 mt-8 mb-4">
            The Equivalent Circuit
          </h3>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed mb-4">
            Also including hte DC resistance of the coil, a pickup can be
            modeled as an RLC circuit.
          </p>

          <ul className="list-disc pl-6 space-y-2 text-zinc-900 dark:text-zinc-300 mb-6">
            <li>
              <strong>
                V<sub>emf</sub>
              </strong>
              : The induced voltage from string motion (proportional to
              frequency)
            </li>
            <li>
              <strong>R</strong>: DC resistance of the coil (typically 5-15 kΩ)
            </li>
            <li>
              <strong>L</strong>: Inductance of the coil (typically 2-8 H)
            </li>
            <li>
              <strong>C</strong>: Parasitic capacitance between windings
              (typically 100-200 pF)
            </li>
          </ul>

          <PickupCircuitSim className="my-8" />

          <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-200 mt-8 mb-4">
            Impedance and Resonance
          </h3>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            The impedance of the coil varies with frequency. For a series RLC
            circuit:
          </p>

          <div className="bg-gradient-to-r from-purple-50 to-orange-50 dark:from-purple-900/20 dark:to-orange-900/20 p-6 rounded-xl my-6 border border-purple-200 dark:border-purple-800 space-y-3">
            <div className="text-center font-mono text-lg text-zinc-900 dark:text-zinc-200">
              Z = √(R² + (X<sub>L</sub> - X<sub>C</sub>)²)
            </div>
            <div className="text-center text-sm text-zinc-800 dark:text-zinc-400">
              where X<sub>L</sub> = 2πfL (inductive reactance) and X<sub>C</sub>{" "}
              = 1/(2πfC) (capacitive reactance)
            </div>
          </div>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            To find the output voltage, we use the voltage divider. The EMF
            source V<sub>emf</sub> is in series with L and R, while C appears in
            parallel across the output terminals:
          </p>

          <div className="bg-zinc-100 dark:bg-zinc-800 p-6 rounded-xl my-6 space-y-4">
            <div className="text-center font-mono text-zinc-900 dark:text-zinc-200">
              <div className="mb-2">
                V<sub>out</sub> = V<sub>emf</sub> · Z<sub>C</sub> / (Z
                <sub>LR</sub> + Z<sub>C</sub>)
              </div>
              <div className="text-sm text-zinc-800 dark:text-zinc-400 mb-4">
                where Z<sub>LR</sub> = R + jωL and Z<sub>C</sub> = 1/(jωC)
              </div>
            </div>
            <div className="text-center font-mono text-zinc-900 dark:text-zinc-200">
              <div className="mb-1">Substituting and simplifying:</div>
              <div className="text-lg mt-2">
                V<sub>out</sub> = V<sub>emf</sub> · 1 / (1 − ω²LC + jωRC)
              </div>
            </div>
          </div>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            The transfer function H(jω) = V<sub>out</sub>/V<sub>emf</sub> has
            magnitude:
          </p>

          <div className="bg-gradient-to-r from-purple-50 to-orange-50 dark:from-purple-900/20 dark:to-orange-900/20 p-6 rounded-xl my-6 border border-purple-200 dark:border-purple-800">
            <div className="text-center font-mono text-xl text-zinc-900 dark:text-zinc-200">
              |H(jω)| = 1 / √((1 − ω²LC)² + (ωRC)²)
            </div>
          </div>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            At the <strong>resonant frequency</strong>, the term (1 − ω²LC)
            becomes zero, which occurs when:
          </p>

          <div className="bg-gradient-to-r from-purple-50 to-orange-50 dark:from-purple-900/20 dark:to-orange-900/20 p-6 rounded-xl my-6 border border-purple-200 dark:border-purple-800">
            <div className="text-center font-mono text-xl text-zinc-900 dark:text-zinc-200">
              f₀ = 1 / (2π√LC)
            </div>
          </div>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed mt-4">
            Remember that V<sub>emf</sub> itself is proportional to frequency
            (from Faraday&apos;s law). We see the complete frequency-dependent
            output of the pickup by combining the frequency dependence of both
            the input EMF and the transfer function:
          </p>

          <div className="bg-gradient-to-r from-purple-50 to-orange-50 dark:from-purple-900/20 dark:to-orange-900/20 p-6 rounded-xl my-6 border border-purple-200 dark:border-purple-800">
            <div className="text-center font-mono text-xl text-zinc-900 dark:text-zinc-200">
              |V<sub>out</sub>| ∝ ω / √((1 − ω²LC)² + (ωRC)²)
            </div>
          </div>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            This creates a <strong>resonant peak</strong> in the frequency
            response. The output rises with frequency (Faraday&apos;s law),
            peaks at f₀, then rolls off as the capacitive reactance dominates.
          </p>

          <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg mt-4">
            <p className="text-sm text-zinc-800 dark:text-zinc-400">
              <strong>Try it:</strong> In the circuit simulator above, increase
              the inductance L or capacitance C and watch the resonant peak
              shift to lower frequencies. This is why &quot;hot&quot; pickups
              with more windings sound darker because more inductance lowers f₀.
            </p>
          </div>
        </section>

        {/* Summary */}
        <section className="bg-gradient-to-br from-purple-100 to-orange-100 dark:from-purple-900/30 dark:to-orange-900/30 p-6 rounded-xl border border-purple-200 dark:border-purple-800">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-200 mb-4">
            Summary: The Signal Chain
          </h2>
          <ol className="list-decimal pl-6 space-y-2 text-zinc-900 dark:text-zinc-300">
            <li>
              The permanent magnet creates a static magnetic field extending
              toward the string
            </li>
            <li>
              The steel string, being magnetically permeable, concentrates the
              field lines near itself
            </li>
            <li>
              When the string vibrates, it moves these concentrated field lines,
              changing the flux through the coil
            </li>
            <li>
              By Faraday&apos;s law, this changing flux induces a voltage
              proportional to the string&apos;s <em>velocity</em>
            </li>
            <li>
              Higher frequencies produce larger voltages for the same amplitude,
              a natural treble boost
            </li>
            <li>
              More coil turns increase output but also increase capacitance
              (darker tone)
            </li>
          </ol>
        </section>
      </div>
    </div>
  );
}
