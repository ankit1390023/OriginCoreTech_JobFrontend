import React from "react";

const ApplicationDetail = () => {
  return (
    <div className="bg-white rounded-lg shadow-md w-[729px] h-[843px] py-5 px-6 flex flex-col gap-5 overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-start border border-gray-200 rounded-lg p-4">
        <div>
          <h2 className="font-semibold text-lg">Saloni Ahuja</h2>
          <p className="text-gray-500 text-sm">Delhi (Open to relocate)</p>
          <p className="text-gray-500 text-sm">
            Total work experience: 5 months
          </p>
          <p className="mt-2 text-sm">
            Skills: Canva, CorelDRAW, Social Media Marketing{" "}
            <span className="text-gray-500">+4 more</span>
          </p>
          <p className="text-sm mt-1">Languages: Hindi</p>
        </div>
        <div className="flex flex-col items-end">
          <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium">
            Resume match: Moderate
          </span>
          <p className="text-gray-400 text-xs mt-1">Applied 3 days ago</p>
        </div>
      </div>

      {/* Screening Questions */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold mb-2">Screening Questions</h3>
        <p className="text-gray-600 text-sm">
          Yes, I am available to join immediately.
        </p>
      </div>

      {/* Resume */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold mb-3">Resume</h3>

        {/* Education */}
        <div className="mb-3">
          <h4 className="text-blue-600 font-semibold">Education</h4>
          <p className="font-medium">Bachelor of Arts (B.A.)</p>
          <p className="text-gray-500 text-sm">
            Technia Institute of Advanced Studies (2022-2025)
          </p>
        </div>

        {/* Internships */}
        <div className="mb-3">
          <h4 className="text-blue-600 font-semibold">Internships</h4>
          <p className="font-medium">
            Digital Marketing Intern – One World News, Delhi (Jul 2024 - Oct
            2024, 3 months)
          </p>
          <ul className="list-disc list-inside text-gray-600 text-sm">
            <li>Worked on SEO</li>
            <li>
              Actively involved in Social Media Optimization, Publishing
              Articles
            </li>
            <li>Created images for social media</li>
          </ul>
          <p className="font-medium mt-2">
            Digital Marketing Intern – Times of India, Noida (Oct 2023 - Oct
            2023, 1 month)
          </p>
          <ul className="list-disc list-inside text-gray-600 text-sm">
            <li>Editing videos for YouTube Shorts</li>
            <li>Created images for social media</li>
          </ul>
        </div>

        {/* Projects */}
        <div className="mb-3">
          <h4 className="text-blue-600 font-semibold">Projects</h4>
          <p className="font-medium">Product Photography</p>
          <p className="text-gray-500 text-sm">May 2023 - Jun 2023</p>
          <p className="text-gray-600 text-sm">
            Taken pictures of Electronic products like smart watch, headphones
            etc for advertisement using 3 point technique.
          </p>
        </div>

        {/* Additional Details */}
        <div className="mb-3">
          <h4 className="text-blue-600 font-semibold">Additional Details</h4>
          <a
            href="https://drive.google.com/"
            target="_blank"
            rel="noreferrer"
            className="text-red-500 text-sm hover:underline"
          >
            https://drive.google.com/...
          </a>
        </div>

        {/* Uploaded Resume */}
        <div className="mb-3">
          <h4 className="text-blue-600 font-semibold">Uploaded Resume</h4>
          <a
            href="#"
            className="text-red-500 text-sm hover:underline"
          >
            saloniresume_174382042.pdf
          </a>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-blue-600 font-semibold">Contact</h4>
          <p className="text-sm">
            <span className="font-medium">Chat:</span> Send messages and share
            assignment{" "}
            <span className="text-red-500 hover:underline cursor-pointer">
              Start Chat
            </span>
          </p>
          <p className="text-sm">
            <span className="font-medium">Email ID:</span>{" "}
            saloniahuja@gmail.com
          </p>
          <p className="text-sm">
            <span className="font-medium">Phone:</span> +91 9876543210
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between mt-auto gap-3">
        <button className="border border-gray-300 px-4 py-2 rounded-md text-sm hover:bg-gray-100">
          Send Assignment
        </button>
        <button className="border border-gray-300 px-4 py-2 rounded-md text-sm hover:bg-gray-100">
          Schedule Interview
        </button>
        <button className="bg-green-500 text-white px-4 py-2 rounded-md text-sm hover:bg-green-600">
          Hire
        </button>
        <button className="bg-red-500 text-white px-4 py-2 rounded-md text-sm hover:bg-red-600">
          Not interested
        </button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600">
          Shortlist
        </button>
      </div>
    </div>
  );
};

export default ApplicationDetail;
