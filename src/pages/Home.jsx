import { Button, Link } from "../components/ui";

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
          <Button
            variant="primary"
            size="large"
            className="px-8 py-3 text-lg hover:underline-none"
            as={Link}
            to="/signup-choose-role"
          >
            Get Started
          </Button>
          <Button
            variant="outline"
            size="large"
            className="px-8 py-3 text-lg border-[#f44336] text-[#f44336] hover:bg-[#f44336] hover:text-white"
            as={Link}
            to="/login"
          >
            Login
          </Button>
        </div>
      </div>
    </div>
  );
}
