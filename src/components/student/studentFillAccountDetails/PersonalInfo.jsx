import React from "react";
import { useFormContext } from "react-hook-form";
import { useEducationData } from "../../../hooks/useEducationData";
import LoadingSpinner from "../../shared/LoadingSpinner";

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
    <div className="space-y-2 sm:space-y-3">
      <div className="flex gap-1 sm:gap-2 mb-2 sm:mb-3">
        <div className="flex-1">
          <label className="block text-gray-700 text-xs font-semibold mb-0.5 sm:mb-1">First Name</label>
          <input
            {...register("firstName")}
            className="w-full px-1.5 sm:px-2 py-1.5 sm:py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-400 focus:border-transparent text-xs transition-all duration-200 border-gray-300 hover:border-gray-400"
            placeholder="Enter your first name"
          />
          {errors.firstName && (
            <p className="text-xs text-red-500 mt-0.5 block">{errors.firstName.message}</p>
          )}
        </div>
        <div className="flex-1">
          <label className="block text-gray-700 text-xs font-semibold mb-0.5 sm:mb-1">Last Name</label>
          <input
            {...register("lastName")}
            className="w-full px-1.5 sm:px-2 py-1.5 sm:py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-400 focus:border-transparent text-xs transition-all duration-200 border-gray-300 hover:border-gray-400"
            placeholder="Enter your last name"
          />
          {errors.lastName && (
            <p className="text-xs text-red-500 mt-0.5 block">{errors.lastName.message}</p>
          )}
        </div>
      </div>
      <div className="mb-2 sm:mb-3">
        <label className="block text-gray-700 text-xs font-semibold mb-0.5 sm:mb-1">Email ID</label>
        <input
          {...register("email")}
          className="w-full px-1.5 sm:px-2 py-1.5 sm:py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-400 focus:border-transparent text-xs transition-all duration-200 border-gray-300 hover:border-gray-400"
          placeholder="example@email.com"
          type="email"
        />
        {errors.email && (
          <p className="text-xs text-red-500 mt-0.5 block">{errors.email.message}</p>
        )}
      </div>
      <div className="mb-2 sm:mb-3">
        <label className="block text-gray-700 text-xs font-semibold mb-0.5 sm:mb-1">Phone Number</label>
        <input
          {...register("phone")}
          className="w-full px-1.5 sm:px-2 py-1.5 sm:py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-400 focus:border-transparent text-xs transition-all duration-200 border-gray-300 hover:border-gray-400"
          placeholder="+91 98765 43210"
          type="tel"
        />
        {errors.phone && (
          <p className="text-xs text-red-500 mt-0.5 block">{errors.phone.message}</p>
        )}
      </div>
      <div className="mb-2 sm:mb-3">
        <label className="block text-gray-700 text-xs font-semibold mb-0.5 sm:mb-1">Date of Birth</label>
        <input
          type="date"
          {...register("dob")}
          className="w-full px-1.5 sm:px-2 py-1.5 sm:py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-400 focus:border-transparent text-xs transition-all duration-200 border-gray-300 hover:border-gray-400"
          placeholder="Select your date of birth"
        />
        {errors.dob && (
          <p className="text-xs text-red-500 mt-0.5 block">{errors.dob.message}</p>
        )}
      </div>
      <div className="mb-2 sm:mb-3">
        <label className="block text-gray-700 text-xs font-semibold mb-0.5 sm:mb-1">Current City</label>
        {loading ? (
          <LoadingSpinner message="Loading locations..." />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : (
          <select {...register("city")} className="w-full px-1.5 sm:px-2 py-1.5 sm:py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-400 focus:border-transparent text-xs transition-all duration-200 border-gray-300 hover:border-gray-400">
            <option value="">Select your current city</option>
            {locations.map((location, index) => (
              <option key={index} value={location}>
                {location}
              </option>
            ))}
          </select>
        )}
        {errors.city && (
          <p className="text-xs text-red-500 mt-0.5 block">{errors.city.message}</p>
        )}
      </div>
      <div className="mb-2 sm:mb-3">
        <label className="block text-gray-700 text-xs font-semibold mb-0.5 sm:mb-1">Gender</label>
        <select {...register("gender")} className="w-full px-1.5 sm:px-2 py-1.5 sm:py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-400 focus:border-transparent text-xs transition-all duration-200 border-gray-300 hover:border-gray-400">
          <option value="">Select your gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        {errors.gender && (
          <p className="text-xs text-red-500 mt-0.5 block">{errors.gender.message}</p>
        )}
      </div>
    </div>
  );
}
