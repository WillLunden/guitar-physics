import Logo from "@/app/components/Logo";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 lg:py-16">
      <div className="flex items-center gap-4 mb-8">
        <Logo className="w-16 h-16" />
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-orange-500">
            About This Project
          </h1>
          <p className="text-zinc-800 dark:text-zinc-400">Physics of Shred</p>
        </div>
      </div>

      <div>
        <p className="text-lg text-zinc-900 dark:text-zinc-300">
          This site grew out of nearly a decade of guest lectures for MIT&apos;s
          Heavy Metal 101 course, exploring the science behind electric guitars
          through interactive simulations and visualizations.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4 text-zinc-900 dark:text-zinc-200">
          About Dr. Will Lunden
        </h2>
        <p className="text-zinc-900 dark:text-zinc-300">
          Will Lunden is a technical professional and lifelong musician based in
          Las Vegas, Nevada. He earned his PhD in atomic physics from MIT in
          2020, where he studied ultracold atomic gases of lithium and
          dysprosium. He has worked on a variety of projects in atomic
          timekeeping, software development, and financial technology. He
          currently works as the CTO of a fintech startup.
        </p>
        <p className="text-zinc-900 dark:text-zinc-300">
          On the music side, Will plays guitar in the technical/progressive
          death metal band{" "}
          <a
            href="https://thebeastofnod.bandcamp.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-600 dark:text-purple-400 hover:underline"
          >
            The Beast of Nod
          </a>
          , whose latest album featured guest appearances by Joe Satriani and
          Michael Angelo Batio. He&apos;s been playing guitar for over 25 years
          and has a particular love for 8-string guitars.
        </p>
        <p className="text-zinc-900 dark:text-zinc-300">
          Will has been a guest lecturer for MIT&apos;s Heavy Metal 101 course
          since 2017, originally presenting in person while finishing his PhD,
          and continuing to join remotely from the west coast in the years
          since. This website grew out of the materials he developed for those
          lectures, with the goal of making the content accessible to a wider
          audience.
        </p>
        <p className="text-sm text-zinc-700 dark:text-zinc-500">
          You can find more about Will at{" "}
          <a
            href="https://wlunden.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-600 dark:text-purple-400 hover:underline"
          >
            wlunden.com
          </a>
          .
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4 text-zinc-900 dark:text-zinc-200">
          What You&apos;ll Find Here
        </h2>
        <p className="text-zinc-900 dark:text-zinc-300">
          Interactive simulations and visualizations covering:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-zinc-900 dark:text-zinc-300">
          <li>
            <strong>Wave mechanics</strong> - The physics of vibrating strings,
            standing waves, and harmonics
          </li>
          <li>
            <strong>Electromagnetic transduction</strong> - How pickups convert
            mechanical vibration into electrical signals
          </li>
          <li>
            <strong>Fret placement</strong> - Equal temperament, multiscale
            designs, and intonation compensation
          </li>
          <li>
            <strong>Signal processing</strong> - Amplifier distortion,
            intermodulation, and tone shaping
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-4 text-zinc-900 dark:text-zinc-200">
          Contributing
        </h2>
        <p className="text-zinc-900 dark:text-zinc-300">
          This is an open educational resource. If you&apos;d like to contribute
          simulations, corrections, or improvements, check out the project on{" "}
          <a
            href="https://github.com/WillLunden/guitar-physics"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-600 dark:text-purple-400 hover:underline"
          >
            GitHub
          </a>
          .
        </p>
      </div>
    </div>
  );
}
