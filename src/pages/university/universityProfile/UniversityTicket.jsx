import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Input, RadioGroup, Textarea, Button } from '../../../components/ui';
import MainLayout from '../../../components/layout/MainLayout';
import UniversityRightSide1 from './UniversityRightSide1';
import { raiseTicket } from '../../../redux/feature/ticketSlice';



const PRIORITY_OPTIONS = [
  { label: 'High', value: 'high' },
  { label: 'Medium', value: 'medium' },
  { label: 'Low', value: 'low' },
];

const UniversityTicket = () => {
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.ticket);
  const { token, user } = useSelector((state) => state.auth);
  
  // Get user email from Redux state
  const userEmail = user?.email || '';
  
  const [priority, setPriority] = useState('medium');
  const [issueTitle, setIssueTitle] = useState('');
  const [body, setBody] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    
    if (!issueTitle.trim()) {
      setLocalError('Please enter the issue title.');
      return;
    }
    
    if (!body.trim()) {
      setLocalError('Please enter the issue details.');
      return;
    }

    const ticketData = {
      issueTitle: issueTitle.trim(),
      issueDetail: body.trim(),
      role: 'student', // Default role for student users
      email: userEmail,
      priority // Keep priority for additional context
    };
    
    try {
      await dispatch(raiseTicket({ ticketData, token })).unwrap();
      // Reset form on success
      setIssueTitle('');
      setBody('');
      setPriority('medium');
    } catch (err) {
      // Error is handled by Redux state
      console.error('Failed to raise ticket:', err);
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
      <div className="flex justify-center bg-gray-100 min-h-screen px-2 lg:px-8">
        {/* Left Spacer */}
        <div className="hidden lg:block flex-grow "></div>

    <section
     className="bg-white rounded-[10px] p-5 shadow-lg mt-2 w-[780px] h-[1000px] opacity-100 gap-[5px]"
    >
      <h2 className="text-2xl sm:text-3xl font-bold mb-1">Create Quick Ticket</h2>
      <p className="text-gray-500 text-sm sm:text-base mb-4">Write and address new queries and issues</p>
      <form className="flex flex-col gap-[5px] flex-1" onSubmit={handleSubmit}>
        <Input
          label="Customer Email"
          value={userEmail}
          disabled
          className="text-gray-500"
        />
        <Input
          label="Issue Title"
          placeholder="Enter a brief title for your issue"
          value={issueTitle}
          onChange={e => setIssueTitle(e.target.value)}
          required
        />
        <div className="flex flex-col gap-[15px]">
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
        </div>
        {(localError || error) && (
          <div className="text-red-500 text-sm">
            {localError || (typeof error === 'string' ? error : 'An error occurred while submitting the ticket')}
          </div>
        )}
        {success && <div className="text-green-600 text-sm">Ticket submitted successfully!</div>}
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
  <UniversityRightSide1 />
</aside>
        {/* Right Spacer */}
        <div className="hidden lg:block flex-grow"></div>
      </div>
    </MainLayout>
  );
};

export default UniversityTicket;
