import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FcGoogle } from "react-icons/fc";
import { Input, Button, Link, PhoneInput, Checkbox } from "../../components/ui";
import SignUpLayoutForLarge from "../../components/layout/SignUpLayoutForLarge";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../../redux/feature/authSlice";
import { toast } from "react-hot-toast";
import termsApi from "../../api/termsApi";

const BASE_URL = import.meta.env.VITE_BASE_URL;

//  Invalid personal domains (not allowed for COMPANY role)
const invalidDomains = [
  "gmail.com",
  "yahoo.com",
  "outlook.com",
  "hotmail.com",
  "protonmail.com",
  "icloud.com",
  "aol.com",
];

const schema = z
  .object({
    first_name: z
      .string()
      .min(3, { message: "First name must be at least 3 characters" }),
    last_name: z
      .string()
      .min(3, { message: "Last name must be at least 3 characters" }),
    phone: z
      .string()
      .min(10, { message: "Phone number must be at least 10 digits" })
      .regex(/^\d+$/, { message: "Phone number must contain only digits" }),
    email: z.string().email({
      message: "Please enter a valid email",
    }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .refine((value) => /[A-Z]/.test(value), {
        message: "Password must contain at least one uppercase letter",
      })
      .refine((value) => /[a-z]/.test(value), {
        message: "Password must contain at least one lowercase letter",
      })
      .refine((value) => /[0-9]/.test(value), {
        message: "Password must contain at least one number",
      })
      .refine((value) => /[^A-Za-z0-9]/.test(value), {
        message: "Password must contain at least one special character",
      }),
    user_role: z.enum(["COMPANY", "STUDENT", "UNIVERSITY"], {
      required_error: "Role is required",
    }),
    accepted_terms: z.literal(true, {
      errorMap: () => ({
        message: "You must accept the Terms and Conditions to register.",
      }),
    }),
  })
  .refine(
    (data) => {
      if (data.user_role === "COMPANY") {
        const emailDomain = data.email.split("@")[1]?.toLowerCase();
        return emailDomain && !invalidDomains.includes(emailDomain);
      }
      return true;
    },
    {
      path: ["email"],
      message:
        "Company email must use an official domain (e.g., yourcompany.com)",
    }
  );

export default function SignUp() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const locationState = location.state || {};
  const selectedRole = locationState.selectedRole || "STUDENT";
  const prefilledData = locationState.prefilledData || {
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    password: "",
    user_role: selectedRole,
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: prefilledData,
  });

  const [termsContent, setTermsContent] = useState("");

  useEffect(() => {
    const loadTerms = async () => {
      try {
        const data = await termsApi.getTermsAndCondition();
        setTermsContent(
          data.terms_and_condition || "No terms available at the moment."
        );
      } catch (error) {
        console.error("Failed to preload terms:", error);
        setTermsContent(
          "Failed to load Terms and Conditions. Please try again later."
        );
      }
    };

    loadTerms();
  }, []);

  const [showTermsModal, setShowTermsModal] = useState(false);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && showTermsModal) {
        setShowTermsModal(false);
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [showTermsModal]);

  const onSubmit = async (data) => {
    try {
      const resultAction = await dispatch(
        signup({
          first_name: data.first_name,
          last_name: data.last_name,
          phone: data.phone,
          email: data.email,
          password: data.password,
          user_role: data.user_role,
          // accepted_terms_at: new Date().toISOString(),
          accepted_terms: true,
        })
      );
      if (signup.rejected.match(resultAction)) {
        return; // signup failed
      }
      toast.success("OTP sent to your email!", { duration: 3000 });
      navigate("/signup-verify-otp-email", {
        state: {
          ...data,
        },
      });
    } catch (err) {
      alert(
        "Registration successful but failed to send OTP. Please try again."
      );
    }
  };

  useEffect(() => {
    if (!location.state?.selectedRole) {
      navigate("/signup-choose-role");
    }
  }, [location.state, navigate]);

  const [password, setPassword] = useState("");
  const [showPasswordTips, setShowPasswordTips] = useState(false);

  const handlePasswordFocus = () => {
    setShowPasswordTips(true);
  };

  const handlePasswordBlur = () => {
    if (!password) setShowPasswordTips(false);
  };

  const getPasswordChecks = (pass) => ({
    length: pass.length >= 8,
    uppercase: /[A-Z]/.test(pass),
    lowercase: /[a-z]/.test(pass),
    number: /[0-9]/.test(pass),
    special: /[^A-Za-z0-9]/.test(pass),
  });

  const getStrength = (checks) => {
    const score = Object.values(checks).filter(Boolean).length;
    if (score <= 2)
      return { label: "Weak", color: "bg-red-400", textColor: "text-red-600" };
    if (score <= 3)
      return {
        label: "Medium",
        color: "bg-yellow-400",
        textColor: "text-yellow-600",
      };
    return {
      label: "Strong",
      color: "bg-green-500",
      textColor: "text-green-600",
    };
  };

  //Google Signup use efefect
  useEffect(() => {
    const error = new URLSearchParams(window.location.search).get("error");
    if (error === "google_signup_failed") {
      toast.error("Google signup failed. Please try again.");
      navigate("/signup", { replace: true });
    }
  }, [navigate]);

  return (
    <SignUpLayoutForLarge
      heading="SignUp"
      subheading="Create an account to continue!"
      hideMobileIllustration={true}
    >
      <div className="flex flex-col items-center justify-center w-full px-0 mx-auto -mt-4 sm:max-w-sm sm:-mt-2">
        <div className="flex justify-center flex-1 w-full mt-6 md:mt-0">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-full p-4 mt-4 bg-white rounded-lg shadow-none sm:shadow-md sm:p-6 sm:max-w-sm md:max-w-md"
          >
            <input
              type="hidden"
              {...register("user_role")}
              value={selectedRole}
            />

            {/* First + Last Name */}
            <div className="flex gap-1 sm:gap-2">
              <div className="flex-1">
                <Input
                  label={
                    selectedRole === "COMPANY" || selectedRole === "UNIVERSITY"
                      ? "Representative First Name"
                      : "First Name"
                  }
                  type="text"
                  placeholder={
                    selectedRole === "COMPANY" || selectedRole === "UNIVERSITY"
                      ? "e.g., Rahul"
                      : "First Name"
                  }
                  error={errors.first_name?.message}
                  disabled={loading}
                  {...register("first_name")}
                />
              </div>
              <div className="flex-1">
                <Input
                  label={
                    selectedRole === "COMPANY" || selectedRole === "UNIVERSITY"
                      ? "Representative Last Name"
                      : "Last Name"
                  }
                  type="text"
                  placeholder={
                    selectedRole === "COMPANY" || selectedRole === "UNIVERSITY"
                      ? "e.g., Kumar"
                      : "Last Name"
                  }
                  error={errors.last_name?.message}
                  disabled={loading}
                  {...register("last_name")}
                />
              </div>
            </div>

            {/* Phone */}
            <PhoneInput
              label="Phone Number"
              error={errors.phone?.message}
              disabled={loading}
              {...register("phone")}
            />

            {/* Email */}
            <Input
              label={
                selectedRole === "COMPANY" || selectedRole === "UNIVERSITY"
                  ? "Official Email ID"
                  : "Email ID"
              }
              type="email"
              placeholder="Email"
              error={errors.email?.message}
              disabled={loading}
              {...register("email")}
            />

            {/* Valid domain hint */}
            {(selectedRole === "COMPANY" || selectedRole === "UNIVERSITY") && (
              <p className="text-xs text-gray-500 mt-0.5 mb-2">
                Emails must use official organization domains
              </p>
            )}

            {/* ===== Password Field with Dynamic Validation UX ===== */}
            <div className="relative">
              <Input
                label="Password"
                type="password"
                placeholder="Create a strong password"
                error={errors.password?.message}
                disabled={loading}
                onFocus={handlePasswordFocus}
                onBlur={handlePasswordBlur}
                {...register("password", {
                  onChange: (e) => setPassword(e.target.value),
                })}
              />

              {/* Dynamic Tips Panel — Only show when focused or has value */}
              {(showPasswordTips || password) && (
                <div className="p-3 mt-3 border border-gray-200 rounded-lg bg-gray-50">
                  {/* Strength Meter */}
                  {password && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-700">
                          Password strength
                        </span>
                        <span
                          className={`text-xs font-semibold ${
                            getStrength(getPasswordChecks(password)).textColor
                          }`}
                        >
                          {getStrength(getPasswordChecks(password)).label}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            getStrength(getPasswordChecks(password)).color
                          }`}
                          style={{
                            width: `${
                              (Object.values(
                                getPasswordChecks(password)
                              ).filter(Boolean).length /
                                5) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Checklist */}
                  <div className="space-y-2">
                    {[
                      { key: "length", label: "At least 8 characters" },
                      { key: "uppercase", label: "One uppercase letter (A-Z)" },
                      { key: "lowercase", label: "One lowercase letter (a-z)" },
                      { key: "number", label: "One number (0-9)" },
                      {
                        key: "special",
                        label: "One special character (!@#$%^&*)",
                      },
                    ].map((rule) => {
                      const isMet = getPasswordChecks(password)[rule.key];
                      return (
                        <div
                          key={rule.key}
                          className="flex items-center text-[11px]"
                        >
                          <span
                            className={`mr-2 ${
                              isMet ? "text-green-500" : "text-gray-400"
                            }`}
                          >
                            {isMet ? "✅" : "⚪"}
                          </span>
                          <span
                            className={
                              isMet
                                ? "text-green-600 line-through"
                                : "text-gray-600"
                            }
                          >
                            {rule.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Terms & Conditions Checkbox — Mandatory */}
            <div className="mt-4 mb-2">
              <label className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 mt-1 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  {...register("accepted_terms")}
                />
                <span className="text-sm text-gray-700">
                  I agree to the{" "}
                  {/* <Link
                    to="/terms-and-conditions"
                    // target="_blank"
                    // rel="noopener noreferrer"
                    className="font-medium text-blue-600 hover:underline"
                    onClick={(e) => e.stopPropagation()} // Prevent checkbox toggle
                    state={{ content: termsContent }} 
                  >
                    Terms and Conditions
                  </Link> */}
                  <button
                    type="button"
                    onClick={() => setShowTermsModal(true)}
                    className="font-medium text-blue-600 hover:underline bg-transparent border-none cursor-pointer p-0 text-sm"
                  >
                    Terms and Conditions
                  </button>
                </span>
              </label>
              {errors.accepted_terms && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.accepted_terms.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              loading={loading}
              disabled={loading}
              className="w-full mt-2"
            >
              {loading ? "Creating Account..." : "Register"}
            </Button>

            {error && (
              <div className="p-2 mb-2 text-xs text-center text-red-500 rounded-md bg-red-50">
                {error}
              </div>
            )}

            {/* Divider */}
            <div className="flex items-center my-2">
              <div className="flex-grow h-px bg-gray-300"></div>
              <span className="mx-2 text-xs font-medium text-gray-400">Or</span>
              <div className="flex-grow h-px bg-gray-300"></div>
            </div>

            {/* Google SignUp */}
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={() => {
                window.location.href = `${BASE_URL}/users/google?state=signup_${selectedRole}`;
              }}
              className="flex items-center justify-center w-full"
            >
              <FcGoogle size={14} className="mr-1.5" />
              <span className="text-xs">Sign up with Google</span>
            </Button>

            <p className="mt-3 text-xs text-center text-gray-600">
              Already have an account?{" "}
              <Link to="/login" variant="primary">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Terms Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="relative w-full max-w-3xl p-6 bg-white rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setShowTermsModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Title */}
            <h2 className="mb-4 text-xl font-bold text-gray-800">
              Terms and Conditions
            </h2>

            {/* Content */}
            <div
              className="text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: termsContent.replace(/\n/g, "<br />"),
              }}
            />

            {/* Close Button (Bottom) */}
            <div className="mt-6 text-center">
              <Button
                onClick={() => setShowTermsModal(false)}
                variant="outline"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </SignUpLayoutForLarge>
  );
}
