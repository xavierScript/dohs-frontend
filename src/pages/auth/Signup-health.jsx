import { useState, useEffect } from "react";
import hero from "../../assets/register2.png";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import open from "../../assets/open-eye.png";
import close from "../../assets/close-eye.png";
import negative from "../../assets/x-mark.png";
import positive from "../../assets/check.png";

import axios from "axios";

const SignUp = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    designation: "",
    license_number: "",
    password: "",
    confirmPassword: "",
    location: "",
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
    designation: { message: "Designation is required", valid: false },
    license_number: {
      message: "License number is required for Medical Doctors",
      valid: false,
    },
    password: {
      message:
        "Password must be at least 8 characters long and contain an uppercase letter, a number, and a special character",
      valid: false,
    },
    confirmPassword: { message: "Passwords do not match", valid: false },
    location: { message: "Location is required", valid: false },
    terms: {
      message: "You must agree to the terms and conditions",
      valid: false,
    },
  });

  //Backend  State Validation
  const [error, setError] = useState(null); // Daniels State Validation
  const [success, setSuccess] = useState(null);

  // Regular expressions for validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\W]{8,}$/;

  // Validate form data
  const validateForm = () => {
    let formErrors = {
      first_name: {
        message: "First name is required",
        valid: !!formData.first_name,
      },
      last_name: {
        message: "Last name is required",
        valid: !!formData.last_name,
      },
      email: {
        message: "Enter a valid email",
        valid: emailRegex.test(formData.email),
      },
      phone_number: {
        message: "Phone number is required",
        valid: !!formData.phone_number,
      },
      designation: {
        message: "Designation is required",
        valid: !!formData.designation,
      },
      license_number: {
        message: "License number is required for Medical Doctors",
        valid:
          formData.designation !== "Medical Doctor" ||
          !!formData.license_number,
      },
      password: {
        message:
          "Password must be at least 8 characters long and contain an uppercase letter, a number, and a special character",
        valid: passwordRegex.test(formData.password),
      },
      confirmPassword: {
        message: "Passwords must match",
        valid:
          formData.password === "" || formData.confirmPassword === ""
            ? false
            : formData.password === formData.confirmPassword,
      },
      location: { message: "Location is required", valid: !!formData.location },
      terms: {
        message: "You must agree to the terms and conditions",
        valid: formData.terms,
      },
    };
    setErrors(formErrors);
    setIsFormValid(Object.values(formErrors).every((error) => error.valid));
  };

  useEffect(() => {
    validateForm();
  }, [formData]);

  // Handler for input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear any previous error messages
    setError(null);
    setSuccess(null);

    if (!isFormValid) {
      setError("Please fill in all required fields correctly.");
      return;
    }

    try {
      setIsLoading(true);
      // Prepare data for submission
      const submitData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone_number: formData.phone_number,
        designation: formData.designation,
        license_number: formData.license_number,
        location: formData.location,
        password: formData.password,
      };

      // Send data to the backend
      const response = await axios.post(
        "https://backend.onehealth-wwrg.com/api/v1/health/signup",
        submitData
      );

      // Handle the response data
      console.log("Response data:", response.data);

      // Clear the form fields
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        designation: "",
        license_number: "",
        password: "",
        confirmPassword: "",
        location: "",
        terms: false,
      });

      // Redirect to the login page or display a success message

      if (response.status === 200 || response.status === 201) {
        setSuccess("User registered successfully");
        // Redirect to the login page using window.location
        window.location.href = "/login";
      } else {
        // Handle error response status
        console.error("Registration failed. Status:", response.status);
        setError("Registration failed. Status:", response.status);
      }
    } catch (error) {
      // Handle any errors
      console.error("There was a problem with the Axios operation:", error);

      // More detailed error handling
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const errorMessage =
          error.response.data.msg ||
          error.response.data.message ||
          "Registration failed";
        setError(errorMessage);
        console.error("Error response:", error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        setError("No response received from server. Please try again.");
      } else {
        // Something happened in setting up the request that triggered an Error
        setError("An error occurred while sending the request.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const renderValidationIcon = (valid) => (
    <img
      src={valid ? positive : negative}
      alt=""
      className="inline-block w-4 h-4 mr-2"
    />
  );

  return (
    <>
      <Navbar />

      <div className="flex flex-col items-center mt-32">
        <div className="flex flex-col md:flex-row w-full max-w-6xl my-10 px-4">
          <img
            src={hero}
            alt="Woman with dog"
            className="w-full md:w-1/2 max-w-full lg:block"
          />
          <form
            className="flex flex-col justify-between p-6 md:p-8 w-full md:w-full lg:w-1/2 text-left"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col justify-between mb-4 h-full">
              <h2 className="text-2xl md:text-3xl font-semibold text-secondary mb-4">
                Sign Up
              </h2>
              <div className="flex flex-col md:flex-row mb-4">
                <div className="relative flex-col mb-4 md:mr-4 w-full md:w-1/2">
                  <label
                    className="text-gray-700 text-xs absolute -top-3 left-3  bg-white p-1"
                    htmlFor="firstName"
                  >
                    First Name
                  </label>
                  <input
                    id="firstname"
                    className="p-2 mb-1 border-2 border-secondary rounded-lg w-full text-secondary hover:border-green focus:border-green active:border-green focus:outline-none active:outline-none"
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="First Name"
                    required
                  />
                </div>
                <div className="flex-col w-full md:w-1/2 relative">
                  <label
                    className="text-gray-700 text-xs absolute -top-3 left-3 bg-white p-1"
                    htmlFor="lastName"
                  >
                    Last Name
                  </label>
                  <input
                    id="lastname"
                    className="p-2 mb-2 border-2 border-secondary rounded-lg w-full text-secondary hover:border-green focus:border-green active:border-green focus:outline-none active:outline-none"
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Last Name"
                    required
                  />
                </div>
              </div>

              <div className="flex-col mb-4 relative">
                <label
                  className="text-gray-700 text-xs absolute -top-3 left-3 bg-white p-1"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  id="email"
                  className="p-2 mb-2 border-2 border-secondary rounded-lg w-full text-secondary hover:border-green focus:border-green active:border-green focus:outline-none active:outline-none"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                />
              </div>

              <div className="flex-col mb-4 relative">
                <label
                  className="text-gray-700 text-xs absolute -top-3 left-3 bg-white p-1"
                  htmlFor="phone_number"
                >
                  Phone Number
                </label>
                <input
                  id="phone_number"
                  className="p-2 mb-2 border-2 border-secondary rounded-lg w-full text-secondary hover:border-green focus:border-green active:border-green focus:outline-none active:outline-none"
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  required
                />
              </div>

              <div className="flex-col mb-4 relative">
                <label
                  className="text-gray-700 text-xs absolute -top-3 left-3 bg-white p-1"
                  htmlFor="designation"
                >
                  Designation
                </label>
                <select
                  id="designation"
                  className="p-3 mb-2 border-2 border-secondary rounded-lg w-full text-secondary hover:border-green focus:border-green active:border-green focus:outline-none active:outline-none"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Designation</option>
                  <option value="Health Worker">Health Worker</option>
                  <option value="Medical Doctor">Medical Doctor</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {formData.designation === "Medical Doctor" && (
                <div className="flex-col mb-4 relative">
                  <label
                    className="text-gray-700 text-xs absolute -top-3 left-3 bg-white p-1"
                    htmlFor="license_number"
                  >
                    License Number
                  </label>
                  <input
                    id="license_number"
                    className="p-2 mb-2 border-2 border-secondary rounded-lg w-full text-secondary hover:border-green focus:border-green active:border-green focus:outline-none active:outline-none"
                    type="text"
                    name="license_number"
                    value={formData.license_number}
                    onChange={handleChange}
                    placeholder="License Number"
                  />
                </div>
              )}

              <div className="flex-col mb-4 relative">
                <label
                  className="text-gray-700 text-xs absolute -top-3 left-3 bg-white p-1"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  id="password"
                  className="p-2 mb-2 border-2 border-secondary rounded-lg w-full text-secondary hover:border-green focus:border-green active:border-green focus:outline-none active:outline-none"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-secondary"
                  onClick={togglePasswordVisibility}
                >
                  <img src={showPassword ? close : open}></img>
                </button>
              </div>

              <div className="flex-col mb-4 relative">
                <label
                  className="text-gray-700 text-xs absolute -top-3 left-3 bg-white p-1"
                  htmlFor="confirmPassword"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  className="p-2 mb-2 border-2 border-secondary rounded-lg w-full text-secondary hover:border-green focus:border-green active:border-green focus:outline-none active:outline-none"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-secondary"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  <img src={showConfirmPassword ? close : open}></img>
                </button>
              </div>

              <div className="flex-col mb-4 relative">
                <label
                  className="text-gray-700 text-xs absolute -top-3 left-3 bg-white p-1"
                  htmlFor="location"
                >
                  Location
                </label>
                <input
                  id="location"
                  className="p-2 mb-2 border-2 border-secondary rounded-lg w-full text-secondary hover:border-green focus:border-green active:border-green focus:outline-none active:outline-none"
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Location"
                  required
                />
              </div>

              <div className="flex items-center self-center mb-4 mt-4">
                <input
                  className="mr-2 custom-checkbox "
                  type="checkbox"
                  name="terms"
                  checked={formData.terms}
                  onChange={handleChange}
                  required
                />
                <label className="text-xs md:text-sm">
                  I’ve read and agreed with Terms and conditions
                </label>
              </div>

              <div className="validation-messages mt-4">
                {Object.entries(errors).map(
                  ([field, { message, valid }], index) => {
                    if (
                      field === "license_number" &&
                      formData.designation !== "Medical Doctor"
                    )
                      return null;

                    return (
                      <div
                        key={index}
                        className="flex items-center mb-2 text-xs"
                      >
                        {renderValidationIcon(valid)}
                        <span className={valid ? "text-darkGreen" : "text-red"}>
                          {message}
                        </span>
                      </div>
                    );
                  }
                )}
              </div>

              <button
                className={`p-2 rounded-lg text-white w-full ${
                  isFormValid && !isLoading
                    ? "bg-secondary hover:bg-green"
                    : "bg-grey"
                }`}
                type="submit"
                disabled={!isFormValid || isLoading}
              >
                {isLoading ? "Signing up..." : "Sign up"}
              </button>
              {success && <p className="text-black">{success}</p>}
              {error && <p className="text-black text-center">{error}</p>}
              <p className="mt-4 text-center">
                Already have an account?{" "}
                <a href="/login" className="text-secondary">
                  Sign in
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default SignUp;
