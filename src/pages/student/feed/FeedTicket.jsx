import React, { useState } from 'react';
import { Input, RadioGroup, Textarea, Button } from '../../../components/ui';
import MainLayout from '../../../components/layout/MainLayout';
import FeedRightProfile from './FeedRightProfile';

const EMAIL = 'amangupta@gmail.com'; // This can be replaced with a prop or context if needed

const PRIORITY_OPTIONS = [
  { label: 'High', value: 'high' },
  { label: 'Medium', value: 'medium' },
  { label: 'Low', value: 'low' },
];

const FeedTicket = () => {
  const [priority, setPriority] = useState('medium');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    if (!body.trim()) {
      setError('Please enter the issue details.');
      return;
    }
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setBody('');
      setPriority('medium');
    }, 1200);
  };

  return (
    <MainLayout>
      <div className="flex justify-center bg-gray-100 min-h-screen px-2 lg:px-8">
        {/* Left Spacer */}
        <div className="hidden lg:block flex-grow "></div>

    <section
     className="bg-white rounded-[10px] p-5 shadow-lg mt-2 w-[780px] h-[1000px] opacity-100 gap-[10px]"
    >
      <h2 className="text-2xl sm:text-3xl font-bold mb-1">Create Quick Ticket</h2>
      <p className="text-gray-500 text-sm sm:text-base mb-4">Write and address new queries and issues</p>
      <form className="flex flex-col gap-4 flex-1" onSubmit={handleSubmit}>
        <Input
          label="Customer Email"
          value={EMAIL}
          disabled
          className="text-gray-500"
        />
        <RadioGroup
          label="Ticket Priority"
          name="priority"
          value={priority}
          onChange={e => setPriority(e.target.value)}
          options={PRIORITY_OPTIONS}
        />
        <Textarea
          label="Ticket Body"
          placeholder="Type issue here"
          value={body}
          onChange={e => setBody(e.target.value)}
          rows={3}
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">Ticket submitted successfully!</div>}
        <Button
          type="submit"
          className="w-full mt-10 text-base sm:text-lg py-2 sm:py-3 rounded-xl b"
          loading={loading}
        >
          Submit
        </Button>
      </form>
    </section>
     {/* Profile Card */}
     <aside className="hidden lg:block w-full max-w-[350px] p-2 sticky top-4 h-fit">
  <FeedRightProfile />
</aside>
        {/* Right Spacer */}
        <div className="hidden lg:block flex-grow"></div>
      </div>
    </MainLayout>
  );
};

export default FeedTicket;
