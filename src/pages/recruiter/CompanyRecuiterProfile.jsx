import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { recruiterApi } from "../../api/recuiterApi";
import { useNavigate } from "react-router-dom";
import { Input, Textarea, Button, Checkbox } from "../../components/ui";
import SignUpLayout from "../../components/layout/SignUpLayout";
import { useSelector } from "react-redux";
import Select from "react-select";
import { useMasterData } from "../../hooks/master/useMasterData";
import useUploadImageApi from "../../hooks/useUploadImageApi";

const formSchema = z.object({
  designation_id: z.string().min(1, { message: "Designation is required" }),
  company_name: z.string().min(1, { message: "Company name is required" }),
  industry_id: z.string().min(1, { message: "Industry is required" }),
  company_location_id: z.string().min(1, { message: "City is required" }),
  about: z.string().min(10, { message: "About section must be at least 10 characters" }),
  logo_url: z.string().url({ message: "Invalid logo URL" }).max(500),
  profile_pic: z.string().url({ message: "Invalid profile picture URL" }).max(500),
  language_ids: z.array(z.string()).optional(),
  is_email_verified: z.boolean().default(false),
  is_phone_verified: z.boolean().default(false),
  is_gst_verified: z.boolean().default(false),
});

export default function CompanyRecruiterProfile() {
  const [logoPreview, setLogoPreview] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: {
      designation_id: "",
      company_name: "",
      industry_id: "",
      company_location_id: "",
      about: "",
      logo_url: "",
      profile_pic: "",
      language_ids: [],
      is_email_verified: false,
      is_phone_verified: false,
      is_gst_verified: false,
    },
  });

  const {
    locations = [],
    jobRoles = [],
    industries = [],
    languages = [],
    isLoading,
    isError,
  } = useMasterData();
  const { uploadImage, loading: uploading } = useUploadImageApi();

  // ✅ File Upload Handlers
  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
      try {
        const url = await uploadImage(file, "logoUrl");
        setValue("logo_url", url);
      } catch (err) {
        console.error("Logo upload failed", err);
      }
    }
  };

  const handleProfilePicUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicPreview(URL.createObjectURL(file));
      try {
        const url = await uploadImage(file, "profilePic");
        setValue("profile_pic", url);
      } catch (err) {
        console.error("Profile pic upload failed", err);
      }
    }
  };

  const onSubmit = async (data) => {
    console.log("Original Form Data:", data);

    // ✅ Convert string IDs to integers for API
    const apiData = {
      ...data,
      designation_id: parseInt(data.designation_id, 10),
      industry_id: parseInt(data.industry_id, 10),
      company_location_id: parseInt(data.company_location_id, 10),
      language_ids: data.language_ids?.map(id => parseInt(id, 10)) || [],
    };
   
    console.log("API Data (with integers):", apiData);

    try {
      if (!token) {
        alert("Authentication token missing. Please log in again.");
        return;
      }
      const response = await recruiterApi.createProfile(apiData, token);

      if (response && response.profile) {
        alert("Profile created successfully");
        reset();
        navigate("/recruiter-dashboard");
      } else {
        alert("Failed to create profile");
      }
    } catch (error) {
      if (error.response) {
        console.error("API Error:", error.response.data);
        alert("Error: " + (error.response.data?.message || JSON.stringify(error.response.data)));
      } else {
        alert("An error occurred while creating the profile");
        console.error(error);
      }
    }
  };

  return (
    <SignUpLayout
      heading="Create Company Profile"
      subheading="Set up your company recruiter profile to start posting jobs and internships."
      hideMobileIllustration={true}
    >
      <div className="relative shadow-md flex w-full min-h-screen overflow-hidden md:items-center md:justify-center">
        <div className="flex justify-center flex-1 w-full md:mt-0">
          <div className="w-full max-w-full p-6 bg-white shadow-md rounded-xl sm:shadow-xl sm:max-w-2xl sm:p-8">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
              noValidate
            >
              {/* ===== Designation ===== */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-700">Designation</label>
                <Controller
                  name="designation_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      value={
                        field.value
                          ? {
                            value: String(field.value),
                            label: jobRoles.find((j) => String(j.id) === String(field.value))?.title,
                          }
                          : null
                      }
                      onChange={(opt) => field.onChange(opt ? String(opt.value) : "")}
                      options={jobRoles.map((j) => ({ value: String(j.id), label: j.title }))}
                      placeholder="Select your designation"
                      isClearable
                      isSearchable
                      className="text-sm"
                    />
                  )}
                />
                {errors.designation_id && (
                  <p className="text-xs text-red-500">{errors.designation_id.message}</p>
                )}
              </div>

              {/* ===== Company Name ===== */}
              <div className="space-y-1">
                <Input
                  label="Company Name"
                  required
                  placeholder="e.g., Tech Solutions Inc."
                  error={errors.company_name?.message}
                  className="text-sm"
                  {...register("company_name")}
                />
              </div>

              {/* ===== Industry ===== */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-700">Industry</label>
                <Controller
                  name="industry_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      value={
                        field.value
                          ? {
                            value: String(field.value),
                            label: industries.find((i) => String(i.id) === String(field.value))?.name,
                          }
                          : null
                      }
                      onChange={(opt) => field.onChange(opt ? String(opt.value) : "")}
                      options={industries.map((i) => ({ value: String(i.id), label: i.name }))}
                      placeholder="Select your industry"
                      isClearable
                      isSearchable
                      className="text-sm"
                    />
                  )}
                />
                {errors.industry_id && (
                  <p className="text-xs text-red-500">{errors.industry_id.message}</p>
                )}
              </div>

              {/* ===== Company Location ===== */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-700">Company Location</label>
                <Controller
                  name="company_location_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      value={
                        field.value
                          ? {
                            value: String(field.value),
                            label: locations.find((l) => String(l.id) === String(field.value))?.name,
                          }
                          : null
                      }
                      onChange={(opt) => field.onChange(opt ? String(opt.value) : "")}
                      options={locations.map((l) => ({ value: String(l.id), label: l.name }))}
                      placeholder="Select company location"
                      isClearable
                      isSearchable
                      className="text-sm"
                    />
                  )}
                />
                {errors.company_location_id && (
                  <p className="text-xs text-red-500">{errors.company_location_id.message}</p>
                )}
              </div>

              {/* ===== About ===== */}
              <div className="space-y-1">
                <Textarea
                  label="About Company"
                  required
                  placeholder="Describe your company..."
                  error={errors.about?.message}
                  className="text-sm"
                  {...register("about")}
                />
              </div>

              {/* ===== File Uploads ===== */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-700">Company Logo</label>
                <div className="flex items-center justify-between border border-gray-200 p-2 rounded">
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="text-sm"
                      disabled={uploading}
                    />
                    {uploading && <span className="text-xs text-blue-500 ml-2">Uploading...</span>}
                  </div>
                  <div>
                    {logoPreview && (
                      <img
                        src={logoPreview}
                        alt="Company Logo"
                        className="w-10 h-10 object-cover rounded"
                      />
                    )}
                  </div>
                </div>
                {errors.logo_url && (
                  <p className="text-xs text-red-500">{errors.logo_url.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-700">Profile Picture</label>
                <div className="flex items-center justify-between border border-gray-200 p-2 rounded">
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePicUpload}
                      className="text-sm"
                      disabled={uploading}
                    />
                    {uploading && <span className="text-xs text-blue-500 ml-2">Uploading...</span>}
                  </div>
                  <div>
                    {profilePicPreview && (
                      <img
                        src={profilePicPreview}
                        alt="Profile Pic"
                        className="w-10 h-10 object-cover rounded border"
                      />
                    )}
                  </div>
                </div>
                {errors.profile_pic && (
                  <p className="text-xs text-red-500">{errors.profile_pic.message}</p>
                )}
              </div>

              {/* ===== Languages ===== */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-700">Languages (Optional)</label>
                <Controller
                  name="language_ids"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      isMulti
                      value={languages
                        .filter((l) => field.value?.includes(String(l.id)))
                        .map((l) => ({
                          value: String(l.id),
                          label: l.name,
                        }))}
                      onChange={(opts) =>
                        field.onChange(opts ? opts.map((o) => String(o.value)) : [])
                      }
                      options={languages.map((l) => ({ value: String(l.id), label: l.name }))}
                      placeholder="Select languages"
                      isClearable
                      isSearchable
                      className="text-sm"
                    />
                  )}
                />
              </div>

              {/* ===== Verification Checkboxes ===== */}
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3 text-sm">
                <Checkbox
                  id="is_email_verified"
                  label="Email Verified"
                  {...register("is_email_verified")}
                />
                <Checkbox
                  id="is_phone_verified"
                  label="Phone Verified"
                  {...register("is_phone_verified")}
                />
                <Checkbox
                  id="is_gst_verified"
                  label="GST Verified"
                  {...register("is_gst_verified")}
                />
              </div>

              {/* ===== Submit Button ===== */}
              <div className="flex justify-end gap-4 pt-4 mt-6 border-t border-gray-200">
                <Button
                  type="submit"
                  loading={isSubmitting || uploading}
                  disabled={isSubmitting || uploading}
                >
                  {isSubmitting ? "Creating Profile..." : "Create Profile"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </SignUpLayout>
  );
}