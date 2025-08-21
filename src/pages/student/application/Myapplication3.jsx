import React from 'react';
import MainLayout from '../../../components/layout/MainLayout';
 import FeedRightSide3 from '../feed/FeedRightSide3';

 const Myapplication3 = () => {
  return (
    <MainLayout>
    <div className="flex justify-center bg-gray-100 min-h-screen px-2 lg:px-8 items-start">
        <div className="hidden lg:block flex-grow"></div>
      

    <div className="w-[729px] h-[472px] mt-[99px] ml-[159px] rounded-[10px] p-5 gap-[10px] bg-white flex items-center justify-center shadow">
      <div className="text-center justyfy-center">
        <p className="text-black text-lg font-medium justyfy-center">
          Making your personalised 3 pathways (out of 238492) to your
        </p>
        <p className="text-black text-lg font-bold">DREAM JOB</p>
        <p className="text-black text-xl mt-2">...</p>
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
}
export default Myapplication3;