"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
      className={`text-sm font-medium transition-colors duration-200 ${
        active
          ? "text-white"
          : "text-[rgba(255,255,255,0.65)] hover:text-white"
      }`}
    >
      {children}
      {active && (
        <span className="block h-[1px] w-full bg-white mt-1" />
      )}
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";
  const isRooms = pathname === "/rooms";
  const isBook = pathname === "/book";
  const isBookings = pathname === "/bookings";
  const isCompare = pathname === "/compare";
  const isAnalytics = pathname === "/analytics";
  const isAbout = pathname === "/learn-more/about";
  const [scrolled, setScrolled] = useState(false);

  const handleLearnMoreClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (isHome) {
      const element = document.getElementById("learn-more");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      router.push("/?scrollTo=learn-more");
    }
  };

  const handleAboutClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (isHome) {
      const element = document.getElementById("about");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      router.push("/?scrollTo=about");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled 
          ? "bg-[rgba(17,17,19,0.85)] backdrop-blur-xl border-[rgba(255,255,255,0.08)]" 
          : "bg-[rgba(17,17,19,0.60)] backdrop-blur-md border-[rgba(255,255,255,0.06)]"
      }`}
    >
      <nav className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-6 sm:px-8 lg:px-10">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold tracking-tight transition-opacity hover:opacity-80"
        >
          <span className="text-white">RoomEase</span>
          <span className="h-1.5 w-1.5 rounded-full bg-[#FFD54A]" />
        </Link>
        <div className="flex items-center gap-8">
          <NavLink href="/rooms" active={isRooms}>
            Rooms
          </NavLink>
          <NavLink href="/bookings" active={isBookings}>
            My Bookings
          </NavLink>
          <NavLink href="/compare" active={isCompare}>
            Compare
          </NavLink>
          <NavLink href="/analytics" active={isAnalytics}>
            Analytics
          </NavLink>
          <a
            href="#learn-more"
            onClick={handleLearnMoreClick}
            className="text-sm font-medium transition-colors duration-200 text-[rgba(255,255,255,0.65)] hover:text-white"
          >
            Learn More
          </a>
          <a
            href="#about"
            onClick={handleAboutClick}
            className={`text-sm font-medium transition-colors duration-200 ${
              isAbout
                ? "text-white"
                : "text-[rgba(255,255,255,0.65)] hover:text-white"
            }`}
          >
            About Us
            {isAbout && (
              <span className="block h-[1px] w-full bg-white mt-1" />
            )}
          </a>
          <Link
            href="/book"
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 ${
              isBook
                ? "bg-[#FFD54A] text-black shadow-lg shadow-[#FFD54A]/20"
                : "bg-[#FFD54A] text-black hover:bg-[#F6C445] hover:shadow-lg hover:shadow-[#FFD54A]/25"
            }`}
          >
            Start Booking
          </Link>
        </div>
      </nav>
    </header>
  );
}
