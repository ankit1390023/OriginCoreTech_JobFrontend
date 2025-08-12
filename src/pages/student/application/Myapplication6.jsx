import React, { useState } from 'react';
import MainLayout from '../../../components/layout/MainLayout';
//import FeedRightProfile from '../feed/FeedRightProfile'; 


// Dummy messages
const messages = [
  {
    id: 1,
    name: 'User 1',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    text: 'Lorem ipsum dolor sit amet, consec adipiscing elit.',
    time: '2m ago',
    unread: 2,
  },
  {
    id: 2,
    name: 'User 2',
    avatar: 'https://randomuser.me/api/portraits/men/65.jpg',
    text: 'Lorem ipsum dolor sit amet, cons adipiscing elit.',
    time: '5m ago',
    unread: 2,
  },
  {
    id: 3,
    name: 'User 3',
    avatar: 'https://randomuser.me/api/portraits/men/12.jpg',
    text: 'Lorem ipsum dolor sit amet, ctetur adipiscing elit.',
    time: '15m ago',
    unread: 1,
  },
  {
    id: 4,
    name: 'User 4',
    avatar: 'https://randomuser.me/api/portraits/men/33.jpg',
    text: 'Lorem ipsum dolor sit, consectetur adipiscing elit.',
    time: '20m ago',
    unread: 2,
  },
  {
    id: 5,
    name: 'User 5',
    avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
    text: 'Lorem ipsum dolo amet, consectetur adipiscing elit.',
    time: 'Yesterday',
    unread: 1,
  },
];

const Messages = () => {
  const [tab, setTab] = useState('All');

  return (

    <MainLayout>
    <div className="flex justify-center bg-gray-100 min-h-screen px-2 lg:px-8 items-start">
        <div className="hidden lg:block flex-grow"></div>
    

    <div
      className="bg-white rounded-lg shadow-md p-4"
      style={{ width: 375, height: 650,  }}
    >
      <h1 className="text-2xl font-bold mb-4">Messages</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {['All', 'Unread', 'Favourites'].map((label) => (
          <button
            key={label}
            onClick={() => setTab(label)}
            className={`px-3 py-1 text-sm rounded-full ${
              tab === label
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Message List */}
      <div className="space-y-4 overflow-y-auto h-[400px] pr-1">
        {messages.map((msg) => (
          <div key={msg.id} className="flex justify-between items-center">
            <div className="flex gap-3">
              <div className="relative">
                <img
                  src={msg.avatar}
                  alt={msg.name}
                  className="w-12 h-12 rounded-full border-2 border-orange-500"
                />
              </div>
              <div>
                <p className="text-sm text-black leading-snug">
                  {msg.text}
                </p>
                <p className="text-xs text-gray-500 mt-1">{msg.time}</p>
              </div>
            </div>
            <span className="bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
              {msg.unread}
            </span>
          </div>
        ))}
      </div>
    </div>

    
            
                </div>
            </MainLayout>

  );
};

export default Messages;
