import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-bold text-blue-600">
          Su AI Hustle
        </h1>

        <nav className="flex items-center gap-8">
          <Link to="/">Home</Link>

          <Link to="/features">Features</Link>

          <Link to="/about">About</Link>

          <Link to="/contact">Contact</Link>

          <Link
            to="/blog"
            className="font-semibold text-blue-600"
          >
            Blog
          </Link>
        </nav>
      </div>
    </header>
  );
}