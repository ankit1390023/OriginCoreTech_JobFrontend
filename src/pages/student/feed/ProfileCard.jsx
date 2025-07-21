import React from 'react';
import cover from '../../../assets/cover.png';
import dummyProfile3 from '../../../assets/dummyProfile3.jpg';
import dummyProfile1 from '../../../assets/dummyProfile1.jpg';
import dummyProfile2 from '../../../assets/dummyProfile2.jpg';
import {FaCamera  } from 'react-icons/fa6';
const visitors = [
  { name: 'Olivia Rhye', img: dummyProfile1 },
  { name: 'Phoenix Baker', img: dummyProfile2 },
  { name: 'Lana Steiner', img: dummyProfile3 },
  { name: 'Milo Thorne', img: dummyProfile1 },
  { name: 'Olivia Rhye', img: dummyProfile1 },
  { name: 'Lana Steiner', img: dummyProfile3 },
  { name: 'Milo Thorne', img: dummyProfile1 },
  { name: 'Phoenix Baker', img: dummyProfile2 },
];

const ProfileCard = () => {
  return (
    <div
      className="absolute bg-white shadow-md border border-gray-200 flex flex-col items-center"
      style={{
        width: 375,
        height: 786.42,
        top: 99,
        left: 906,
        borderRadius: 10,
        padding: '20px 10px',
        gap: 30,
      }}
    >
      {/* Section 1: Cover + Profile */}
      <div
        className="relative flex flex-col"
        style={{
          width: 355,
          height: 73,
          borderWidth: 1,
        }}
      >
        {/* Cover Banner */}
      <div
  style={{
    width: 355,
    height: 73,
    backgroundImage: `url(${cover})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    transform: 'rotate(0deg)',
    opacity: 1,
  }}
></div>
        {/* Camera Icon */}
      <div
  className="absolute bg-[#3D5CFF] border border-[#3D5CFF] rounded-full shadow-md flex items-center justify-center"
  style={{
    width: '21.71px',
    height: '20px',
    top: '9px',
    left: '322.43px',
    opacity: 1,
  }}
>
  <span className="text-white text-base font-bold leading-none"><FaCamera className='w-3 h-3' /></span>
</div>

        {/* Profile Picture */}
        <div
          className="absolute"
          style={{
            left: 4,
            top: 23,
            width: 94.45,
            height: 87,
            opacity: 1,
          }}
        >
          <img
            src={dummyProfile3}
            alt="Profile"
            style={{
              width: '94.45px',
              height: '87px',
              borderRadius: '50%',
              border: '4px solid white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              objectFit: 'cover',
            }}
          />
        </div>
      </div>

      {/* Profile Info */}
      <div className="pt-15 px-4 w-full">
        <h2 className="text-lg font-bold text-gray-800">Aman Gupta</h2>
        <p className="text-sm text-gray-500">@amangupta09</p>
        <p className="text-sm text-gray-700 font-semibold mt-1">Visual Designer</p>
        <p className="text-sm text-gray-600 mt-2">
          Hi, I am Aman working as a designer from 3 years. My skills include Adobe Photoshop,...
        </p>
        <div className="flex items-center gap-2 mt-4">
          <button className="bg-gray-100 text-blue-600 text-sm px-3 py-1 rounded-md">2,900 followers</button>
          <button className="bg-gray-100  text-blue-600 text-sm px-3 py-1 rounded-md">1,021 following</button>
        </div>
      </div>

      {/* Section 2: Dashboard */}
      <div
        className="flex flex-col"
        style={{
          width: 355,
          height: 155,
          gap: 10,
        }}
      >
        <h3 className="font-semibold text-gray-800 border-t pt-4 ">Your Dashboard</h3>
        <div className="flex justify-between text-center text-yellow-500 font-bold text-lg">
          <div>
            <p className='text-4xl '>367</p>
            <p className="text-xs text-gray-500">Views today</p>
          </div>
          <div>
            <p className='text-4xl'>15</p>
            <p className="text-xs text-gray-500">Post views</p>
          </div>
          <div>
            <p className='text-4xl'>09</p>
            <p className="text-xs text-gray-500">Search appearance</p>
          </div>
        </div>
        <p className="text-sm text-blue-600 text-center cursor-pointer">See more</p>
      </div>

      {/* Section 3: Profile Visitors */}
      <div
        className="flex flex-col"
        style={{
          width: 355,
          height: 250.42,
          gap: 10,
        }}
      >
        <h3 className="font-semibold text-gray-800 border-t pt-4">Profile Visitors</h3>
        <div className="grid grid-cols-4 gap-2">
          {visitors.map((visitor, index) => (
            <div key={index} className="text-center">
              <img
                src={visitor.img}
                alt={visitor.name}
                className="mx-auto object-cover"
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 10,
                }}
              />
              <p className="text-xs text-gray-600 mt-1">{visitor.name}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-blue-600 text-center cursor-pointer">See more</p>
      </div>

      {/* Footer Section */}
      <div className="w-[355px] flex flex-col items-center justify-center text-gray-400 border-t pt-4">
        {/* Optional Footer Content */}
      </div>

      {/* Responsive Adjustments */}
      <style>
        {`
          @media (max-width: 500px) {
            div[style*="width: 375px"] {
              width: 98vw !important;
              left: 1vw !important;
              padding-left: 2vw !important;
              padding-right: 2vw !important;
            }
            div[style*="width: 355px"] {
              width: 90vw !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default ProfileCard;
