import React, { useRef, useState } from 'react';
import { Button, Input } from '../../../components/ui';
import MainLayout from '../../../components/layout/MainLayout';
import FeedRightProfile from './FeedRightProfile';
const messages = [
  {
    id: 1,
    sender: 'support',
    name: 'Support',
    avatar: '/src/assets/dummyProfile1.jpg',
    text: 'Hi Aman, Let me know if you need help and you can ask us any questions.',
    time: '08:20 AM',
  },
  {
    id: 2,
    sender: 'user',
    name: 'Aman',
    avatar: '/src/assets/dummyProfile2.jpg',
    text: 'How to check approvals from my university?',
    time: '08:21 AM',
  },
  {
    id: 3,
    sender: 'support',
    name: 'Support',
    avatar: '/src/assets/dummyProfile3.jpg',
    text: 'Open Education tab from My Profile and you can check your pending approvals there. Hope this helped!',
    time: '08:22 AM',
  },
];

export default function FeedHelp() {
  const [comment, setComment] = useState('');
  const [chat, setChat] = useState(messages);
  const inputRef = useRef(null);

  const handleSend = () => {
    if (comment.trim() === '') return;
    setChat([
      ...chat,
      {
        id: chat.length + 1,
        sender: 'user',
        name: 'Aman',
        avatar: '/src/assets/dummyProfile2.jpg',
        text: comment,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setComment('');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  return (
    <MainLayout>
    <div className="flex justify-center bg-gray-100 min-h-screen px-2 lg:px-8">
        {/* Left Spacer */}
        <div className="hidden lg:block flex-grow"></div>
        {/* Main Content Section */}
        <section 
                    className="bg-white rounded-[10px] p-5 shadow-lg mt-2 w-[800px] h-[1000px] opacity-100 gap-[10px]"
                >{/* Header */}
      <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-2 border-b border-gray-200">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1">How can we help you?</h1>
        <p className="text-gray-500 text-xs sm:text-sm mb-2">Write and address new queries and issues</p>
      </div>
      
      {/* Chat area */}
      <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6 ">
        {chat.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender !== 'user' && (
              <img
                src={msg.avatar}
                alt={msg.name}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full mr-2 sm:mr-3 border border-gray-200 object-cover"
              />
            )}
            <div className={`max-w-[85vw] sm:max-w-[70%] flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div
                className={`rounded-2xl px-3 py-2 sm:px-5 sm:py-3 text-sm sm:text-base shadow-sm break-words ${
                  msg.sender === 'user'
                    ? 'bg-[#f44336] text-white rounded-br-md'
                    : 'bg-[#0a2a5c] text-white rounded-bl-md'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[10px] sm:text-xs text-gray-400 mt-1">{msg.time}</span>
            </div>
            {msg.sender === 'user' && (
              <img
                src={msg.avatar}
                alt={msg.name}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full ml-2 sm:ml-3 border border-gray-200 object-cover"
              />
            )}
          </div>
        ))}
      </div>
      {/* Input area */}
      <div className="border-t border-gray-200 bg-[#00245a] px-2 sm:px-4 py-2 sm:py-3 flex items-center gap-2">
        <div className="flex-1">
          <input
            ref={inputRef}
            type="text"
            placeholder="Write a comment"
            className="w-full rounded-full px-3 sm:px-4 py-2 bg-[#233a5f] text-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#f44336] border-none text-sm sm:text-base"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
          />
        </div>
        <Button
          variant="primary"
          size="default"
          className="rounded-full px-3 sm:px-4 py-2 min-w-[40px] min-h-[40px] flex items-center justify-center"
          onClick={handleSend}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
    </section>
    {/* Profile Card */}
    <aside className="hidden lg:block w-full max-w-[350px] p-2 sticky top-4 h-fit">
      <FeedRightProfile />
    </aside>
    {/* Right Spacer */}
    <div className="hidden lg:block flex-grow"></div>
    </div>
</MainLayout>
  );
}
