import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Explore Map", href: "/explore" },
  { label: "Campus Catalogue", href: "/universities" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#07368F]">
      <div className="mx-auto flex min-h-[72px] max-w-[1440px] items-center justify-between px-6 py-3 md:px-10">

        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image
            src="/edufind-logo.png"
            alt="EduFind Logo"
            width={150}
            height={48}
            priority
            className="h-auto w-[130px] object-contain"
          />
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="whitespace-nowrap text-[16px] font-semibold text-white transition-colors duration-200 hover:text-[#D7AD68]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Navigation Placeholder */}
        <button
          type="button"
          aria-label="Open navigation menu"
          className="flex h-10 w-10 items-center justify-center rounded-md border border-white/30 text-white lg:hidden"
        >
          <span className="text-2xl leading-none">☰</span>
        </button>
      </div>
    </header>
  );
}
