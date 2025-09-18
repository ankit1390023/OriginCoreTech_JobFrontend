import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import SignUpLayout from "../../components/layout/SignUpLayout";
import {
  Input,
  Textarea,
  Button,
  ErrorMessage,
} from "../../components/ui";
import { useMasterData } from "../../hooks/master/useMasterData";
import useUploadImageApi from "../../hooks/useUploadImageApi";
import Select from "react-select";
import { useSelector, useDispatch } from "react-redux";
import { universityApi } from "../../api/university/universityApi";
import {updateUser} from "../../redux/feature/authSlice"

export default function UniversityFillDetails() {
  const [isSmallDevice, setIsSmallDevice] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { courses } = useMasterData();
  const { uploadImage, loading: uploading } = useUploadImageApi();
  const dispatch= useDispatch();

  // ✅ useForm setup
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      college_name: "",
      course_ids: [],
      profile_pic: null,
      university_logo_url: null,
      address: "",
      pincode: "",
      website_link: "",
      about: "",
      social_media_link: "",
    },
  });

  // Detect screen size
  useEffect(() => {
    const checkDeviceSize = () => setIsSmallDevice(window.innerWidth < 1024);
    checkDeviceSize();
    window.addEventListener("resize", checkDeviceSize);
    return () => window.removeEventListener("resize", checkDeviceSize);
  }, []);

  const courseOptions = Array.isArray(courses) ? courses : [];

  // ✅ File upload handlers
  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);
      try {
        const url = await uploadImage(file, "logoUrl");
        setValue("university_logo_url", url, { shouldValidate: true });
      } catch (err) {
        console.error("Logo upload failed", err);
      }
    }
  };

  const handleProfilePicUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setProfilePicPreview(previewUrl);
      try {
        const url = await uploadImage(file, "profilePic");
        setValue("profile_pic", url, { shouldValidate: true });
      } catch (err) {
        console.error("Profile pic upload failed", err);
      }
    }
  };

  // ✅ Submit
  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
    try {
      console.log("=== FORM DATA ===", JSON.stringify(data, null, 2));

      const response = await universityApi.createUniversityProfile(data, token);
      console.log("the api response", response);
      if(response.success){
       alert(response.message);
       //update the redux storing certain basic details
       dispatch(updateUser({
          user_profile_pic: response.data.profile_pic || null,
          about_us: response.data.about || null,
          organization_name: response.data.college_name || null,
          organization_logo: response.data.university_logo_url || null,
          email: response.data.User?.email ,
          phone: response.data.User?.phone,
          profile_status: 2
       })) 
       
      }
      console.log("Server response:", response.data);

      // Reset form after successful submission
      reset({
        college_name: "",
        course_ids: [],
        profile_pic: null,
        university_logo_url: null,
        address: "",
        pincode: "",
        website_link: "",
        about: "",
        social_media_link: "",
      });
      
      // Clear previews
      setLogoPreview(null);
      setProfilePicPreview(null);
      
      // Show success message or redirect if needed
      // navigate('/some-success-page');
      
    } catch (err) {
      console.error("Error saving:", err);
      setError("Failed to save university details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const FormContent = () => (
    <div className="p-6 bg-white rounded-lg shadow-md">
      {error && <ErrorMessage onClose={() => setError("")}>{error}</ErrorMessage>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* College name */}
        <Input
          label="College Name"
          placeholder="Enter college name"
          error={errors.college_name?.message}
          {...register("college_name", { required: "College name is required" })}
        />

        {/* Courses */}
        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-700">Select Courses *</label>
          <Controller
            name="course_ids"
            control={control}
            rules={{ validate: (v) => v.length > 0 || "At least one course is required" }}
            render={({ field }) => (
              <Select
                {...field}
                isMulti
                options={courseOptions}
                getOptionLabel={(o) => o.name}
                getOptionValue={(o) => o.id}
                placeholder="Select Courses"
                isSearchable
                className="text-sm"
                classNamePrefix="select"
                onChange={(selected) => field.onChange(selected.map((o) => o.id))}
                value={courseOptions.filter((o) => field.value?.includes(o.id))}
              />
            )}
          />
          {errors.course_ids && <p className="text-xs text-red-500">{errors.course_ids.message}</p>}
        </div>

        {/* Address */}
        <Textarea
          label="Address"
          placeholder="Enter complete address"
          error={errors.address?.message}
          {...register("address", { required: "Address is required" })}
        />

        {/* Pincode */}
        <Input
          label="Pincode"
          placeholder="Enter 6-digit pincode"
          maxLength={6}
          error={errors.pincode?.message}
          {...register("pincode", {
            required: "Pincode is required",
            pattern: { value: /^\d{6}$/, message: "Enter valid 6-digit pincode" },
          })}
        />

        {/* Website */}
        <Input
          label="Website Link"
          placeholder="https://www.youruniversity.edu"
          error={errors.website_link?.message}
          {...register("website_link", {
            required: "Website link is required",
            pattern: { value: /^https?:\/\//i, message: "Must start with http:// or https://" },
          })}
        />

        {/* About */}
        <Textarea
          label="About University"
          placeholder="Tell us about your university..."
          error={errors.about?.message}
          {...register("about", { required: "About is required" })}
        />       
        {/* university logo upload */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-gray-700">University Logo</label>
          <div className="flex items-center justify-between p-2 border border-gray-200 rounded">
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="text-sm"
                disabled={uploading}
              />
              {uploading && <span className="ml-2 text-xs text-blue-500">Uploading...</span>}
            </div>
            <div>
              {logoPreview && (
                <img
                  src={logoPreview}
                  alt="University Logo"
                  className="object-cover w-10 h-10 rounded"
                />
              )}
            </div>
          </div>
          {errors.logo_url && (
            <p className="text-xs text-red-500">{errors.logo_url.message}</p>
          )}
        </div>

      {/* profile pic upload */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-gray-700">Profile Picture</label>
          <div className="flex items-center justify-between p-2 border border-gray-200 rounded">
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePicUpload}
                className="text-sm"
                disabled={uploading}
              />
              {uploading && <span className="ml-2 text-xs text-blue-500">Uploading...</span>}
            </div>
            <div>
              {profilePicPreview && (
                <img
                  src={profilePicPreview}
                  alt="Profile Pic"
                  className="object-cover w-10 h-10 border rounded"
                />
              )}
            </div>
          </div>
          {errors.profile_pic && (
            <p className="text-xs text-red-500">{errors.profile_pic.message}</p>
          )}
        </div>


        {/* Social media */}
        <Input
          label="Social Media Link"
          placeholder="https://linkedin.com/company/youruniversity"
          error={errors.social_media_link?.message}
          {...register("social_media_link", {
            pattern: { value: /^https?:\/\//i, message: "Must start with http:// or https://" },
          })}
        />

        {/* Submit */}
        <Button
          variant="secondary"
          loading={loading}
          disabled={loading}
          className="w-full"
          type="submit"
        >
          {loading ? "Saving..." : "Save University Details"}
        </Button>
      </form>
    </div>
  );

  return (
    <SignUpLayout
      heading="University Details"
      subheading="Complete your university profile!"
      hideMobileIllustration={isSmallDevice}
      centerMobileContent={false}
    >
      <FormContent />
    </SignUpLayout>
  );
}
