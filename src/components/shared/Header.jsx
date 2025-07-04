import { NavLink } from "react-router-dom";
import { FaSearch, FaBell, FaUser } from "react-icons/fa";
import { FiMessageCircle } from "react-icons/fi";

export default function Header() {
    return (
        <div className="relative flex items-center justify-between px-6 py-2 w-full h-16" style={{ background: 'linear-gradient(90deg, #f5f6f7 60%, #ffe9b3 100%)' }}>
            {/* Logo */}
            <div className="flex items-center">
                <p className="text-2xl font-bold">Your Logo</p>
            </div>
            {/* Nav Tabs - absolutely centered */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex bg-white rounded-full shadow-sm px-1 py-1 gap-1 z-10">
                <NavLink
                    to="/Feed"
                    className={({ isActive }) =>
                        isActive
                            ? "bg-[#00194A] text-white rounded-full px-6 py-2 font-medium shadow"
                            : "text-[#00194A] px-6 py-2 rounded-full font-medium hover:bg-gray-100"
                    }
                >Feed</NavLink>
                <NavLink
                    to="/all-jobs"
                    className={({ isActive }) =>
                        isActive
                            ? "bg-[#00194A] text-white rounded-full px-6 py-2 font-medium shadow"
                            : "text-[#00194A] px-6 py-2 rounded-full font-medium hover:bg-gray-100"
                    }
                >Jobs</NavLink>
                <NavLink
                    to="/ai-prediction"
                    className={({ isActive }) =>
                        isActive
                            ? "bg-[#00194A] text-white rounded-full px-6 py-2 font-medium shadow"
                            : "text-[#00194A] px-6 py-2 rounded-full font-medium hover:bg-gray-100"
                    }
                >AI Prediction</NavLink>
            </div>
            {/* Search Bar and Right Icons */}
            <div className="flex items-center gap-4">
                {/* Search Bar */}
                <div className=" bg-white flex items-center rounded-full px-4 py-2 w-[340px] max-w-xs shadow-inner">
                    <input
                        type="text"
                        placeholder="Search"
                        className="bg-transparent outline-none flex-1 text-[#00194A] placeholder-[#00194A] text-base"
                    />
                    <FaSearch className="text-[#00194A] text-lg" />
                </div>
                {/* Right Icons */}
                <div className="flex items-center gap-4">
                    <div className="bg-white cursor-pointer rounded-full w-10 h-10 flex items-center justify-center shadow">
                        <FiMessageCircle className="text-[#00194A] text-xl" />
                    </div>
                    <div className="bg-white cursor-pointer rounded-full w-10 h-10 flex items-center justify-center shadow">
                        <FaBell className="text-[#00194A] text-xl" />
                    </div>
                    <div className="bg-white cursor-pointer rounded-full w-10 h-10 flex items-center justify-center shadow">
                        <FaUser className="text-[#00194A] text-xl" />
                    </div>
                </div>
            </div>
        </div>
    );
}