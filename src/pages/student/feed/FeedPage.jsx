import React from 'react';
import profile from '../../../assets/profile.png';
import addMediaIcon from '../../../assets/add-media.png';
import profile1 from '../../../assets/profile1.png';
import uberLogo from '../../../assets/uber-logo.png';
import carDashboard from '../../../assets/car-dashboard.png';
import { BiCommentDetail, BiLike } from "react-icons/bi";
import { FaEllipsisH, FaEllipsisV } from "react-icons/fa";
import { TbSend } from "react-icons/tb";
import { LiaShareSolid } from "react-icons/lia";
import { Input } from '../../../components/ui';

export default function FeedPage() {
  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-gray-100 min-h-screen">

      {/* 1. Share Box */}
    <div
  className="w-[729px] h-[102px] bg-white rounded-[10px] flex items-start gap-[8px] shadow-sm opacity-100"
  style={{
    borderRadius: '10px',
    transform: 'rotate(0deg)',
    paddingTop: '10px',
    paddingRight: '20px',
    paddingBottom: '10px',
    paddingLeft: '20px'
  }}
>
  <div className="flex items-center justify-between w-full gap-2">
    <div>
      <img
      src={profile}
      alt="Profile"
      className="w-12 h-12 rounded-full object-cover"
    />      
    <div className="text-gray-500 text-sm">Add media</div>
    </div>
    <input placeholder="Share something.." className="w-full border -mt-6 border-grey-400 rounded-md p-2 "/>

  </div>
  
 
</div>



      {/* 2. Uber Post */}
     
<div
  className="w-[729px] h-[402.8px] flex flex-col gap-[10px] bg-white rounded-[10px] border border-gray-200 shadow-sm opacity-100"
  style={{
    transform: 'rotate(0deg)',
    paddingTop: '12px',
    paddingRight: '20px',
    paddingBottom: '12px',
    paddingLeft: '20px'
  }}
>
  {/* Header */}
  <div className="flex items-center gap-3">
    <img src={uberLogo} alt="Uber" className="w-10 h-10 rounded" />
    <div>
      <h3 className="font-semibold text-sm">Uber</h3>
      <p className="text-xs text-gray-400">123,456 followers • 10 min</p>
    </div >
     <div className="ml-auto flex items-center gap-2"> 
      <span className="text-gray-400 text-xs cursor-pointer"><FaEllipsisH /></span>
      </div>
  </div>

  {/* Image */}
  <img
    src={carDashboard}
    alt="Dashboard"
    className="object-cover"
    style={{
      width: '465px',
      height: '232px',
      borderRadius: '14px',
      opacity: 1,
      transform: 'rotate(0deg)'
    }}
  />

  {/* Description */}
  <p className="text-sm text-gray-700">
    Lorem ipsum dolor sit amet, consec adipiscing elit.
    <span className="text-blue-500 cursor-pointer"> see more...</span>
  </p>

  {/* Footer Icons */}
  <div
    className="flex justify-between text-sm text-gray-500 w-[496px] h-[15.8px] opacity-100 rotate-0 px-10"
  >
    <p><BiLike /> like</p>
    <p><BiCommentDetail /> comment</p>
    <p><LiaShareSolid /> share</p>
    <p><TbSend /> send</p>
  </div>
</div>

      {/* 3. Rohan Post */}
     <div
  className="w-[729px] h-[193px] flex flex-col gap-[10px] bg-white rounded-[10px] shadow-sm opacity-100"
  style={{
    transform: 'rotate(0deg)'
  }}
>
        {/* Header */}
        <div className="flex items-center gap-3">
          <img src={profile1} alt="Rohan" className="w-10 h-10 rounded-full" />
          <div>
            <h3 className="font-semibold text-sm">Rohan</h3>
            <p className="text-xs text-gray-400">Digital Marketer @Uber • 10 min</p>
          </div>

         <div className="ml-auto flex items-center gap-2"> 
      <span className="text-gray-400 text-xs cursor-pointer"><FaEllipsisH /></span>
      </div>
        </div>

        {/* Content */}
        <p className="text-sm text-gray-700">
          Hey! Just started a new project and IT WAS MY DREAM! <br />
          Check the link in my profile and comment your suggestions, It has been a rollercoaster journey. Also, I have been seen
          <span className="text-blue-500 cursor-pointer"> see more...</span>
        </p>

        {/* Footer */}
       {/* Footer Icons */}
<div
  className="flex justify-between text-sm text-gray-500 w-[496px] h-[15.8px] opacity-100 rotate-0 px-10"
>
  <p><BiLike /> like</p>
  <p><BiCommentDetail /> comment</p>
  <p><LiaShareSolid /> share</p>
  <p><TbSend /> send</p>
</div>

      </div>

      
    </div>
  );
}
