import React from 'react';
import FeedRightProfile from './FeedRightProfile';
import MainLayout from '../../../components/layout/MainLayout';





const FeedTerms = () => {
  return (
    <MainLayout>
    <div className="flex justify-center bg-gray-100 min-h-screen px-2 lg:px-8">
        {/* Left Spacer */}
        <div className="hidden lg:block flex-grow"></div>
    <section className="flex justify-center items-start pt-2 ">
      <div 
        className="bg-white rounded-[10px] p-5 shadow-lg mt-1"
        style={{
          width: '850px',
          height: '1000px',
          borderRadius: '10px',
          padding: '20px',
          gap: '10px',
          opacity: 1
        }}
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Terms & Conditions
        </h1>
        
        <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
          <div className="mb-6">
            <h2 className="font-semibold text-base mb-2">L15.1 Your privacy is important to us</h2>
            <p className="mb-3">
              This notice provides you with information concerning our collection and use of personal information. 
              By using the portals or signing the contract document, you are accepting the practices described in 
              this Privacy Policy.
            </p>
            <p className="mb-3">
              Our Privacy Policy covers information collected online from the "Application," via email, fax, 
              telephone, or in person. It also covers how such information is retained and used for providing 
              services.
            </p>
            <p className="mb-3">
              If you do not agree to the terms of this Privacy Policy, please do not use the portals or sign 
              the contract document.
            </p>
          </div>

          <div className="mb-6">
            <h2 className="font-semibold text-base mb-2">15.2 Application Usage</h2>
            <p className="mb-3">
              To use the application's services, you must register by verifying an authorized device. 
              The Privacy Policy applies to information collected and received through "Doctor 24×7."
            </p>
            <p className="mb-3">
              This Privacy Policy does not apply to the practices of businesses that we do not own or control, 
              or to people that we do not employ or manage.
            </p>
          </div>

          <div className="mb-6">
            <h2 className="font-semibold text-base mb-2">15.3 Agreement</h2>
            <p className="mb-3">
              By using this Application, you agree to the terms of this Privacy Policy.
            </p>
          </div>

          {/* Duplicate content as shown in the image */}
          <div className="border-t pt-6">
            <h2 className="font-semibold text-base mb-2">L15.1 Your privacy is important to us</h2>
            <p className="mb-3">
              This notice provides you with information concerning our collection and use of personal information. 
              By using the portals or signing the contract document, you are accepting the practices described in 
              this Privacy Policy.
            </p>
            <p className="mb-3">
              Our Privacy Policy covers information collected online from the "Application," via email, fax, 
              telephone, or in person. It also covers how such information is retained and used for providing 
              services.
            </p>
            <p className="mb-3">
              If you do not agree to the terms of this Privacy Policy, please do not use the portals or sign 
              the contract document.
            </p>
          </div>

          <div className="mb-6">
            <h2 className="font-semibold text-base mb-2">15.2 Application Usage</h2>
            <p className="mb-3">
              To use the application's services, you must register by verifying an authorized device. 
              The Privacy Policy applies to information collected and received through "Doctor 24×7."
            </p>
            <p className="mb-3">
              This Privacy Policy does not apply to the practices of businesses that we do not own or control, 
              or to people that we do not employ or manage.
            </p>
          </div>

          <div className="mb-6">
            <h2 className="font-semibold text-base mb-2">15.3 Agreement</h2>
            <p className="mb-3">
              By using this Application, you agree to the terms of this Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </section>
  {/* Profile Card */}
  <aside className="hidden lg:block w-full max-w-[350px] p-2 sticky top-4 h-fit">
                    <FeedRightProfile />
                </aside>
                {/* Right Spacer */}
                <div className="hidden lg:block flex-grow "></div>
            </div>
        </MainLayout>
  );
};

export default FeedTerms;
