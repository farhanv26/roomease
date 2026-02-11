import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#2A2A2A] bg-black/95 backdrop-blur-sm transition-shadow duration-200">
      <nav className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-lg font-semibold text-white transition-opacity hover:opacity-90"
        >
          RoomEase
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/#features"
            className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
          >
            Learn More
          </Link>
          <Link
            href="/book"
            className="rounded-xl border border-[#FFD100] bg-[#FFD100] px-4 py-2.5 text-sm font-semibold text-black transition-all duration-150 hover:bg-[#e6bc00] hover:shadow-lg hover:shadow-[#FFD100]/20"
          >
            Start Booking
          </Link>
        </div>
      </nav>
    </header>
  );
}
