import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import { useMasterData } from "../../../hooks/master/useMasterData";
import {
  Loader,
  Input,
  Select,
  PhoneInput,
} from "../../../components/ui";

export default function PersonalInfo() {
  const {
    register,
    formState: { errors },
    setValue,
  } = useFormContext();

  const { user } = useSelector((state) => state.auth);

  // Get master data with proper destructuring
  const {
    locations = [],
    isLoading,
    isError,
    error,
    refetch
  } = useMasterData();
  console.log("locations", locations)
  // Pre-fill user data into form if available
  useEffect(() => {
    if (user) {
      if (user.first_name) setValue("first_name", user.first_name);
      if (user.last_name) setValue("last_name", user.last_name);
      if (user.email) setValue("email", user.email);
      if (user.phone) setValue("phone", user.phone);
    }
  }, [user, setValue]);

  // Reusable error message with retry button
  const CustomErrorMessage = ({ message, onRetry }) => (
    <div className="w-full p-3 border rounded bg-red-50 text-red-500 text-xs">
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button
          onClick={onRetry}
          className="ml-2 px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );

  if (isLoading) {
    return <Loader className="mx-auto my-8" />;
  }

  if (isError) {
    return (
      <CustomErrorMessage
        message={error?.message || 'Failed to load required data'}
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="space-y-2 sm:space-y-3">
      {/* First + Last Name */}
      <div className="flex gap-1 sm:gap-2">
        <div className="flex-1">
          <Input
            label="First Name"
            placeholder="Enter your first name"
            error={errors.first_name?.message}
            {...register("first_name")}
          />
        </div>
        <div className="flex-1">
          <Input
            label="Last Name"
            placeholder="Enter your last name"
            error={errors.last_name?.message}
            {...register("last_name")}
          />
        </div>
      </div>

      {/* Email */}
      <Input
        label="Email ID"
        type="email"
        placeholder="example@email.com"
        error={errors.email?.message}
        className="bg-gray-50 cursor-not-allowed"
        readOnly
        {...register("email")}
      />

      {/* Phone */}
      <PhoneInput
        label="Phone Number"
        type="tel"
        placeholder="98765 43210"
        error={errors.phone?.message}
        {...register("phone")}
      />

      {/* Date of Birth */}
      <Input
        label="Date of Birth"
        type="date"
        placeholder="Select your date of birth"
        error={errors.dob?.message}
        {...register("dob")}
      />

      {/* Location Dropdown - Example of using locations from master data */}
      <div className="w-full">
        {isLoading ? (
          <div className="py-2">
            <Loader message="Loading locations..." />
          </div>
        ) : isError ? (
          <CustomErrorMessage message={error?.message || 'Failed to load locations'} onRetry={refetch} />
        ) : (
          <Select
            label="City"
            id="city"
            placeholder="Select your city"
            options={locations.map((location) => ({
              value: location.id,
              label: location.name,
            }))}
            defaultValue=""
            {...register("city", {
              required: "Please select your city",
            })}
            error={errors.city?.message}
          />
        )}
      </div>
      {/* Gender */}
      <Select
        label="Gender"
        {...register("gender", { required: "Gender is required" })}
        options={[
          { value: "Male", label: "Male" },
          { value: "Female", label: "Female" },
          { value: "Other", label: "Other" }
        ]}
        placeholder="Select gender"
        error={errors.gender?.message}
      />
    </div>
  );
}
