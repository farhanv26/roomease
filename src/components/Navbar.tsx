"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function NavLink({
  href,
  children,
  active,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`text-sm font-medium transition-colors ${
        active
          ? "text-[#FFD100] underline decoration-[#FFD100] decoration-2 underline-offset-4"
          : "text-gray-400 hover:text-white"
      }`}
    >
      {children}
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isRooms = pathname === "/rooms";
  const isBook = pathname === "/book";

  return (
    <header className="sticky top-0 z-50 border-b border-[#2A2A2A] bg-black/95 backdrop-blur-sm transition-shadow duration-200">
      <nav className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className={`text-lg font-semibold transition-opacity hover:opacity-90 ${
            isHome ? "text-[#FFD100]" : "text-white"
          }`}
        >
          RoomEase
        </Link>
        <div className="flex items-center gap-6">
          <NavLink href="/rooms" active={isRooms}>
            Rooms
          </NavLink>
          <NavLink href="/#features" active={false}>
            Learn More
          </NavLink>
          <Link
            href="/book"
            className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all duration-150 ${
              isBook
                ? "border-[#FFD100] bg-[#FFD100] text-black shadow-lg shadow-[#FFD100]/20"
                : "border-[#FFD100] bg-[#FFD100] text-black hover:bg-[#e6bc00] hover:shadow-lg hover:shadow-[#FFD100]/20"
            }`}
          >
            Start Booking
          </Link>
        </div>
      </nav>
    </header>
  );
}
