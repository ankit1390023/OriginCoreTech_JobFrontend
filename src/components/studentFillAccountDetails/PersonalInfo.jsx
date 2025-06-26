import React from "react";

export default function PersonalInfo({ register, errors }) {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">First Name</label>
          <input
            {...register("firstName", { required: "First Name is required" })}
            className="w-full p-2 border rounded"
          />
          {errors.firstName && (
            <p className="text-red-500 text-xs">{errors.firstName.message}</p>
          )}
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Last Name</label>
          <input
            {...register("lastName", { required: "Last Name is required" })}
            className="w-full p-2 border rounded"
          />
          {errors.lastName && (
            <p className="text-red-500 text-xs">{errors.lastName.message}</p>
          )}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Email ID</label>
        <input
          {...register("email", { required: "Email is required" })}
          className="w-full p-2 border rounded"
        />
        {errors.email && (
          <p className="text-red-500 text-xs">{errors.email.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Phone Number</label>
        <input
          {...register("phone", { required: "Phone is required" })}
          className="w-full p-2 border rounded"
        />
        {errors.phone && (
          <p className="text-red-500 text-xs">{errors.phone.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Date of Birth</label>
        <input
          type="date"
          {...register("dob", { required: "Date of Birth is required" })}
          className="w-full p-2 border rounded"
        />
        {errors.dob && (
          <p className="text-red-500 text-xs">{errors.dob.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Current City</label>
        <input
          {...register("city", { required: "Current City is required" })}
          className="w-full p-2 border rounded"
        />
        {errors.city && (
          <p className="text-red-500 text-xs">{errors.city.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Gender</label>
        <select
          {...register("gender", { required: "Gender is required" })}
          className="w-full p-2 border rounded"
        >
          <option value="">Select</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        {errors.gender && (
          <p className="text-red-500 text-xs">{errors.gender.message}</p>
        )}
      </div>
    </div>
  );
}
