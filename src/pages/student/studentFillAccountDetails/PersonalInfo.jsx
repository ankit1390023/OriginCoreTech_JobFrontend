import React, { useEffect } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { useSelector } from "react-redux";
import Select from 'react-select';
import { useMasterData } from "../../../hooks/master/useMasterData";
import {
  Loader,
  Input,
  PhoneInput,
} from "../../../components/ui";

export default function PersonalInfo() {
  const {
    register,
    formState: { errors },
    setValue,
    control
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

      {/* Location Dropdown */}
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
        <Controller
          name="current_location_id"
          control={control}
          rules={{ required: "Please select your city" }}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Select
              ref={ref}
              value={value ? {
                value: String(value),
                label: locations.find(l => l.id === value || l.id === Number(value))?.name
              } : null}
              onChange={(option) => {
                onChange(option ? String(option.value) : null);
              }}
              onBlur={onBlur}
              options={(Array.isArray(locations) ? locations : []).map((location) => ({
                value: String(location.id),
                label: location.name,
              }))}
              placeholder="Select your city"
              className="text-sm"
              classNamePrefix="select"
              isClearable
              isSearchable
            />
          )}
        />
        {errors.current_location_id && (
          <p className="mt-1 text-xs text-red-500">{errors.current_location_id.message}</p>
        )}
      </div>

      {/* Gender */}
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
        <Controller
          name="gender"
          control={control}
          rules={{ required: "Gender is required" }}
          render={({ field }) => (
            <Select
              {...field}
              value={field.value ? { value: field.value, label: field.value } : null}
              onChange={(option) => field.onChange(option?.value || '')}
              options={[
                { value: "Male", label: "Male" },
                { value: "Female", label: "Female" },
                { value: "Other", label: "Other" }
              ]}
              placeholder="Select gender"
              className="text-sm"
              classNamePrefix="select"
              isClearable
            />
          )}
        />
        {errors.gender && (
          <p className="mt-1 text-xs text-red-500">{errors.gender.message}</p>
        )}
      </div>
    </div>
  );
}
