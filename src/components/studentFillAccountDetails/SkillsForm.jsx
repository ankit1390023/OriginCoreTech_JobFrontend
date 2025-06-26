import React, { useState } from "react";
import { FaTimes, FaInfoCircle } from "react-icons/fa";

const initialSkills = [
  { name: "Digital Marketing", certificate: null, company: "" },
  { name: "Graphic Design", certificate: null, company: "" },
];

const relatedSkills = ["SEO", "Content Writing", "Digital Marketing"];

export default function SkillsForm() {
  const [skills, setSkills] = useState(initialSkills);
  const [input, setInput] = useState("");
  const [showMore, setShowMore] = useState(false);

  const handleAddSkill = (skill) => {
    if (!skills.find((s) => s.name === skill)) {
      setSkills([...skills, { name: skill, certificate: null, company: "" }]);
    }
    setInput("");
  };

  const handleRemoveSkill = (idx) => {
    setSkills(skills.filter((_, i) => i !== idx));
  };

  const handleCompanyChange = (idx, value) => {
    setSkills(skills.map((s, i) => (i === idx ? { ...s, company: value } : s)));
  };

  const handleCertificateChange = (idx, file) => {
    setSkills(
      skills.map((s, i) => (i === idx ? { ...s, certificate: file } : s))
    );
  };

  return (
    <div
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
    >
      <div className="mb-4">
        <label className="block font-semibold mb-2">Areas of Interest</label>
        <div className="flex items-center border rounded px-3 py-2 mb-2">
          <input
            className="flex-1 outline-none"
            placeholder="List your skills here"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                e.stopPropagation();
                if (input.trim()) {
                  handleAddSkill(input.trim());
                }
              }
            }}
          />
          <button
            className="ml-2 text-gray-400"
            onClick={() => input.trim() && handleAddSkill(input.trim())}
            type="button"
          >
            <svg width="20" height="20" fill="none">
              <circle cx="10" cy="10" r="9" stroke="#888" />
              <path
                d="M10 5v10M5 10h10"
                stroke="#888"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        {skills.map((skill, idx) => (
          <div
            key={skill.name}
            className="border rounded-lg p-3 mb-3 flex flex-col gap-2 relative"
          >
            <div className="flex items-center gap-2">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                {skill.name}
              </span>
              <button
                className="ml-2 text-gray-400"
                onClick={() => handleRemoveSkill(idx)}
                type="button"
              >
                <FaTimes />
              </button>
              <button
                className="ml-2 text-blue-500 text-xs underline"
                type="button"
                onClick={() => document.getElementById(`cert-${idx}`).click()}
              >
                Upload Certificate
              </button>
              <input
                id={`cert-${idx}`}
                type="file"
                className="hidden"
                onChange={(e) =>
                  handleCertificateChange(idx, e.target.files[0])
                }
              />
              <FaInfoCircle className="ml-1 text-gray-400" title="Optional" />
            </div>
            <div>
              <label className="block text-xs mb-1">
                Where did you learn this skill?
              </label>
              <input
                className="w-full border rounded px-2 py-2"
                placeholder="College/ Company name"
                value={skill.company}
                onChange={(e) => handleCompanyChange(idx, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mb-4">
        <div className="text-xs mb-2 text-gray-500">
          Related skills you might know
        </div>
        <div className="flex flex-wrap gap-2">
          {relatedSkills.map((skill) => (
            <button
              key={skill}
              type="button"
              className="bg-gray-100 rounded-full px-3 py-1 text-xs border"
              onClick={() => handleAddSkill(skill)}
            >
              {skill} +
            </button>
          ))}
          <button
            type="button"
            className="text-blue-500 underline text-xs"
            onClick={() => setShowMore((v) => !v)}
          >
            See more +
          </button>
        </div>
      </div>
    </div>
  );
}
