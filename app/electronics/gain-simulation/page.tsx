import GainSim from "@/app/components/GainSim";

export default function GainSimulationPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 lg:py-16">
      <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-orange-500 mb-4">
        Gain and Distortion
      </h1>
      <p className="text-zinc-800 dark:text-zinc-400 mb-8">
        How amplification creates new frequencies and shapes the sound of rock
      </p>

      {/* Interactive Simulation */}
      <GainSim className="mb-12" />

      {/* Physics explanation */}
      <div className="space-y-8">
        {/* Core Definitions */}
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-200 mb-4">
            Core Concepts
          </h2>

          <div className="space-y-6">
            <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl border border-purple-200 dark:border-purple-800">
              <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-400 mb-2">
                Gain
              </h3>
              <p className="text-zinc-900 dark:text-zinc-300">
                When a circuit makes a signal larger in amplitude. In most guitar
                circuits, this means higher voltage. A gain of 2x doubles the
                signal amplitude; a gain of 10x increases it tenfold.
              </p>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-xl border border-orange-200 dark:border-orange-800">
              <h3 className="text-lg font-semibold text-orange-700 dark:text-orange-400 mb-2">
                Distortion
              </h3>
              <p className="text-zinc-900 dark:text-zinc-300">
                When a waveform gains new frequency components after passing
                through a circuit. In other words, the waveform changes shape.
                Distortion often occurs when circuits are operated with high gain,
                pushing the signal beyond what the circuit can cleanly reproduce.
              </p>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl border border-red-200 dark:border-red-800">
              <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">
                Nonlinearity
              </h3>
              <p className="text-zinc-900 dark:text-zinc-300">
                A system is nonlinear when it behaves differently for a sum of
                waves than it does for each individual wave. If you put in wave A
                and get output X, and put in wave B and get output Y, a linear
                system would give you X+Y when you input A+B. A nonlinear system
                gives you something else entirely. Distortion is the audible
                result of nonlinearity.
              </p>
            </div>
          </div>
        </section>

        {/* Clipping */}
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-200 mb-4">
            Clipping: Where Distortion Happens
          </h2>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            Every amplifier has limits. When the input signal (multiplied by the
            gain) exceeds what the circuit can output, the signal is
            &quot;clipped&quot; at that maximum level.
          </p>

          <div className="grid md:grid-cols-2 gap-6 my-6">
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-300 mb-3">
                Hard Clipping
              </h3>
              <p className="text-zinc-800 dark:text-zinc-400 text-sm mb-3">
                The signal is abruptly cut off at the threshold. Common in
                transistor-based circuits and op-amp distortion pedals.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-zinc-800 dark:text-zinc-400 text-sm">
                <li>Creates a square-ish waveform</li>
                <li>Strong odd harmonics (3rd, 5th, 7th...)</li>
                <li>Aggressive, buzzy tone</li>
                <li>Classic &quot;fuzz&quot; sound</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-300 mb-3">
                Soft Clipping
              </h3>
              <p className="text-zinc-800 dark:text-zinc-400 text-sm mb-3">
                The signal is gradually compressed as it approaches the threshold.
                Characteristic of vacuum tube amplifiers.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-zinc-800 dark:text-zinc-400 text-sm">
                <li>Creates a rounded waveform</li>
                <li>Gentler harmonic rolloff</li>
                <li>Warmer, more musical tone</li>
                <li>Classic &quot;tube overdrive&quot; sound</li>
              </ul>
            </div>
          </div>

          <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg">
            <p className="text-sm text-zinc-800 dark:text-zinc-400">
              <strong>Dynamic range compression:</strong> Both clipping types
              reduce the dynamic range of the signal. Quiet and loud playing
              become more similar in volume. This is why distorted guitars have
              such consistent sustain.
            </p>
          </div>
        </section>

        {/* Symmetric vs Asymmetric */}
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-200 mb-4">
            Symmetric vs Asymmetric Clipping
          </h2>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed">
            The harmonic content of a clipped signal depends on whether the
            positive and negative halves of the waveform are clipped equally.
          </p>

          <div className="grid md:grid-cols-2 gap-6 my-6">
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-300 mb-3">
                Symmetric Clipping
              </h3>
              <p className="text-zinc-800 dark:text-zinc-400 text-sm mb-3">
                Both positive and negative peaks are clipped at the same threshold.
                The waveform retains its odd symmetry.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-zinc-800 dark:text-zinc-400 text-sm">
                <li>Produces only <strong>odd harmonics</strong> (3f, 5f, 7f...)</li>
                <li>Even harmonics (2f, 4f...) remain at zero</li>
                <li>Common in most distortion pedals</li>
                <li>Characteristic &quot;buzzsaw&quot; tone</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-300 mb-3">
                Asymmetric Clipping
              </h3>
              <p className="text-zinc-800 dark:text-zinc-400 text-sm mb-3">
                Positive and negative peaks clip at different thresholds. The
                waveform loses its odd symmetry.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-zinc-800 dark:text-zinc-400 text-sm">
                <li>Produces <strong>both odd and even harmonics</strong></li>
                <li>Even harmonics add &quot;warmth&quot; and octave content</li>
                <li>Common in tube amps (different behavior for each half-cycle)</li>
                <li>Often perceived as more &quot;musical&quot;</li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-orange-50 dark:from-purple-900/20 dark:to-orange-900/20 p-6 rounded-xl my-6 border border-purple-200 dark:border-purple-800">
            <p className="text-center text-zinc-900 dark:text-zinc-300 font-medium">
              A waveform with odd symmetry (f(-t) = -f(t)) contains only odd
              harmonics. Breaking this symmetry introduces even harmonics.
            </p>
          </div>

          <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg">
            <p className="text-sm text-zinc-800 dark:text-zinc-400">
              <strong>Try it:</strong> In the simulation above, toggle
              &quot;Asymmetric clipping&quot; and watch the even harmonics (2f, 4f)
              appear in green. Notice how the output waveform becomes lopsided.
            </p>
          </div>
        </section>

        {/* History */}
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-200 mb-4">
            A Brief History of Distortion
          </h2>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed mb-4">
            Early guitar amplifiers were designed to be linear, producing a
            &quot;clean&quot; sound that faithfully reproduced the guitar signal.
            Distortion was considered a flaw.
          </p>

          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="text-sm font-mono text-purple-600 dark:text-purple-400 w-16 flex-shrink-0">
                1940s
              </div>
              <p className="text-zinc-800 dark:text-zinc-400 text-sm">
                Blues players occasionally recorded with damaged amps and speakers,
                getting a distorted &quot;fuzzy&quot; guitar tone that added grit
                and emotion to their playing.
              </p>
            </div>

            <div className="flex gap-4 items-start">
              <div className="text-sm font-mono text-purple-600 dark:text-purple-400 w-16 flex-shrink-0">
                1950s
              </div>
              <p className="text-zinc-800 dark:text-zinc-400 text-sm">
                Rock and blues players found reliable ways to produce these tones
                through amp modifications and intentional overdriving. The sound
                became associated with rawness and power.
              </p>
            </div>

            <div className="flex gap-4 items-start">
              <div className="text-sm font-mono text-purple-600 dark:text-purple-400 w-16 flex-shrink-0">
                1960s
              </div>
              <p className="text-zinc-800 dark:text-zinc-400 text-sm">
                Distorted tones became more popular. Dedicated &quot;fuzz&quot;
                pedals started to appear. &quot;You Really Got Me&quot; by The
                Kinks famously used a slashed speaker cone for its iconic riff.
              </p>
            </div>

            <div className="flex gap-4 items-start">
              <div className="text-sm font-mono text-purple-600 dark:text-purple-400 w-16 flex-shrink-0">
                Today
              </div>
              <p className="text-zinc-800 dark:text-zinc-400 text-sm">
                Myriad forms of distortion-inducing equipment have been developed.
                Distortion is now the norm for metal, rock, and blues guitar.
              </p>
            </div>
          </div>
        </section>

        {/* What It Unlocks */}
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-200 mb-4">
            What Distortion Unlocks
          </h2>

          <p className="text-zinc-900 dark:text-zinc-300 leading-relaxed mb-4">
            Beyond its characteristic sound, distortion enables playing techniques
            that would not work on a clean amp:
          </p>

          <div className="grid md:grid-cols-2 gap-6 my-6">
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800">
              <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-400 mb-2">
                Pinch Harmonics
              </h3>
              <p className="text-zinc-800 dark:text-zinc-400 text-sm">
                The harmonic overtones produced by thumb contact are very quiet.
                The compression from distortion brings them up to the same level
                as the fundamental, making them scream.
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800">
              <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-400 mb-2">
                Palm Mutes
              </h3>
              <p className="text-zinc-800 dark:text-zinc-400 text-sm">
                The muted, percussive tone is very quiet. Compression brings it up
                to full volume while adding harmonic content that gives it chunk
                and definition.
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800">
              <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-400 mb-2">
                Sustain
              </h3>
              <p className="text-zinc-800 dark:text-zinc-400 text-sm">
                As a note decays, the compression keeps bringing it back up to
                full volume. Notes ring out much longer than they would on a
                clean amp, enabling singing lead lines.
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800">
              <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-400 mb-2">
                Feedback
              </h3>
              <p className="text-zinc-800 dark:text-zinc-400 text-sm">
                The added harmonics and sustain make it easier to induce
                controlled feedback, where the amplified sound causes the string
                to vibrate in a self-sustaining loop.
              </p>
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
              Gain amplifies signal amplitude; distortion adds new frequencies
            </li>
            <li>
              Distortion occurs when gain pushes the signal past what the circuit
              can cleanly reproduce (clipping)
            </li>
            <li>
              Hard clipping creates aggressive tones; soft clipping creates warmer
              tones
            </li>
            <li>
              Nonlinearity means the system treats combined signals differently
              than individual signals
            </li>
            <li>
              Compression from clipping enables techniques like pinch harmonics,
              palm mutes, and extended sustain
            </li>
          </ol>
        </section>
      </div>
    </div>
  );
}
