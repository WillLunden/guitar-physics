import TubePreampSim from "@/app/components/TubePreampSim";

export default function TubePreampPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 lg:py-16">
      <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-orange-500 mb-4">
        Tube Preamp
      </h1>
      <p className="text-zinc-800 dark:text-zinc-400 mb-8">
        How vacuum tubes amplify your guitar signal and create the legendary
        &quot;tube tone&quot;
      </p>

      {/* Interactive Simulation */}
      <TubePreampSim className="mb-12" />

      {/* Physics explanation */}
      <div className="space-y-8">
        {/* What is a Preamp */}
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-200 mb-4">
            What is a Preamp?
          </h2>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            A preamplifier is responsible for increasing the signal size (voltage
            gain) so that it can be passed to the power amplifier. Your guitar&apos;s
            pickups produce a very small signal, typically only a few hundred
            millivolts. The preamp boosts this to several volts, shaping the tone
            along the way.
          </p>

          <div className="bg-gradient-to-r from-purple-50 to-orange-50 dark:from-purple-900/20 dark:to-orange-900/20 p-6 rounded-xl my-6 border border-purple-200 dark:border-purple-800">
            <p className="text-center text-zinc-900 dark:text-zinc-300 font-medium">
              Guitar pickup output: ~100-500mV → Preamp → Output: ~1-10V
            </p>
          </div>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            The distortion characteristics of vacuum tube preamps are one of the
            most important factors in the sound of various amplifiers popular in
            rock and metal. When pushed hard, tubes produce a warm, harmonically
            rich overdrive that has defined the sound of electric guitar for
            decades.
          </p>
        </section>

        {/* Tubes vs Solid State */}
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-200 mb-4">
            Tubes vs. Solid State
          </h2>

          <div className="grid md:grid-cols-2 gap-6 my-6">
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-6 border border-orange-200 dark:border-orange-800">
              <h3 className="text-lg font-semibold text-orange-700 dark:text-orange-400 mb-2">
                Vacuum Tubes
              </h3>
              <ul className="list-disc pl-6 space-y-1 text-zinc-800 dark:text-zinc-400 text-sm">
                <li>Soft clipping with gradual compression</li>
                <li>Even and odd harmonics (warm, musical)</li>
                <li>Dynamic response to playing intensity</li>
                <li>Requires high voltages (250-400V)</li>
                <li>Generates heat, limited lifespan</li>
                <li>The &quot;gold standard&quot; for guitar tone</li>
              </ul>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-400 mb-2">
                Solid State (Transistors)
              </h3>
              <ul className="list-disc pl-6 space-y-1 text-zinc-800 dark:text-zinc-400 text-sm">
                <li>Hard clipping with abrupt cutoff</li>
                <li>Predominantly odd harmonics (harsher)</li>
                <li>More consistent, less dynamic</li>
                <li>Low voltage, efficient operation</li>
                <li>Reliable, long-lasting, inexpensive</li>
                <li>Popular for clean tones and certain styles</li>
              </ul>
            </div>
          </div>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            The harmonic content of vacuum tube distortion is historically
            considered superior for guitar. However, with the rise of digital
            emulation, tube preamps can now be simulated in real time with high
            fidelity, blurring the lines between the technologies.
          </p>
        </section>

        {/* How Tubes Work */}
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-200 mb-4">
            Vacuum Tubes: Tiny Electron Accelerators
          </h2>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed mb-4">
            A vacuum tube (or &quot;valve&quot; in British English) is essentially a
            tiny particle accelerator. It controls the flow of electrons through
            a vacuum using electric fields.
          </p>

          <div className="space-y-4 my-6">
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-200">
                  The Cathode
                </h3>
                <p className="text-zinc-800 dark:text-zinc-400 text-sm">
                  A metal element heated by a filament. The heat causes electrons
                  to &quot;boil off&quot; the surface through thermionic emission.
                  This is the source of free electrons in the tube.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-zinc-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-200">
                  The Plate (Anode)
                </h3>
                <p className="text-zinc-800 dark:text-zinc-400 text-sm">
                  A metal plate held at a high positive voltage (typically
                  250-400V). This attracts the negatively charged electrons,
                  pulling them across the vacuum. The electron flow exits the
                  tube as current on a wire.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-200">
                  The Grid
                </h3>
                <p className="text-zinc-800 dark:text-zinc-400 text-sm">
                  A wire mesh positioned between the cathode and plate. By
                  applying a voltage to this grid, you can control the electron
                  flow. A negative voltage repels electrons, reducing plate
                  current. A less negative voltage allows more electrons through.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg">
            <p className="text-sm text-zinc-800 dark:text-zinc-400">
              <strong>The key insight:</strong> A small voltage change on the
              grid causes a large change in plate current. This is amplification.
              A tiny input signal controls a much larger output signal.
            </p>
          </div>
        </section>

        {/* How Amplification Works */}
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-200 mb-4">
            From Signal to Sound
          </h2>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed mb-4">
            Here&apos;s how your guitar signal becomes amplified:
          </p>

          <ol className="list-decimal pl-6 space-y-3 text-zinc-900 dark:text-zinc-300">
            <li>
              <strong>Input coupling:</strong> Your guitar signal passes through
              a coupling capacitor (C1), which blocks DC but passes the audio
              signal to the grid.
            </li>
            <li>
              <strong>Grid modulation:</strong> The audio signal varies the grid
              voltage, which modulates the electron flow through the tube.
            </li>
            <li>
              <strong>Current to voltage:</strong> The varying plate current
              flows through a load resistor (Ra). By Ohm&apos;s law (V = IR),
              this creates a varying voltage, which is your amplified signal.
            </li>
            <li>
              <strong>Phase inversion:</strong> When the grid goes more positive,
              more current flows, causing a larger voltage drop across Ra. This
              means the output voltage goes <em>down</em>. The output is inverted
              (180° out of phase) from the input.
            </li>
            <li>
              <strong>Output coupling:</strong> Another capacitor (C2) blocks the
              high DC plate voltage while passing the amplified audio signal to
              the next stage.
            </li>
          </ol>
        </section>

        {/* Cathode Bias */}
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-200 mb-4">
            Cathode Bias: Self-Regulating Operation
          </h2>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            The cathode bias resistor (Rk) is a clever bit of circuit design. As
            current flows through the tube, it also flows through Rk, creating a
            voltage drop. This makes the cathode slightly positive relative to
            ground.
          </p>

          <div className="bg-gradient-to-r from-purple-50 to-orange-50 dark:from-purple-900/20 dark:to-orange-900/20 p-6 rounded-xl my-6 border border-purple-200 dark:border-purple-800">
            <p className="text-center text-zinc-900 dark:text-zinc-300">
              Since the grid is referenced to ground, and the cathode is positive,
              the grid is effectively <strong>negative relative to the cathode</strong>.
            </p>
          </div>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            This negative bias is essential. Without it, the tube would conduct
            too much current at rest, wasting power and potentially damaging itself.
            The bypass capacitor (Ck) allows the AC signal to pass around the
            resistor, preventing gain reduction at audio frequencies.
          </p>
        </section>

        {/* Common Tubes */}
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-200 mb-4">
            Common Preamp Tubes
          </h2>

          <div className="space-y-4 my-6">
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800">
              <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-400 mb-2">
                12AX7 (ECC83)
              </h3>
              <p className="text-zinc-800 dark:text-zinc-400 text-sm mb-2">
                The most common guitar preamp tube. High gain factor (~100),
                relatively low noise. Found in virtually every tube guitar amp
                from Fender to Marshall to Mesa Boogie.
              </p>
              <p className="text-zinc-700 dark:text-zinc-500 text-xs">
                Used in: Fender Twin, Marshall JCM800, Mesa Rectifier, Vox AC30
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800">
              <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-400 mb-2">
                12AT7 (ECC81)
              </h3>
              <p className="text-zinc-800 dark:text-zinc-400 text-sm mb-2">
                Lower gain (~60) but higher current capability. Often used in
                reverb drivers and phase inverter stages. Cleaner, more headroom.
              </p>
              <p className="text-zinc-700 dark:text-zinc-500 text-xs">
                Used in: Reverb circuits, hi-fi equipment, phase inverters
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800">
              <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-400 mb-2">
                12AU7 (ECC82)
              </h3>
              <p className="text-zinc-800 dark:text-zinc-400 text-sm mb-2">
                Even lower gain (~20), high current. Used where clean amplification
                is needed without adding distortion. Common in hi-fi and effects loops.
              </p>
              <p className="text-zinc-700 dark:text-zinc-500 text-xs">
                Used in: Effects loops, clean preamp stages, hi-fi audio
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800">
              <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-400 mb-2">
                EF86 (6267)
              </h3>
              <p className="text-zinc-800 dark:text-zinc-400 text-sm mb-2">
                A pentode (5 elements instead of 3) with very high gain and a
                distinctive chime. More prone to microphonics but beloved for
                its unique tonal character.
              </p>
              <p className="text-zinc-700 dark:text-zinc-500 text-xs">
                Used in: Vox AC15/AC30 (original), some boutique amps
              </p>
            </div>
          </div>
        </section>

        {/* Why Tubes Sound Different */}
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-200 mb-4">
            Why Tubes &quot;Sound Better&quot;
          </h2>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed mb-4">
            The perceived superiority of tube sound comes from several factors:
          </p>

          <div className="space-y-4 my-6">
            <div className="flex gap-4 items-start">
              <div className="w-3 h-3 rounded-full bg-purple-600 mt-1.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-200">
                  Soft clipping
                </h3>
                <p className="text-zinc-800 dark:text-zinc-400 text-sm">
                  Tubes compress gradually as they approach saturation, creating
                  smooth, musical distortion rather than harsh clipping.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-3 h-3 rounded-full bg-purple-600 mt-1.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-200">
                  Even harmonics
                </h3>
                <p className="text-zinc-800 dark:text-zinc-400 text-sm">
                  The asymmetric transfer curve of tubes generates even harmonics
                  (2nd, 4th, 6th) which are musically consonant, adding warmth
                  and richness.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-3 h-3 rounded-full bg-purple-600 mt-1.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-200">
                  Dynamic response
                </h3>
                <p className="text-zinc-800 dark:text-zinc-400 text-sm">
                  Tubes respond differently to soft and hard playing. Play
                  lightly for clean tones, dig in for more drive. This &quot;touch
                  sensitivity&quot; is highly prized by players.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-3 h-3 rounded-full bg-purple-600 mt-1.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-200">
                  Natural compression
                </h3>
                <p className="text-zinc-800 dark:text-zinc-400 text-sm">
                  As the tube saturates, loud signals are compressed while quiet
                  signals pass through cleanly. This evens out dynamics in a
                  pleasing way.
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
              A preamp increases signal voltage so it can drive a power amplifier
            </li>
            <li>
              Vacuum tubes are electron accelerators: heated cathode emits
              electrons, positive plate attracts them, grid controls the flow
            </li>
            <li>
              A small grid voltage change causes a large plate current change,
              this is amplification
            </li>
            <li>
              Tubes produce soft clipping with even harmonics, giving the warm
              &quot;tube tone&quot; prized by guitarists
            </li>
            <li>
              Common preamp tubes include the 12AX7 (high gain), 12AT7 (medium),
              and 12AU7 (low gain)
            </li>
            <li>
              The cathode bias resistor keeps the grid negative, ensuring proper
              operation without external bias supply
            </li>
          </ol>
        </section>
      </div>
    </div>
  );
}
