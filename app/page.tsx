import Logo from "@/app/components/Logo";
import SignalChainAnimation from "@/app/components/SignalChainAnimation";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-orange-500/10 dark:from-purple-600/20 dark:to-orange-500/20" />

        <div className="relative max-w-5xl mx-auto px-6 pt-24 pb-16 lg:pt-16">
          {/* Logo and Title */}
          <div className="flex flex-col items-center text-center mb-12">
            <Logo className="w-24 h-24 mb-6" />
            <p className="text-xl text-zinc-800 dark:text-zinc-400 mb-2">
              Dr. Lunden&apos;s
            </p>
            <h1 className="text-5xl md:text-7xl font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-orange-500">
                Physics of Shred
              </span>
            </h1>
            <p className="text-lg text-zinc-800 dark:text-zinc-400 max-w-2xl">
              A repository of interactive simulations and lessons exploring the
              physics of electric guitars. Built for MIT&apos;s Heavy Metal 101
              course. Maintained by Dr. Will Lunden and contributors.
            </p>
          </div>

          {/* Latest Update */}
          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg px-4 py-3 mb-8 text-center">
            <p className="text-sm text-purple-700 dark:text-purple-300">
              <span className="font-semibold">Updated</span> February 4, 2026
             
            </p>
            <p className="text-sm text-purple-700 dark:text-purple-300">
              Official launch of the Physics of Shred website!
            </p>
          </div>

          {/* Signal Chain Animation */}
          <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-6 shadow-lg border border-zinc-200 dark:border-zinc-800 mb-12">
            <SignalChainAnimation className="h-52" />
            <p className="text-center text-sm text-zinc-700 dark:text-zinc-500 mt-4">
              The journey of a guitar signal from string vibration to amplified
              sound.
            </p>
          </div>

          {/* Introduction */}
          <div>
            <p className="text-lg text-zinc-900 dark:text-zinc-300 leading-relaxed">
              Welcome to an interactive exploration of the physics behind
              electric guitars. Based on a decade of guest lectures for
              MIT&apos;s Heavy Metal 101 course by Dr. Will Lunden, this site
              features simulations and visualizations covering wave mechanics,
              electromagnetic pickup behavior, tuning systems, and electronic
              signal processing.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800">
                <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-400 mb-2">
                  Vibrations & Waves
                </h3>
                <p className="text-zinc-800 dark:text-zinc-400 text-sm">
                  Explore the 1D wave equation, harmonics, and Fourier analysis
                  of vibrating guitar strings. Understand how picking deforms
                  the string and initiates wave propagation.
                </p>
              </div>

              <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800">
                <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-400 mb-2">
                  Transduction
                </h3>
                <p className="text-zinc-800 dark:text-zinc-400 text-sm">
                  Understand how pickups convert string vibration to electrical
                  signals, and how placement affects tone.
                </p>
              </div>

              <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800">
                <h3 className="text-lg font-semibold text-orange-500 dark:text-orange-400 mb-2">
                  Fret Placement
                </h3>
                <p className="text-zinc-800 dark:text-zinc-400 text-sm">
                  Compare equal temperament, multiscale designs, and True
                  Temperament fret systems.
                </p>
              </div>

              <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800">
                <h3 className="text-lg font-semibold text-orange-500 dark:text-orange-400 mb-2">
                  Electronics
                </h3>
                <p className="text-zinc-800 dark:text-zinc-400 text-sm">
                  Simulate amplifier gain stages and visualize intermodulation
                  distortion in real-time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-8 px-6">
        <div className="max-w-4xl mx-auto text-center text-sm text-zinc-700 dark:text-zinc-500">
          <p>
            &copy; {new Date().getFullYear()} Dr. Will Lunden. To contribute,
            see the{" "}
            <a
              href="https://github.com/WillLunden/guitar-physics"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 dark:text-purple-400 hover:underline"
            >
              GitHub repository
            </a>
            .
          </p>
        </div>
      </footer>
    </div>
  );
}
