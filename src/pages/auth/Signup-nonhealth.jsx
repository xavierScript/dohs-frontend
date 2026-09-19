import { useState, useEffect } from "react";
import hero from "../../assets/register2.png";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import open from "../../assets/open-eye.png";
import close from "../../assets/close-eye.png";
import negative from "../../assets/x-mark.png";
import positive from "../../assets/check.png";
import { Link } from "react-router-dom";
import axios from "axios";

const NonHealthSignUp = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    location: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  //frontend State Validation
  const [isFormValid, setIsFormValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState({
    first_name: { message: "First name is required", valid: false },
    last_name: { message: "Last name is required", valid: false },
    email: { message: "Invalid email", valid: false },
    phone_number: { message: "Phone number is required", valid: false },
    location: { message: "Location is required", valid: false },
    password: {
      message:
        "Password must be at least 8 characters long and contain an uppercase letter, a number, and a special character",
      valid: false,
    },
    confirmPassword: { message: "Passwords do not match", valid: false },
    terms: {
      message: "You must agree to the terms and conditions",
      valid: false,
    },
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Handler for input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: fieldValue,
    }));

    validateField(name, fieldValue);
  };

  // Validation functions
  const validateField = (name, value) => {
    let updatedErrors = { ...errors };

    switch (name) {
      case "first_name":
        updatedErrors.first_name = {
          message: "First name is required",
          valid: value.trim() !== "",
        };
        break;

      case "last_name":
        updatedErrors.last_name = {
          message: "Last name is required",
          valid: value.trim() !== "",
        };
        break;

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        updatedErrors.email = {
          message: "Invalid email",
          valid: emailRegex.test(value),
        };
        break;

      case "phone_number":
        const phoneRegex = /^[0-9+\-\s()]{10,15}$/;
        updatedErrors.phone_number = {
          message: "Phone number must be 10-15 digits",
          valid: phoneRegex.test(value.replace(/\s/g, "")),
        };
        break;

      case "location":
        updatedErrors.location = {
          message: "Location is required",
          valid: value.trim() !== "",
        };
        break;

      case "password":
        const passwordRegex =
          /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\W]{8,}$/;
        updatedErrors.password = {
          message:
            "Password must be at least 8 characters long and contain an uppercase letter, a number, and a special character",
          valid: passwordRegex.test(value),
        };
        break;

      case "confirmPassword":
        updatedErrors.confirmPassword = {
          message: "Passwords do not match",
          valid: value === formData.password,
        };
        break;

      case "terms":
        updatedErrors.terms = {
          message: "You must agree to the terms and conditions",
          valid: value === true,
        };
        break;

      default:
        break;
    }

    setErrors(updatedErrors);
  };

  // Check if form is valid
  useEffect(() => {
    const allFieldsValid = Object.values(errors).every((error) => error.valid);
    setIsFormValid(allFieldsValid);
  }, [errors]);

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    // Validate all fields before submission
    Object.keys(formData).forEach((key) => {
      if (key !== "confirmPassword") {
        validateField(key, formData[key]);
      }
    });

    if (!isFormValid) {
      setError("Please fill out all required fields correctly.");
      setIsLoading(false);
      return;
    }

    try {
      // Prepare data for API (exclude confirmPassword and terms)
      const { confirmPassword, terms, ...apiData } = formData;

      console.log("Submitting data:", apiData);

      const response = await axios.post(
        "https://backend.onehealth-wwrg.com/api/v1/non-health/signup",
        apiData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setSuccess("Account created successfully! You can now log in.");

        // Reset form
        setFormData({
          first_name: "",
          last_name: "",
          email: "",
          phone_number: "",
          location: "",
          password: "",
          confirmPassword: "",
          terms: false,
        });

        // Redirect to login after 2 seconds
        setTimeout(() => {
          window.location.href = "/non-health-login";
        }, 2000);
      }
    } catch (error) {
      console.error("Signup failed:", error);
      if (error.response) {
        setError(
          error.response.data.message ||
            error.response.data.error ||
            "An error occurred during signup. Please try again."
        );
      } else {
        setError("Network error. Please check your connection and try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center mt-50">
        <div className="flex flex-col md:flex-row w-full max-w-6xl mt-32 mb-10 px-4">
          <div className="lg:block">
            <img
              src={hero}
              alt="Registration"
              className="w-full md:w-full max-w-full lg:block"
            />
          </div>
          <form
            className="flex flex-col justify-center p-6 md:p-8 w-full md:w-1/2 lg:w-1/2 text-left gap-6"
            onSubmit={handleSubmit}
          >
            <h2 className="text-2xl md:text-3xl font-semibold text-secondary mb-4">
              Create Non-Health Worker Account
            </h2>

            {/* First Name */}
            <div className="flex flex-col mb-4 relative">
              <label
                className="text-gray-700 text-xs absolute -top-3 left-3 bg-white p-1"
                htmlFor="first_name"
              >
                First Name *
              </label>
              <input
                id="first_name"
                className={`p-2 mb-2 border-2 rounded-lg w-full focus:outline-none ${
                  errors.first_name.valid
                    ? "border-green focus:border-green"
                    : formData.first_name
                    ? "border-red-500 focus:border-red-500"
                    : "border-secondary focus:border-green"
                }`}
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="Enter your first name"
                required
              />
              <div className="flex items-center">
                {formData.first_name && (
                  <img
                    src={errors.first_name.valid ? positive : negative}
                    alt="validation"
                    className="w-4 h-4 mr-2"
                  />
                )}
                {formData.first_name && !errors.first_name.valid && (
                  <span className="text-red-500 text-xs">
                    {errors.first_name.message}
                  </span>
                )}
              </div>
            </div>

            {/* Last Name */}
            <div className="flex flex-col mb-4 relative">
              <label
                className="text-gray-700 text-xs absolute -top-3 left-3 bg-white p-1"
                htmlFor="last_name"
              >
                Last Name *
              </label>
              <input
                id="last_name"
                className={`p-2 mb-2 border-2 rounded-lg w-full focus:outline-none ${
                  errors.last_name.valid
                    ? "border-green focus:border-green"
                    : formData.last_name
                    ? "border-red-500 focus:border-red-500"
                    : "border-secondary focus:border-green"
                }`}
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Enter your last name"
                required
              />
              <div className="flex items-center">
                {formData.last_name && (
                  <img
                    src={errors.last_name.valid ? positive : negative}
                    alt="validation"
                    className="w-4 h-4 mr-2"
                  />
                )}
                {formData.last_name && !errors.last_name.valid && (
                  <span className="text-red-500 text-xs">
                    {errors.last_name.message}
                  </span>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col mb-4 relative">
              <label
                className="text-gray-700 text-xs absolute -top-3 left-3 bg-white p-1"
                htmlFor="email"
              >
                Email *
              </label>
              <input
                id="email"
                className={`p-2 mb-2 border-2 rounded-lg w-full focus:outline-none ${
                  errors.email.valid
                    ? "border-green focus:border-green"
                    : formData.email
                    ? "border-red-500 focus:border-red-500"
                    : "border-secondary focus:border-green"
                }`}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
              <div className="flex items-center">
                {formData.email && (
                  <img
                    src={errors.email.valid ? positive : negative}
                    alt="validation"
                    className="w-4 h-4 mr-2"
                  />
                )}
                {formData.email && !errors.email.valid && (
                  <span className="text-red-500 text-xs">
                    {errors.email.message}
                  </span>
                )}
              </div>
            </div>

            {/* Phone Number */}
            <div className="flex flex-col mb-4 relative">
              <label
                className="text-gray-700 text-xs absolute -top-3 left-3 bg-white p-1"
                htmlFor="phone_number"
              >
                Phone Number *
              </label>
              <input
                id="phone_number"
                className={`p-2 mb-2 border-2 rounded-lg w-full focus:outline-none ${
                  errors.phone_number.valid
                    ? "border-green focus:border-green"
                    : formData.phone_number
                    ? "border-red-500 focus:border-red-500"
                    : "border-secondary focus:border-green"
                }`}
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
              />
              <div className="flex items-center">
                {formData.phone_number && (
                  <img
                    src={errors.phone_number.valid ? positive : negative}
                    alt="validation"
                    className="w-4 h-4 mr-2"
                  />
                )}
                {formData.phone_number && !errors.phone_number.valid && (
                  <span className="text-red-500 text-xs">
                    {errors.phone_number.message}
                  </span>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="flex flex-col mb-4 relative">
              <label
                className="text-gray-700 text-xs absolute -top-3 left-3 bg-white p-1"
                htmlFor="location"
              >
                Location *
              </label>
              <input
                id="location"
                className={`p-2 mb-2 border-2 rounded-lg w-full focus:outline-none ${
                  errors.location.valid
                    ? "border-green focus:border-green"
                    : formData.location
                    ? "border-red-500 focus:border-red-500"
                    : "border-secondary focus:border-green"
                }`}
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter your location"
                required
              />
              <div className="flex items-center">
                {formData.location && (
                  <img
                    src={errors.location.valid ? positive : negative}
                    alt="validation"
                    className="w-4 h-4 mr-2"
                  />
                )}
                {formData.location && !errors.location.valid && (
                  <span className="text-red-500 text-xs">
                    {errors.location.message}
                  </span>
                )}
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col mb-4 relative">
              <label
                className="text-gray-700 text-xs absolute -top-3 left-3 bg-white p-1"
                htmlFor="password"
              >
                Password *
              </label>
              <input
                id="password"
                className={`p-2 mb-2 border-2 rounded-lg w-full focus:outline-none ${
                  errors.password.valid
                    ? "border-green focus:border-green"
                    : formData.password
                    ? "border-red-500 focus:border-red-500"
                    : "border-secondary focus:border-green"
                }`}
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-secondary"
                onClick={togglePasswordVisibility}
              >
                <img src={showPassword ? close : open} alt="toggle password" />
              </button>
              <div className="flex items-center">
                {formData.password && (
                  <img
                    src={errors.password.valid ? positive : negative}
                    alt="validation"
                    className="w-4 h-4 mr-2"
                  />
                )}
                {formData.password && !errors.password.valid && (
                  <span className="text-red-500 text-xs">
                    {errors.password.message}
                  </span>
                )}
              </div>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col mb-4 relative">
              <label
                className="text-gray-700 text-xs absolute -top-3 left-3 bg-white p-1"
                htmlFor="confirmPassword"
              >
                Confirm Password *
              </label>
              <input
                id="confirmPassword"
                className={`p-2 mb-2 border-2 rounded-lg w-full focus:outline-none ${
                  errors.confirmPassword.valid
                    ? "border-green focus:border-green"
                    : formData.confirmPassword
                    ? "border-red-500 focus:border-red-500"
                    : "border-secondary focus:border-green"
                }`}
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-secondary"
                onClick={toggleConfirmPasswordVisibility}
              >
                <img
                  src={showConfirmPassword ? close : open}
                  alt="toggle password"
                />
              </button>
              <div className="flex items-center">
                {formData.confirmPassword && (
                  <img
                    src={errors.confirmPassword.valid ? positive : negative}
                    alt="validation"
                    className="w-4 h-4 mr-2"
                  />
                )}
                {formData.confirmPassword && !errors.confirmPassword.valid && (
                  <span className="text-red-500 text-xs">
                    {errors.confirmPassword.message}
                  </span>
                )}
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="terms"
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
                className="mr-2"
                required
              />
              <label htmlFor="terms" className="text-sm">
                I agree to the{" "}
                <Link to="/terms" className="text-green underline">
                  Terms and Conditions
                </Link>
              </label>
            </div>

            {/* Error and Success Messages */}
            {error && (
              <p className="text-red-500 text-center text-sm">{error}</p>
            )}
            {success && (
              <p className="text-green text-center text-sm">{success}</p>
            )}

            {/* Submit Button */}
            <button
              className={`p-2 rounded-lg w-full font-semibold transition-colors ${
                isFormValid && !isLoading
                  ? "bg-secondary text-white hover:bg-teal-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              type="submit"
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>

            <p className="mt-4 text-center">
              Already have an account?{" "}
              <Link to="/non-health-login" className="text-green underline">
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default NonHealthSignUp;
