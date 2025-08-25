import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import FeedRightProfile from "../feed/FeedRightProfile";
import MainLayout from "../../../components/layout/MainLayout";
import axios from "axios";

const BASE_URL = "http://212.95.51.83:5000/api"; // ✅ use your backend base URL

const FeedTerms = () => {
  const [termsData, setTermsData] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get token and user from Redux state
  const { token, isAuthenticated } = useSelector((state) => state.auth);

  // ✅ API call
  const getTermsAndCondition = async (token) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/user-details/getterms_and_condition`, // ✅ corrected endpoint
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // keep if your API requires it
          },
        }
      );
      return response.data; // ✅ return the body directly
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
        setTermsData(response.terms_and_condition); // ✅ correct access
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
      <div className="flex justify-center bg-gray-100 min-h-screen px-2 lg:px-8">
        <div className="hidden lg:block flex-grow"></div>
        <section className="flex justify-center items-start pt-2">
          <div className="bg-white rounded-[10px] p-5 shadow-lg mt-1 w-[800px] h-[1000px] opacity-100 gap-[10px]">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">
                Terms & Conditions
              </h1>
            </div>

            <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">
                    Loading terms and conditions...
                  </span>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <div className="text-red-600 mb-2">⚠️</div>
                  <p className="text-red-600 font-medium">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
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
          <FeedRightProfile />
        </aside>
        <div className="hidden lg:block flex-grow "></div>
      </div>
    </MainLayout>
  );
};

export default FeedTerms;
