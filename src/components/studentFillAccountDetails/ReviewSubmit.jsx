import React from "react";

export default function ReviewSubmit({ getValues }) {
  const values = getValues();
  return (
    <div className="space-y-2 text-sm">
      <h2 className="font-semibold mb-2">Review your details:</h2>
      {Object.entries(values).map(([key, value]) => (
        <div key={key} className="flex justify-between border-b py-1">
          <span className="capitalize text-gray-600">
            {key.replace(/([A-Z])/g, " $1")}
          </span>
          <span className="font-medium">{value || "-"}</span>
        </div>
      ))}
    </div>
  );
}
