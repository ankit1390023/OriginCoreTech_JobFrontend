import React, { useState } from "react";
import { Button, Input } from "../../../components/ui";
import MainLayout from "../../../components/layout/MainLayout";
import FeedRightSide3 from "../feed/FeedRightSide3";

const Myapplication2 = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Aditi Shukla",
      role: "Graphic Designer",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      isFollowing: true,
      type: "Individual",
    },
    {
      id: 2,
      name: "Kevin",
      role: "Content Creator",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      isFollowing: true,
      type: "Individual",
    },
    {
      id: 3,
      name: "Rohini Garg",
      role: "Marketing@Amex",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      isFollowing: false,
      type: "Company",
    },
    {
      id: 4,
      name: "Rahul",
      role: "Sales and key accounts",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      isFollowing: true,
      type: "Individual",
    },
    {
      id: 5,
      name: "Lily James",
      role: "Product Manager",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      isFollowing: true,
      type: "Individual",
    },
    {
      id: 6,
      name: "Aditi Shukla",
      role: "Graphic Designer",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
      isFollowing: true,
      type: "Individual",
    },
    {
      id: 7,
      name: "Kevin",
      role: "Content Creator",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      isFollowing: true,
      type: "Individual",
    },
    {
      id: 8,
      name: "Vipina Jain",
      role: "Marketing@Amex",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      isFollowing: false,
      type: "Company",
    },
  ]);

  const handleFollowToggle = (user_id) => {
    setUsers(
      users.map((user) =>
        user.id === user_id ? { ...user, isFollowing: !user.isFollowing } : user
      )
    );
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "All" || user.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const filters = ["All", "Company", "University"];

  return (
    <MainLayout>
      <div className="flex justify-center bg-gray-100 min-h-screen px-2 lg:px-8 items-start">
        <div className="hidden lg:block flex-grow"></div>

        <div className="min-h-screen mt-2 bg-white p-6 w-full max-w-3xl">
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-6">
                Following
              </h1>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex space-x-2">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
                    activeFilter === filter
                      ? "bg-gray-200 border-gray-400 text-gray-900 font-medium"
                      : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Users List */}
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/150/cccccc/666666?text=" +
                            user.name.charAt(0);
                        }}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {user.name}
                      </h3>
                      <p className="text-gray-600 text-sm">{user.role}</p>
                    </div>
                  </div>
                  <Button
                    variant={user.isFollowing ? "outline" : "primary"}
                    size="small"
                    onClick={() => handleFollowToggle(user.id)}
                    className={`${
                      user.isFollowing
                        ? "bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    } px-4 py-2 rounded-lg font-medium`}
                  >
                    {user.isFollowing ? "Following" : "Follow"}
                  </Button>
                </div>
              ))}
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  No users found matching your search criteria.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Profile Card */}
        <aside className="hidden lg:block w-full max-w-[350px] p-2 sticky top-4 h-fit">
          <FeedRightSide3 />
        </aside>
        {/* Right Spacer */}
        <div className="hidden lg:block flex-grow"></div>
      </div>
    </MainLayout>
  );
};

export default Myapplication2;
