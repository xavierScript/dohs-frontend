import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import hero from "../../assets/login2.png";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import open from "../../assets/open-eye.png";
import close from "../../assets/close-eye.png";
import negative from "../../assets/x-mark.png";
import positive from "../../assets/check.png";
import axios from "axios";

const ChangePassword = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    old_password: "",
    new_password: "",
    confirmPassword: "",
  });

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  // Password validation regex
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\W]{8,}$/;

  const [errors, setErrors] = useState({
    old_password: { message: "Current password is required", valid: false },
    new_password: {
      message:
        "Password must be at least 8 characters long and contain an uppercase letter, a number, and a special character",
      valid: false,
    },
    confirmPassword: { message: "Passwords do not match", valid: false },
  });

  // Check if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }
  }, [navigate]);

  // Validate form data
  const validateForm = () => {
    let formErrors = {
      old_password: {
        message: "Current password is required",
        valid: !!formData.old_password,
      },
      new_password: {
        message:
          "Password must be at least 8 characters long and contain an uppercase letter, a number, and a special character",
        valid: passwordRegex.test(formData.new_password),
      },
      confirmPassword: {
        message: "Passwords must match",
        valid:
          formData.new_password === formData.confirmPassword &&
          formData.confirmPassword !== "",
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
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!isFormValid) {
      setError("Please ensure all fields are valid.");
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        setError("You must be logged in to change your password.");
        navigate("/login");
        return;
      }

      const response = await axios.post(
        "https://backend.onehealth-wwrg.com/api/v1/health/change-password",
        {
          old_password: formData.old_password,
          new_password: formData.new_password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        setSuccess(
          "Password changed successfully! You can now use your new password."
        );

        // Clear form
        setFormData({
          old_password: "",
          new_password: "",
          confirmPassword: "",
        });

        // Optional: Redirect to dashboard after a delay
        setTimeout(() => {
          navigate("/stakeholder/dashboard");
        }, 3000);
      }
    } catch (error) {
      console.error("Password change failed:", error);

      if (error.response) {
        // Handle validation errors
        if (error.response.data.detail) {
          const validationErrors = error.response.data.detail;
          const errorMessage = validationErrors
            .map((err) => err.msg)
            .join(", ");
          setError(errorMessage);
        } else {
          const errorMessage =
            error.response.data.msg ||
            error.response.data.message ||
            "Failed to change password";
          setError(errorMessage);
        }
      } else if (error.request) {
        setError("No response from server. Please try again.");
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle password visibility functions
  const toggleOldPasswordVisibility = () => {
    setShowOldPassword(!showOldPassword);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
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

      <div className="flex flex-col items-center justify-around">
        <div className="flex flex-col md:flex-row w-full max-w-6xl mt-32 mb-10 px-4">
          <div className="lg:block">
            <img
              src={hero}
              alt="Change Password"
              className="w-full md:w-full max-w-full lg:block"
            />
          </div>
          <form
            className="flex flex-col justify-center p-6 md:p-8 w-full md:w-1/2 lg:w-1/2 text-left gap-6"
            onSubmit={handleSubmit}
          >
            <h2 className="text-2xl md:text-3xl font-semibold text-secondary mb-4">
              Change Password
            </h2>

            <p className="text-gray-600 mb-4">
              Enter your current password and choose a new secure password.
            </p>

            <div className="flex flex-col gap-4">
              {/* Current Password Field */}
              <div className="flex flex-col mb-4 relative">
                <label
                  className="text-gray-700 text-xs absolute -top-3 left-3 bg-white p-1"
                  htmlFor="old_password"
                >
                  Current Password
                </label>
                <input
                  id="old_password"
                  className="p-2 mb-2 border-2 border-secondary rounded-lg w-full hover:border-green focus:border-green active:border-green focus:outline-none active:outline-none text-secondary"
                  type={showOldPassword ? "text" : "password"}
                  name="old_password"
                  value={formData.old_password}
                  onChange={handleChange}
                  placeholder="Enter current password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-secondary"
                  onClick={toggleOldPasswordVisibility}
                >
                  <img src={showOldPassword ? close : open} alt="" />
                </button>
              </div>

              {/* New Password Field */}
              <div className="flex flex-col mb-4 relative">
                <label
                  className="text-gray-700 text-xs absolute -top-3 left-3 bg-white p-1"
                  htmlFor="new_password"
                >
                  New Password
                </label>
                <input
                  id="new_password"
                  className="p-2 mb-2 border-2 border-secondary rounded-lg w-full hover:border-green focus:border-green active:border-green focus:outline-none active:outline-none text-secondary"
                  type={showNewPassword ? "text" : "password"}
                  name="new_password"
                  value={formData.new_password}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-secondary"
                  onClick={toggleNewPasswordVisibility}
                >
                  <img src={showNewPassword ? close : open} alt="" />
                </button>
              </div>

              {/* Confirm New Password Field */}
              <div className="flex flex-col mb-4 relative">
                <label
                  className="text-gray-700 text-xs absolute -top-3 left-3 bg-white p-1"
                  htmlFor="confirmPassword"
                >
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  className="p-2 mb-2 border-2 border-secondary rounded-lg w-full hover:border-green focus:border-green active:border-green focus:outline-none active:outline-none text-secondary"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-secondary"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  <img src={showConfirmPassword ? close : open} alt="" />
                </button>
              </div>

              {/* Validation messages */}
              <div className="validation-messages mt-4">
                {Object.entries(errors).map(
                  ([field, { message, valid }], index) => (
                    <div key={index} className="flex items-center mb-2 text-xs">
                      {renderValidationIcon(valid)}
                      <span className={valid ? "text-darkGreen" : "text-red"}>
                        {message}
                      </span>
                    </div>
                  )
                )}
              </div>

              {error && <p className="text-red-500 text-center">{error}</p>}
              {success && (
                <p className="text-green-600 text-center">{success}</p>
              )}

              <button
                className={`p-2 rounded-lg text-white w-full ${
                  isFormValid && !isLoading
                    ? "bg-secondary hover:bg-green"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
                type="submit"
                disabled={!isFormValid || isLoading}
              >
                {isLoading ? "Changing Password..." : "Change Password"}
              </button>

              <p className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => navigate("/stakeholder/dashboard")}
                  className="text-secondary hover:underline bg-transparent border-none cursor-pointer"
                >
                  Back to Dashboard
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ChangePassword;
