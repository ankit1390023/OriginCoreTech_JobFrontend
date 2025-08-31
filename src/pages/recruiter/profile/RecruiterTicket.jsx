import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Input, RadioGroup, Textarea, Button } from "../../../components/ui";
import MainLayout from "../../../components/layout/MainLayout";
import RecruiterRightSide2 from "./RecruiterRightSide2";
import { ticketApi } from "../../../api/ticketApi";

const PRIORITY_OPTIONS = [
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
  { label: "Low", value: "low" },
];

const FeedTicket = () => {
  const { user } = useSelector((state) => state.auth);
  const userEmail = user?.email || "";

  const [priority, setPriority] = useState("medium");
  const [issue_title, setIssueTitle] = useState("");
  const [body, setBody] = useState("");
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (!issue_title.trim()) {
      setLocalError("Please enter the issue title.");
      return;
    }

    if (!body.trim()) {
      setLocalError("Please enter the issue details.");
      return;
    }

    const ticketData = {
      issue_title: issue_title.trim(),
      issue_detail: body.trim(),
      role: "recruiter", // Default role for student users
      email: userEmail,
      priority, // Keep priority for additional context
    };

    try {
      await ticketApi.raiseTicket(ticketData);
      // Reset form on success
      setIssueTitle("");
      setBody("");
      setPriority("medium");
    } catch (err) {
      // Error is handled by Redux state
      console.error("Failed to raise ticket:", err);
    }
  };

  // Reset success state after showing message
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        // You might want to add a reset action to the slice
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  return (
    <MainLayout>
      <div className="flex justify-center min-h-screen px-2 bg-gray-100 lg:px-8">
        {/* Left Spacer */}
        <div className="flex-grow hidden lg:block "></div>

        <section className="bg-white rounded-[10px] p-5 shadow-lg mt-2 w-[780px] h-[1000px] opacity-100 gap-[5px]">
          <h2 className="mb-1 text-2xl font-bold sm:text-3xl">
            Create Quick Ticket
          </h2>
          <p className="mb-4 text-sm text-gray-500 sm:text-base">
            Write and address new queries and issues
          </p>
          <form
            className="flex flex-col gap-[5px] flex-1"
            onSubmit={handleSubmit}
          >
            <Input
              label="Customer Email"
              value={userEmail}
              disabled
              className="text-gray-500"
            />
            <Input
              label="Issue Title"
              placeholder="Enter a brief title for your issue"
              value={issue_title}
              onChange={(e) => setIssueTitle(e.target.value)}
              required
            />
            <div className="flex flex-col gap-[15px]">
              <RadioGroup
                label="Ticket Priority"
                name="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                options={PRIORITY_OPTIONS}
              />
              <Textarea
                label="Ticket Body"
                placeholder="Type issue here"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={3}
              />
            </div>
            {(localError || error) && (
              <div className="text-sm text-red-500">
                {localError ||
                  (typeof error === "string"
                    ? error
                    : "An error occurred while submitting the ticket")}
              </div>
            )}
            {success && (
              <div className="text-sm text-green-600">
                Ticket submitted successfully!
              </div>
            )}
            <Button
              type="submit"
              className="w-full mt-[5px] text-base sm:text-lg py-2 sm:py-3 rounded-xl b"
              loading={loading}
            >
              Submit
            </Button>
          </form>
        </section>
        {/* Profile Card */}
        <aside className="hidden lg:block w-full max-w-[350px] p-2 sticky top-4 h-fit">
          <RecruiterRightSide2 />
        </aside>
        {/* Right Spacer */}
        <div className="flex-grow hidden lg:block"></div>
      </div>
    </MainLayout>
  );
};

export default FeedTicket;