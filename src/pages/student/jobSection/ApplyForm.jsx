import { useState } from 'react';
import { useApplyToJob } from '../../../hooks/useApplyToJob';
import ErrorMessage from '../../../components/ui/ErrorMessage';
import SuccessMessage from '../../../components/ui/SuccessMessage';

export default function ApplyForm({ jobId, onClose, onSubmit }) {
    const [formErrors, setFormErrors] = useState({});
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [formData, setFormData] = useState({
        why_should_we_hire_you: '',
        project: '',
        github_link: '',
        portfolio_link: '',
        confirm_availability: false,
    });

    const {
        applyToJob,
        loading: applyLoading,
        error: applyError,
    } = useApplyToJob();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const applicationData = {
                ...formData,
                // Ensure confirm_availability is a boolean
                confirm_availability: Boolean(formData.confirm_availability)
            };

            // Pass jobId and applicationData separately
            const result = await applyToJob(jobId, applicationData);
            
            if (!result?.success) {
                throw new Error(result?.message || 'Failed to submit application');
            }

            setSubmitSuccess(true);
            
            if (onSubmit) {
                onSubmit(applicationData);
            }

            // Reset form and close after 2 seconds
            setTimeout(() => {
                setFormData({
                    why_should_we_hire_you: '',
                    project: '',
                    github_link: '',
                    portfolio_link: '',
                    confirm_availability: false,
                });
                onClose();
            }, 2000);
        } catch (error) {
            console.error('Application failed:', error);
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.why_should_we_hire_you.trim()) {
            errors.why_should_we_hire_you = 'This field is required';
        }
        if (!formData.project.trim()) {
            errors.project = 'Please provide project details';
        }
        if (!formData.confirm_availability) {
            errors.confirm_availability = 'Please confirm your availability';
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));

        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    return (
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="mb-4">
                <h2 className="text-xl font-bold">Apply for this Position</h2>
            </div>

            {applyError && (
                <ErrorMessage className="mb-2 text-lg">
                    {applyError}
                </ErrorMessage>
            )}
            {submitSuccess && (
                <SuccessMessage className="mb-2">
                    Application submitted successfully!
                </SuccessMessage>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Why Hire */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Why should we hire you? <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        name="why_should_we_hire_you"
                        value={formData.why_should_we_hire_you}
                        onChange={handleInputChange}
                        rows={4}
                        className={`w-full px-3 py-2 border rounded-md ${formErrors.why_should_we_hire_you ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="Explain why you're a great fit..."
                        disabled={applyLoading}
                    />
                    {formErrors.why_should_we_hire_you && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.why_should_we_hire_you}</p>
                    )}
                </div>

                {/* Project */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Project Details <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="project"
                        value={formData.project}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md ${formErrors.project ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="Briefly describe a project..."
                        disabled={applyLoading}
                    />
                    {formErrors.project && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.project}</p>
                    )}
                </div>

                {/* GitHub */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">GitHub Link</label>
                    <input
                        type="url"
                        name="github_link"
                        value={formData.github_link}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="https://github.com/username/project"
                        disabled={applyLoading}
                    />
                </div>

                {/* Portfolio */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio Link</label>
                    <input
                        type="url"
                        name="portfolio_link"
                        value={formData.portfolio_link}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="https://yourportfolio.com"
                        disabled={applyLoading}
                    />
                </div>

                {/* Availability */}
                <div className="flex items-start">
                    <div className="flex items-center h-5">
                        <input
                            id="confirm_availability"
                            name="confirm_availability"
                            type="checkbox"
                            checked={formData.confirm_availability}
                            onChange={handleInputChange}
                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                            disabled={applyLoading}
                        />
                    </div>
                    <div className="ml-3 text-sm">
                        <label htmlFor="confirm_availability" className="font-medium text-gray-700">
                            I confirm my availability <span className="text-red-500">*</span>
                        </label>
                        {formErrors.confirm_availability && (
                            <p className="mt-1 text-red-600">{formErrors.confirm_availability}</p>
                        )}
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end space-x-3 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={applyLoading}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={applyLoading}
                        className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                    >
                        {applyLoading ? 'Submitting...' : 'Submit Application'}
                    </button>
                </div>
            </form>
        </div>
    );
}
