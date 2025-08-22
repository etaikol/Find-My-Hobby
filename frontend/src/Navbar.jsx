import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-gray-900 text-white px-6 py-4 shadow-lg flex justify-between items-center">
      {/* Left side brand/logo */}
      <div className="text-xl font-bold">
        <Link to="/">Find My Hobby</Link>
      </div>

      {/* Right side links */}
      <div className="space-x-6">
        <Link
          to="/"
          className="hover:text-blue-400 transition-colors duration-200"
        >
          Home
        </Link>
        <Link
          to="/register"
          className="hover:text-blue-400 transition-colors duration-200"
        >
          Register
        </Link>
        <Link
          to="/managedashboard"
          className="hover:text-blue-400 transition-colors duration-200"
        >
          Users Dashboard
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
