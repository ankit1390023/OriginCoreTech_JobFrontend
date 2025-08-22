import React, { useState } from "react";

const AuditInfo = () => {
  const [open, setOpen] = useState(true);

  return (
    <div
      className="max-w-[1096px] w-full bg-white shadow rounded border p-4 sm:p-6"
      style={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-2 mb-4">
        <h2 className="font-semibold text-gray-700">Audit Info</h2>
        <button
          onClick={() => setOpen(!open)}
          className="text-gray-500 hover:text-gray-700"
        >
          {open ? "▼" : "▶"}
        </button>
      </div>

      {/* Info Row */}
      {open && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Created By</p>
            <p className="font-medium">Anil Kumar</p>
          </div>
          <div>
            <p className="text-gray-500">Created On</p>
            <p className="font-medium">17-04-2024</p>
          </div>
          <div>
            <p className="text-gray-500">Modified By</p>
            <p className="font-medium">Sunil Sharma</p>
          </div>
          <div>
            <p className="text-gray-500">Modified On</p>
            <p className="font-medium">29-04-2024</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditInfo;
