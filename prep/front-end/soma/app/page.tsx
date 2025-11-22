import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-white p-4 flex justify-between items-center sticky top-0 bg-black z-10">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white" />
          <span className="font-bold text-xl tracking-tighter">soma.wiki</span>
        </div>
        <nav className="flex gap-6 text-sm uppercase tracking-widest">
          <Link href="/browse" className="hover:underline">
            Index
          </Link>
          <Link href="/submit" className="hover:underline">
            Submit
          </Link>
          <Link href="/about" className="hover:underline">
            About
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col">
        {/* Hero / Manifesto */}
        <section className="border-b border-white p-8 md:p-24 flex flex-col gap-8">
          <h1 className="text-4xl md:text-7xl font-bold uppercase leading-none tracking-tighter max-w-5xl">
            Decentralized
            <br />
            Music
            <br />
            Catalog
          </h1>
          <p className="max-w-2xl text-lg md:text-xl leading-relaxed text-gray-400">
            SOMA is a permanent archive for audio artifacts. Published on-chain using ENS, IPFS, Zora, and Safe
            multisig. Resistant to censorship. Owned by creators.
          </p>

          <div className="flex flex-wrap gap-4 mt-8">
            <Link
              href="/browse"
              className="px-6 py-3 border border-white bg-white text-black font-bold uppercase hover:bg-transparent hover:text-white transition-colors"
            >
              Browse Catalog
            </Link>
            <Link
              href="/submit"
              className="px-6 py-3 border border-white text-white font-bold uppercase hover:bg-white hover:text-black transition-colors"
            >
              Submit Release
            </Link>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 border-b border-white">
          <div className="p-8 border-b md:border-b-0 md:border-r border-white">
            <div className="text-sm text-gray-500 uppercase mb-2">Total Releases</div>
            <div className="text-4xl font-bold">011</div>
          </div>
          <div className="p-8 border-b md:border-b-0 md:border-r border-white">
            <div className="text-sm text-gray-500 uppercase mb-2">Storage</div>
            <div className="text-4xl font-bold">IPFS</div>
          </div>
          <div className="p-8">
            <div className="text-sm text-gray-500 uppercase mb-2">Network</div>
            <div className="text-4xl font-bold">BASE</div>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="flex-1 p-4 md:p-8">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-xl font-bold uppercase">Recent Activity</h2>
            <Link href="/browse" className="text-sm underline">
              View All
            </Link>
          </div>

          <div className="border border-white">
            <div className="grid grid-cols-12 border-b border-white bg-white text-black text-xs uppercase font-bold p-2">
              <div className="col-span-2">ID</div>
              <div className="col-span-6">Release</div>
              <div className="col-span-4 text-right">Time</div>
            </div>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="grid grid-cols-12 border-b border-gray-800 p-3 hover:bg-gray-900 transition-colors last:border-0"
              >
                <div className="col-span-2 font-mono text-gray-500">TX-00{i}</div>
                <div className="col-span-6">
                  New release submitted by <span className="text-white font-bold">m580</span>
                </div>
                <div className="col-span-4 text-right text-gray-500">2h ago</div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
