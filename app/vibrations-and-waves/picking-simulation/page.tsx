import PickingEconomySim from "@/app/components/PickingEconomySim";

export default function PickingSimulationPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 lg:py-16">
      <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-orange-500 mb-4">
        Economy of Motion
      </h1>
      <p className="text-zinc-800 dark:text-zinc-400 mb-8">
        Why efficient picking technique matters - the physics of speed
      </p>

      {/* Interactive Simulation */}
      <PickingEconomySim className="mb-12" />

      {/* Physics explanation */}
      <div className="space-y-8">
        {/* The Model */}
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-200 mb-4">
            The Physics Model
          </h2>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            We can model a picking hand as a simple mechanical system:{" "}
            <strong>a mass on a stick</strong> (a pendulum). The pick must cross
            the string position a certain number of times per second to maintain
            the tempo.
          </p>

          <div className="bg-gradient-to-r from-purple-50 to-orange-50 dark:from-purple-900/20 dark:to-orange-900/20 p-6 rounded-xl my-6 border border-purple-200 dark:border-purple-800">
            <p className="text-center text-zinc-900 dark:text-zinc-300 font-medium">
              The farther the pick moves from the string, the more energy
              required to bring it back &quot;in time&quot;
            </p>
          </div>
        </section>

        {/* The Math */}
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-200 mb-4">
            The Energy Cost of Wide Motion
          </h2>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            If the pick must return to the string at a fixed rate (the tempo),
            then traveling a greater distance requires greater velocity:
          </p>

          <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg my-4 font-mono text-center">
            velocity = distance / time
          </div>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            If you double the distance but keep the same time, you must double
            the velocity. Here&apos;s where the physics gets interesting:
          </p>

          <div className="bg-gradient-to-r from-purple-50 to-orange-50 dark:from-purple-900/20 dark:to-orange-900/20 p-6 rounded-xl my-6 border border-purple-200 dark:border-purple-800">
            <div className="text-center font-mono text-xl text-zinc-900 dark:text-zinc-200">
              Kinetic Energy = ½mv²
            </div>
          </div>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            Kinetic energy scales with the{" "}
            <strong>square of the velocity</strong>. This means:
          </p>

          <ul className="list-disc pl-6 space-y-2 text-zinc-900 dark:text-zinc-300">
            <li>
              Double the pick motion → Double the velocity → <strong>4×</strong>{" "}
              the energy
            </li>
            <li>
              Triple the pick motion → Triple the velocity → <strong>9×</strong>{" "}
              the energy
            </li>
          </ul>

          <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg mt-4">
            <p className="text-sm text-zinc-800 dark:text-zinc-400">
              <strong>Key insight:</strong> In the small angle approximation
              (typical picking motion), the energy cost scales with the{" "}
              <em>square</em> of the distance from the string. A pick that
              travels 3× farther uses 9× more energy per stroke.
            </p>
          </div>
        </section>

        {/* Implications */}
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-200 mb-4">
            Why This Matters for Playing Fast
          </h2>

          <div className="grid md:grid-cols-2 gap-6 my-6">
            <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border border-red-200 dark:border-red-800">
              <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">
                Wide Motion (Inefficient)
              </h3>
              <ul className="text-sm text-zinc-800 dark:text-zinc-400 space-y-1">
                <li>• Higher energy cost per stroke</li>
                <li>• Muscles fatigue faster</li>
                <li>• Speed ceiling limited by endurance</li>
                <li>• More tension in hand/forearm</li>
              </ul>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
              <h3 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-2">
                Economy of Motion (Efficient)
              </h3>
              <ul className="text-sm text-zinc-800 dark:text-zinc-400 space-y-1">
                <li>• Lower energy cost per stroke</li>
                <li>• Can sustain speed longer</li>
                <li>• Higher speed ceiling</li>
                <li>• Relaxed, controlled technique</li>
              </ul>
            </div>
          </div>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            This is why every guitar teacher emphasizes minimizing pick motion.
            It&apos;s not just about looking clean. It&apos;s{" "}
            <strong>physics</strong>. The energy savings compound with every
            note, especially at high tempos.
          </p>
        </section>

        {/* The Tempo Factor */}
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-200 mb-4">
            The Tempo Multiplier
          </h2>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            The energy cost gets worse at higher tempos. If you increase the
            tempo, you decrease the time available for each stroke, so velocity
            must increase proportionally:
          </p>

          <div className="bg-gradient-to-r from-purple-50 to-orange-50 dark:from-purple-900/20 dark:to-orange-900/20 p-6 rounded-xl my-6 border border-purple-200 dark:border-purple-800">
            <div className="text-center font-mono text-lg text-zinc-900 dark:text-zinc-200">
              Energy ∝ (amplitude)² × (tempo)²
            </div>
          </div>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            This means the energy penalty for wide motion{" "}
            <strong>compounds</strong> with tempo. At 200 BPM, the difference
            between efficient and inefficient technique is far more pronounced
            than at 100 BPM.
          </p>

          <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg mt-4">
            <p className="text-sm text-zinc-800 dark:text-zinc-400">
              <strong>Try it:</strong> In the simulation above, increase the
              tempo to 240+ BPM and watch the energy difference grow. Then try
              reducing the &quot;Wide Motion&quot; amplitude. Notice how much
              energy you save.
            </p>
          </div>
        </section>

        {/* Practical Tips */}
        <section className="bg-gradient-to-br from-purple-100 to-orange-100 dark:from-purple-900/30 dark:to-orange-900/30 p-6 rounded-xl border border-purple-200 dark:border-purple-800">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-200 mb-4">
            Practical Takeaways
          </h2>
          <ol className="list-decimal pl-6 space-y-2 text-zinc-900 dark:text-zinc-300">
            <li>
              <strong>Minimize pick travel distance.</strong> The pick only
              needs to clear the string. Any extra motion is wasted energy.
            </li>
            <li>
              <strong>Stay relaxed.</strong> Tension leads to exaggerated
              motion. A relaxed hand naturally moves more efficiently.
            </li>
            <li>
              <strong>Practice slow, then speed up.</strong> Build efficient
              motion patterns at slow tempos where you can monitor your
              technique.
            </li>
            <li>
              <strong>The physics compounds.</strong> Small improvements in
              economy of motion yield large energy savings at high speeds.
            </li>
          </ol>
        </section>
      </div>
    </div>
  );
}
