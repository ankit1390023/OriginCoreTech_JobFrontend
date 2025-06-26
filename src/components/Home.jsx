import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800">
          Welcome to Job Portal
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl">
          Find your dream job or recruit talented candidates. Join our platform
          today!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link
            to="/signup-choose-role"
            className="bg-[#f44336] text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-[#d32f2f] transition"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="bg-white text-[#f44336] border-2 border-[#f44336] px-8 py-3 rounded-lg font-semibold text-lg hover:bg-[#f44336] hover:text-white transition"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
