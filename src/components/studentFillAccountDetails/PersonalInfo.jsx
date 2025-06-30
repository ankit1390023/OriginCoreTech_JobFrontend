import React from "react";
import { useFormContext } from "react-hook-form";
import { useEducationData } from "../../hooks/useEducationData";
import LoadingSpinner from "../shared/LoadingSpinner";

export default function PersonalInfo() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const {
    data: { locations } = { locations: [] },
    loading,
    error,
    refetch,
  } = useEducationData();

  const ErrorMessage = ({ message }) => (
    <div className="w-full p-3 border rounded bg-red-50 text-red-500 text-xs">
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button
          onClick={refetch}
          className="ml-2 px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">First Name</label>
          <input
            {...register("firstName")}
            className="w-full p-2 border rounded"
            placeholder="Enter your first name"
          />
          {errors.firstName && (
            <p className="text-red-500 text-xs">{errors.firstName.message}</p>
          )}
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Last Name</label>
          <input
            {...register("lastName")}
            className="w-full p-2 border rounded"
            placeholder="Enter your last name"
          />
          {errors.lastName && (
            <p className="text-red-500 text-xs">{errors.lastName.message}</p>
          )}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Email ID</label>
        <input
          {...register("email")}
          className="w-full p-2 border rounded"
          placeholder="example@email.com"
          type="email"
        />
        {errors.email && (
          <p className="text-red-500 text-xs">{errors.email.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Phone Number</label>
        <input
          {...register("phone")}
          className="w-full p-2 border rounded"
          placeholder="+91 98765 43210"
          type="tel"
        />
        {errors.phone && (
          <p className="text-red-500 text-xs">{errors.phone.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Date of Birth</label>
        <input
          type="date"
          {...register("dob")}
          className="w-full p-2 border rounded"
          placeholder="Select your date of birth"
        />
        {errors.dob && (
          <p className="text-red-500 text-xs">{errors.dob.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Current City</label>
        {loading ? (
          <LoadingSpinner message="Loading locations..." />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : (
          <select {...register("city")} className="w-full p-2 border rounded">
            <option value="">Select your current city</option>
            {locations.map((location, index) => (
              <option key={index} value={location}>
                {location}
              </option>
            ))}
          </select>
        )}
        {errors.city && (
          <p className="text-red-500 text-xs">{errors.city.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Gender</label>
        <select {...register("gender")} className="w-full p-2 border rounded">
          <option value="">Select your gender</option>
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
