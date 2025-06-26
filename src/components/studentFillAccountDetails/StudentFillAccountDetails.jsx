import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import PersonalInfo from "./PersonalInfo";
import EducationInfo from "./EducationInfo";
import ProgressBar from "./ProgressBar";
import SignUpLayout from "./SignUpLayout";
import SkillsForm from "./SkillsForm";
import PreferencesForm from "./PreferencesForm";

const steps = [
  "Personal Info",
  "Education Info",
  "Your Skills",
  "Your Preferences",
];

export default function StudentFillAccountDetails() {
  const methods = useForm({ mode: "onTouched" });
  const [step, setStep] = useState(0);

  const onNext = async () => {
    console.log("onNext called, current step:", step);
    // Skip validation on Skills step (step 2) since it doesn't have registered fields
    if (step === 2) {
      console.log("Skipping validation for Skills step");
      setStep((s) => s + 1);
      return;
    }

    const valid = await methods.trigger();
    console.log("Validation result:", valid);
    if (valid && step < steps.length - 1) setStep((s) => s + 1);
  };
  const onBack = () => setStep((s) => s - 1);

  const handleSubmitClick = () => {
    console.log("Submit button clicked");
    alert("Form submitted!");
    // You can handle the final submission here
  };

  const onSubmit = (data) => {
    console.log("onSubmit called, current step:", step);
    // This function should not show the alert anymore
    // It will be called by react-hook-form validation
    return false;
  };

  return (
    <SignUpLayout
      heading="Create a New Account"
      subheading="Join us and find your dream job or recruit talented candidates."
    >
      <ProgressBar currentStep={step} steps={steps} />
      <FormProvider {...methods}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log("Form submit event prevented");
          }}
        >
          {step === 0 && (
            <PersonalInfo
              register={methods.register}
              errors={methods.formState.errors}
            />
          )}
          {step === 1 && (
            <EducationInfo
              register={methods.register}
              errors={methods.formState.errors}
              watch={methods.watch}
            />
          )}
          {step === 2 && <SkillsForm />}
          {step === 3 && <PreferencesForm />}
          <div className="flex justify-between mt-8">
            {step > 0 ? (
              <button
                type="button"
                onClick={onBack}
                className="px-6 py-2 rounded bg-gray-200 text-gray-700 font-semibold"
              >
                Back
              </button>
            ) : (
              <div />
            )}
            {step < steps.length - 1 ? (
              <button
                type="button"
                onClick={onNext}
                className="px-6 py-2 rounded bg-blue-500 text-white font-semibold"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmitClick}
                className="px-6 py-2 rounded bg-green-500 text-white font-semibold"
              >
                Submit
              </button>
            )}
          </div>
        </form>
      </FormProvider>
    </SignUpLayout>
  );
}
