import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useLocations } from "../../../hooks/useLocations";
import { Loader, Input, Select, Label, ErrorMessage, PhoneInput } from "../../../components/ui";
import { useSelector } from "react-redux";

export default function PersonalInfo() {
  const {
    register,
    formState: { errors },
    setValue,
  } = useFormContext();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      if (user.firstName) setValue("firstName", user.firstName);
      if (user.lastName) setValue("lastName", user.lastName);
      if (user.email) setValue("email", user.email);
      if (user.phone) setValue("phone", user.phone);
    }
  }, [user, setValue]);
  const {
    data: locationData,
    loading: locationLoading,
    error: locationError,
    refetch: refetchLocations,
  } = useLocations();
  const locations = Array.isArray(locationData?.data) ? locationData.data : [];

  const CustomErrorMessage = ({ message }) => (
    <div className="w-full p-3 border rounded bg-red-50 text-red-500 text-xs">
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button
          onClick={refetchLocations}
          className="ml-2 px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-2 sm:space-y-3">
      <div className="flex gap-1 sm:gap-2">
        <div className="flex-1">
          <Input
            label="First Name"
            placeholder="Enter your first name"
            error={errors.firstName?.message}
            {...register("firstName")}
          />
        </div>
        <div className="flex-1">
          <Input
            label="Last Name"
            placeholder="Enter your last name"
            error={errors.lastName?.message}
            {...register("lastName")}
          />
        </div>
      </div>
      <Input
        label="Email ID"
        type="email"
        placeholder="example@email.com"
        error={errors.email?.message}
        className="bg-gray-50 cursor-not-allowed"
        readOnly
        {...register("email")}
      />
      <PhoneInput
        label="Phone Number"
        type="tel"
        placeholder="98765 43210"
        error={errors.phone?.message}
        {...register("phone")}
      />
      <Input
        label="Date of Birth"
        type="date"
        placeholder="Select your date of birth"
        error={errors.dob?.message}
        {...register("dob")}
      />
      {locationLoading ? (
        <Loader message="Loading locations..." />
      ) : locationError ? (
        <CustomErrorMessage message={locationError} />
      ) : (
        <Select
          label="City"
          options={locations.map(location => ({ 
            value: location.name || location.id, 
            label: location.name || location.id 
          }))}
          placeholder="Select your current city"
          error={errors.city?.message}
          {...register("city")}
        />
      )}
      <Select
        label="Gender"
        options={[
          { value: "Male", label: "Male" },
          { value: "Female", label: "Female" },
          { value: "Other", label: "Other" }
        ]}
        placeholder="Select your gender"
        error={errors.gender?.message}
        {...register("gender", { required: "Gender is required" })}
      />
    </div>
  );
}
