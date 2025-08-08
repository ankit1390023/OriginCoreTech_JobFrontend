import React, { useState } from 'react';
import MainLayout from '../../../components/layout/MainLayout';
import FeedRightProfile from '../feed/FeedRightProfile'; 

// Dummy data
const users = [
  { name: "Aditi Shukla", role: "Graphic Designer", isFollowing: true, img: "https://randomuser.me/api/portraits/women/44.jpg" },
  { name: "Kevin", role: "Content Creator", isFollowing: true, img: "https://randomuser.me/api/portraits/men/34.jpg" },
  { name: "Rohini Garg", role: "Marketing@Amex", isFollowing: false, img: "https://randomuser.me/api/portraits/women/47.jpg" },
  { name: "Rahul", role: "Sales and key accounts", isFollowing: true, img: "https://randomuser.me/api/portraits/men/41.jpg" },
  { name: "Lily James", role: "Product Manager", isFollowing: true, img: "https://randomuser.me/api/portraits/women/50.jpg" },
  { name: "Aditi Shukla", role: "Graphic Designer", isFollowing: true, img: "https://randomuser.me/api/portraits/women/44.jpg" },
  { name: "Kevin", role: "Content Creator", isFollowing: true, img: "https://randomuser.me/api/portraits/men/34.jpg" },
  { name: "Vipina Jain", role: "Marketing@Amex", isFollowing: false, img: "https://randomuser.me/api/portraits/women/45.jpg" },
];

const Following = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const filteredUsers = users.filter(user => {
    return user.name.toLowerCase().includes(search.toLowerCase());
  });

  return (

    <MainLayout>
    <div className="flex justify-center bg-gray-100 min-h-screen px-2 lg:px-8 items-start">
        <div className="hidden lg:block flex-grow"></div>
    

    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Following</h1>

      {/* Search Bar */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-4 py-2 pl-10 rounded-full shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <span className="absolute left-3 top-2.5 text-gray-400">
          🔍
        </span>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-6">
        {["All", "Company", "University"].map(type => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-3 py-1 text-sm rounded-full border ${filter === type ? 'bg-black text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* User List */}
      <div className="space-y-4">
        {filteredUsers.map((user, index) => (
          <div
            key={index}
            className="flex justify-between items-center px-2 py-2 hover:bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <img src={user.img} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
              <div>
                <p className="font-medium text-gray-800">{user.name}</p>
                <p className="text-sm text-gray-500">{user.role}</p>
              </div>
            </div>
            <button
              className={`border px-4 py-1 rounded-full text-sm font-medium transition ${
                user.isFollowing
                  ? 'text-blue-600 border-blue-400 bg-blue-50'
                  : 'text-blue-600 border-blue-400 hover:bg-blue-50'
              }`}
            >
              {user.isFollowing ? 'Following' : 'Follow'}
            </button>
          </div>
        ))}
      </div>
    </div>
    
                    {/* Profile Card */}
                    <aside className="hidden lg:block w-full max-w-[350px] p-2 sticky top-4 h-fit">
                        <FeedRightProfile />
                    </aside>
                    {/* Right Spacer */}
                    <div className="hidden lg:block flex-grow"></div>
                </div>
            </MainLayout>

  );
};

export default Following;
