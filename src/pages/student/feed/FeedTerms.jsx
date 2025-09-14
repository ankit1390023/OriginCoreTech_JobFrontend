import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import FeedRightSidebar from "../feed/FeedRightSidebar";
import MainLayout from "../../../components/layout/MainLayout";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const FeedTerms = () => {
  const [termsData, setTermsData] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get token and user from Redux state
  const { token, isAuthenticated } = useSelector((state) => state.auth);

  const getTermsAndCondition = async (token) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/user-details/getterms_and_condition`, 
        {
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`, //currently token is not required
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error while getting terms and conditions", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchTermsAndConditions = async () => {
      try {
        setLoading(true);

        if (!isAuthenticated || !token) {
          throw new Error("No authentication token found. Please login again.");
        }

        const response = await getTermsAndCondition(token);
        // console.log(response);
        setTermsData(response.terms_and_condition); 
        setError(null);
      } catch (err) {
        console.error("Error fetching terms and conditions:", err);
        setError(
          err.message ||
            "Failed to load terms and conditions. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTermsAndConditions();
  }, [token, isAuthenticated]);

  return (
    <MainLayout>
      <div className="flex justify-center min-h-screen px-2 bg-gray-100 lg:px-8">
        <div className="flex-grow hidden lg:block"></div>
        <section className="flex items-start justify-center pt-2">
          <div className="bg-white rounded-[10px] p-5 shadow-lg mt-1 w-[800px] h-[1000px] opacity-100 gap-[10px]">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-800">
                Terms & Conditions
              </h1>
            </div>

            <div className="space-y-4 text-sm leading-relaxed text-gray-700">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="w-8 h-8 border-b-2 border-blue-600 rounded-full animate-spin"></div>
                  <span className="ml-2 text-gray-600">
                    Loading terms and conditions...
                  </span>
                </div>
              ) : error ? (
                <div className="py-8 text-center">
                  <div className="mb-2 text-red-600">⚠️</div>
                  <p className="font-medium text-red-600">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 mt-4 text-white transition-colors bg-blue-600 rounded hover:bg-blue-700"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <div className="whitespace-pre-wrap">
                  {termsData || "No terms and conditions available."}
                </div>
              )}
            </div>
          </div>
        </section>
        <aside className="hidden lg:block w-full max-w-[350px] p-2 sticky top-4 h-fit">
          <FeedRightSidebar />
        </aside>
        <div className="flex-grow hidden lg:block "></div>
      </div>
    </MainLayout>
  );
};

export default FeedTerms;
