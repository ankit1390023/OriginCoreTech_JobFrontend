// src/pages/TermsAndConditions.js
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; 
import { Button } from "../../components/ui";
import termsApi from "../../api/termsApi";

export default function TermsAndConditions() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation(); //  Get passed state

  useEffect(() => {
    const passedContent = location.state?.content;

    if (passedContent) {
      // Use preloaded content — no fetch needed!
      setContent(passedContent);
      setLoading(false);
    } else {
      // Fallback: Fetch if for some reason content wasn't passed
      const fetchTerms = async () => {
        try {
          const data = await termsApi.getTermsAndCondition();
          setContent(
            data.terms_and_condition || "No terms available at the moment."
          );
        } catch (error) {
          setContent(
            "Failed to load Terms and Conditions. Please try again later."
          );
        } finally {
          setLoading(false);
        }
      };

      fetchTerms();
    }
  }, [location.state?.content]);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-3xl p-6 mt-6 bg-white rounded-lg shadow">
        <h1 className="mb-4 text-2xl font-bold text-gray-800">
          Terms and Conditions
        </h1>

        {loading ? (
          <p className="text-gray-500">Loading...</p> // Should rarely show now
        ) : (
          <div
            className="prose text-gray-700"
            dangerouslySetInnerHTML={{
              __html: content.replace(/\n/g, "<br />"),
            }}
          />
        )}

        <div className="mt-6">
          <Button onClick={() => navigate(-1)} variant="outline">
            Back
          </Button>
        </div>
      </div>
    </div>
  );
}
