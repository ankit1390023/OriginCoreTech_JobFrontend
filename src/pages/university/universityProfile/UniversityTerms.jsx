import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import UniversityRightSidebar from "./UniversityRightSidebar";
import MainLayout from "../../../components/layout/MainLayout";
import termsApi from "../../../api/termsApi";

const UniversityTerms = () => {
  const [termsData, setTermsData] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Get token and user from Redux state
  const { token, isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchTermsAndConditions = async () => {
      try {
        setLoading(true);

        if (!isAuthenticated || !token) {
          throw new Error("No authentication token found. Please login again.");
        }

        const response = await termsApi.getTermsAndCondition();
        setTermsData(response.terms_and_condition);
        setEditData(response.terms_and_condition);
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

  const handleEdit = () => {
    setIsEditing(true);
    setEditData(termsData);
    setSaveError(null);
    setSaveSuccess(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData(termsData);
    setSaveError(null);
    setSaveSuccess(false);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaveError(null);
      setSaveSuccess(false);

      if (!isAuthenticated || !token) {
        throw new Error("No authentication token found. Please login again.");
      }

      // Clean and validate the data
      const cleanData = editData.trim();
      if (!cleanData) {
        throw new Error("Terms and conditions content cannot be empty.");
      }

      // Get user ID from Redux state (already available at component level)
      const user_id = user?.id;

      if (!user_id) {
        throw new Error("User ID not found. Please login again.");
      }

      const response = await termsApi.updateTermsAndCondition(
        {
          user_id: user_id,
          accepted: true,
        },
        token
      );

      setTermsData(cleanData);
      setIsEditing(false);
      setSaveSuccess(true);

      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Error updating terms and conditions:", err);

      // Extract the actual error message from the server response
      let errorMessage =
        "Failed to update terms and conditions. Please try again.";

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setSaveError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  return (
    <MainLayout>
      <div className="flex justify-center min-h-screen px-2 bg-gray-100 lg:px-8">
        {/* Left Spacer */}
        <div className="flex-grow hidden lg:block"></div>
        <section className="flex items-start justify-center pt-2 ">
          <div className="bg-white rounded-[10px] p-5 shadow-lg mt-1 w-[800px] h-[1000px] opacity-100 gap-[10px]">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-800">
                Terms & Conditions
              </h1>
              {/* {!loading && !error && (
            <button
              onClick={handleEdit}
              className="px-4 py-2 text-white transition-colors bg-blue-600 rounded hover:bg-blue-700"
            >
              Edit
            </button>
          )} */}
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
              ) : isEditing ? (
                <div className="space-y-4">
                  {saveSuccess && (
                    <div className="px-4 py-3 text-green-700 bg-green-100 border border-green-400 rounded">
                      ✅ Terms and conditions updated successfully!
                    </div>
                  )}
                  {saveError && (
                    <div className="px-4 py-3 text-red-700 bg-red-100 border border-red-400 rounded">
                      ⚠️ {saveError}
                    </div>
                  )}
                  <textarea
                    value={editData}
                    onChange={(e) => setEditData(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-lg resize-none h-96 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter terms and conditions content..."
                  />
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={handleCancel}
                      disabled={saving}
                      className="px-4 py-2 text-white transition-colors bg-gray-500 rounded hover:bg-gray-600 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center px-4 py-2 text-white transition-colors bg-green-600 rounded hover:bg-green-700 disabled:opacity-50"
                    >
                      {saving ? (
                        <>
                          <div className="w-4 h-4 mr-2 border-b-2 border-white rounded-full animate-spin"></div>
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="whitespace-pre-wrap">
                  {termsData || "No terms and conditions available."}
                </div>
              )}
            </div>
          </div>
        </section>
        {/* Profile Card */}
        <aside className="hidden lg:block w-full max-w-[350px] p-2 sticky top-4 h-fit">
          <UniversityRightSidebar />
        </aside>
        {/* Right Spacer */}
        <div className="flex-grow hidden lg:block "></div>
      </div>
    </MainLayout>
  );
};

export default UniversityTerms;

//
