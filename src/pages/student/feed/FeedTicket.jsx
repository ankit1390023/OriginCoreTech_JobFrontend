import React, { useState } from 'react';
import { Input, Label, Button, RadioGroup, Textarea } from '../../components/ui';
import { FaTicketAlt, FaEnvelope, FaFlag, FaRegCommentDots, FaPaperPlane } from 'react-icons/fa';

const FeedTicket = () => {
  const [priority, setPriority] = useState('Medium');
  const [body, setBody] = useState('');

  // For demo, email is hardcoded as in the image
  const email = 'amangupta@gmail.com';

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl border border-blue-200 p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-2">
        <FaTicketAlt className="text-3xl text-red-500" />
        <h1 className="text-4xl font-bold">Create Quick Ticket</h1>
      </div>
      <p className="text-gray-600 mb-6 text-base">Write and address new queries and issues</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="email" size="default" className="flex items-center gap-2">
            <FaEnvelope className="inline text-gray-400 mr-1" /> Customer Email
          </Label>
          <div className="relative">
            <Input
              id="email"
              value={email}
              disabled
              className="bg-gray-50 text-gray-400 mt-1 pl-9"
            />
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-lg pointer-events-none" />
          </div>
        </div>
        <div>
          <Label size="default" className="flex items-center gap-2">
            <FaFlag className="inline text-gray-400 mr-1" /> Ticket Priority
          </Label>
          <RadioGroup
            name="priority"
            value={priority}
            onChange={e => setPriority(e.target.value)}
            options={[
              { label: 'High', value: 'High' },
              { label: 'Medium', value: 'Medium' },
              { label: 'Low', value: 'Low' },
            ]}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="body" size="default" className="flex items-center gap-2">
            <FaRegCommentDots className="inline text-gray-400 mr-1" /> Ticket Body
          </Label>
          <Textarea
            id="body"
            placeholder="Type issue here"
            value={body}
            onChange={e => setBody(e.target.value)}
            rows={3}
            className="mt-1"
          />
        </div>
        <Button type="submit" size="large" className="w-full mt-2 rounded-xl text-lg flex items-center justify-center gap-2">
          <FaPaperPlane className="text-lg" /> Submit
        </Button>
      </form>
    </div>
  );
};

export default FeedTicket;
