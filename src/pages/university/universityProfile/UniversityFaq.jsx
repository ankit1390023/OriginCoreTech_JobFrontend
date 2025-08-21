import React, { useState, useEffect } from 'react';
import { Button, Badge } from '../../../components/ui';
import MainLayout from '../../../components/layout/MainLayout';
import UniversityRightSide1 from './UniversityRightSide1';      
import { faqApi } from '../../../api/faqApi';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const FAQSection = () => {
  const [faqs, setFaqs] = useState([]);
  const [openIndex, setOpenIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleRaiseTicket = () => {
    navigate('/feed-ticket');
  };

  // Get token from Redux store
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchFaqs = async () => {
      if (!token) {
        setErrorMsg('Authentication required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setErrorMsg('');
        
        const response = await faqApi.getStudentFaqs(token);
        
        // Handle the response structure: { message: "FAQs fetched successfully", data: [...] }
        if (response.data && response.data.data) {
          const formattedFaqs = response.data.data.map(item => ({
            id: item.id,
            question: item.question,
            answer: item.answer,
            role: item.role,
            isActive: item.isActive,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt
          }));
          setFaqs(formattedFaqs);
        } else {
          setFaqs([]);
          setErrorMsg('No FAQs found');
        }
      } catch (error) {
        console.error('Error fetching FAQs:', error);
        setErrorMsg(error.response?.data?.message || 'Failed to load FAQs. Please try again.');
        setFaqs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, [token]);

  return (
    <MainLayout>
      <div className="flex justify-center bg-gray-100 min-h-screen px-2 lg:px-8 items-start">
        {/* Left Spacer */}
        <div className="hidden lg:block flex-grow"></div>

        <div className="bg-white rounded-[10px] p-5 shadow-lg mt-2 w-[729px] h-[631px] opacity-100 gap-[10px]">
          <h2 className="text-3xl font-bold text-center text-blue-900 mb-2">FAQs</h2>
          <p className="text-center text-gray-500 mb-4">
            Our expert advisors can help you find the right solution for you.
          </p>
          
          <div className="overflow-y-auto h-[500px]">
            {loading ? (
              <div className="text-center text-gray-500 mt-[20px]">Loading FAQs...</div>
            ) : errorMsg ? (
              <div className="text-center text-red-500">{errorMsg}</div>
            ) : faqs.length === 0 ? (
              <div className="text-center text-gray-500 mt-[20px]">No FAQs found.</div>
            ) : (
              faqs.map((faq, index) => (
                <div
                  key={index}
                  className={`border rounded-xl mb-4 transition-all duration-300 ${
                    openIndex === index ? 'border-gray-300 shadow' : 'border-gray-200'
                  }`}
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full text-left px-5 py-4 flex justify-between items-center focus:outline-none"
                  >
                    <span className="font-medium text-gray-800">{faq.question}</span>
                    <span className="text-xl text-gray-500">
                      {openIndex === index ? '▾' : '▸'}
                    </span>
                  </button>
                  {openIndex === index && (
                    <div className="px-5 pb-4 mt-[10px] text-sm text-gray-700 whitespace-pre-line">
                      {faq.answer}
                    </div>
                  )}

                  
                </div>
                
              ))
            )}
               {/* Badge Button for Raising Ticket */}
          <div className="text-center mb-6 mt-[20px]">
            <p 
              onClick={handleRaiseTicket}
              className=" w-[400px]  text-red-400 ml-[150px] cursor-pointer px-4 py-2 rounded-full text-sm font-bold transition-colors duration-200"
            >
              <u>Still not resolved? Raise a ticket</u>
            </p>
          </div>
          </div>
           
          
        </div>
 {/* Profile Card */}
     <aside className="hidden lg:block w-full max-w-[350px] p-2 sticky top-4 h-fit">
  <UniversityRightSide1 />
</aside>
        {/* Right Spacer */}
        <div className="hidden lg:block flex-grow"></div>
      </div>
    </MainLayout>
  );
};

export default FAQSection;
