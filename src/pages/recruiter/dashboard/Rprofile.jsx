import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Input, Label, Textarea, PhoneInput, Select, SuccessMessage, ErrorMessage } from '../../../components/ui';
import MainLayout from '../../../components/layout/MainLayout';

const Rprofile = () => {
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    designation: user?.designation || '',
    // Company Information
    companyName: user?.company?.name || '',
    companyWebsite: user?.company?.website || '',
    companySize: user?.company?.size || '',
    companyType: user?.company?.type || '',
    companyDescription: user?.company?.description || '',
    // Social Media
    linkedin: user?.social?.linkedin || '',
    twitter: user?.social?.twitter || '',
    facebook: user?.social?.facebook || '',
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const companySizes = [
    { value: '1-10', label: '1-10 employees' },
    { value: '11-50', label: '11-50 employees' },
    { value: '51-200', label: '51-200 employees' },
    { value: '201-500', label: '201-500 employees' },
    { value: '501-1000', label: '501-1000 employees' },
    { value: '1000+', label: '1000+ employees' },
  ];

  const companyTypes = [
    'IT Services',
    'Product',
    'Startup',
    'Enterprise',
    'Agency',
    'Other',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!formData.companyWebsite.trim()) {
      newErrors.companyWebsite = 'Company website is required';
    } else if (!/^https?:\/\//i.test(formData.companyWebsite)) {
      newErrors.companyWebsite = 'Please include http:// or https://';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Here you would typically make an API call to update the profile
      // await updateProfile(formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrors({ submit: 'Failed to update profile. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Recruiter Profile</h1>
        
        {success && (
          <SuccessMessage className="mb-6">
            Profile updated successfully!
          </SuccessMessage>
        )}

        {errors.submit && (
          <ErrorMessage className="mb-6">{errors.submit}</ErrorMessage>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  error={errors.firstName}
                />
                {errors.firstName && <div className="text-red-500 text-sm mt-1">{errors.firstName}</div>}
              </div>
              
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  error={errors.lastName}
                />
                {errors.lastName && <div className="text-red-500 text-sm mt-1">{errors.lastName}</div>}
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                />
                {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <PhoneInput
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor="designation">Designation</Label>
                <Input
                  id="designation"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Company Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Company Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  error={errors.companyName}
                />
                {errors.companyName && <div className="text-red-500 text-sm mt-1">{errors.companyName}</div>}
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="companyWebsite">Company Website *</Label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    https://
                  </span>
                  <Input
                    id="companyWebsite"
                    name="companyWebsite"
                    type="text"
                    value={formData.companyWebsite.replace(/^https?:\/\//, '')}
                    onChange={(e) => handleChange({
                      target: { name: 'companyWebsite', value: e.target.value }
                    })}
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md sm:text-sm border-gray-300"
                    error={errors.companyWebsite}
                  />
                </div>
                {errors.companyWebsite && <div className="text-red-500 text-sm mt-1">{errors.companyWebsite}</div>}
              </div>

              <div>
                <Label htmlFor="companySize">Company Size</Label>
                <Select
                  id="companySize"
                  name="companySize"
                  value={formData.companySize}
                  onChange={handleChange}
                  options={companySizes}
                  placeholder="Select company size"
                />
              </div>

              <div>
                <Label htmlFor="companyType">Company Type</Label>
                <Select
                  id="companyType"
                  name="companyType"
                  value={formData.companyType}
                  onChange={handleChange}
                  options={companyTypes.map(type => ({ value: type, label: type }))}
                  placeholder="Select company type"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="companyDescription">Company Description</Label>
                <Textarea
                  id="companyDescription"
                  name="companyDescription"
                  rows={4}
                  value={formData.companyDescription}
                  onChange={handleChange}
                  placeholder="Tell us about your company"
                />
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Social Media</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="linkedin">LinkedIn Profile</Label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    linkedin.com/in/
                  </span>
                  <Input
                    id="linkedin"
                    name="linkedin"
                    type="text"
                    value={formData.linkedin}
                    onChange={handleChange}
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md sm:text-sm border-gray-300"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="twitter">Twitter</Label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    twitter.com/
                  </span>
                  <Input
                    id="twitter"
                    name="twitter"
                    type="text"
                    value={formData.twitter}
                    onChange={handleChange}
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md sm:text-sm border-gray-300"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="facebook">Facebook</Label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    facebook.com/
                  </span>
                  <Input
                    id="facebook"
                    name="facebook"
                    type="text"
                    value={formData.facebook}
                    onChange={handleChange}
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md sm:text-sm border-gray-300"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default Rprofile;