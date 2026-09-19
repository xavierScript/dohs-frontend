import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import hero from "../../assets/login2.png";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import open from "../../assets/open-eye.png";
import close from "../../assets/close-eye.png";
import negative from "../../assets/x-mark.png";
import positive from "../../assets/check.png";
import axios from "axios";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    new_password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  // Password validation regex
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\W]{8,}$/;

  const [errors, setErrors] = useState({
    new_password: {
      message:
        "Password must be at least 8 characters long and contain an uppercase letter, a number, and a special character",
      valid: false,
    },
    confirmPassword: { message: "Passwords do not match", valid: false },
  });

  // Validate form data
  const validateForm = () => {
    let formErrors = {
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

  useEffect(() => {
    // Check if token exists, if not redirect to login
    if (!token) {
      setError(
        "Invalid or missing reset token. Please request a new password reset."
      );
    }
  }, [token]);

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

    if (!token) {
      setError(
        "Invalid or missing reset token. Please request a new password reset."
      );
      return;
    }

    if (!isFormValid) {
      setError("Please ensure all fields are valid.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        "https://backend.onehealth-wwrg.com/api/v1/health/reset-password",
        {
          token: token,
          new_password: formData.new_password,
        }
      );

      if (response.status >= 200 && response.status < 300) {
        setSuccess("Password reset successful! Redirecting to login...");

        // Clear form
        setFormData({
          new_password: "",
          confirmPassword: "",
        });

        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (error) {
      console.error("Password reset failed:", error);

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
            "Password reset failed";
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

      <div className="flex flex-col items-center justify-around">
        <div className="flex flex-col md:flex-row w-full max-w-6xl mt-32 mb-10 px-4">
          <div className="lg:block">
            <img
              src={hero}
              alt="Reset Password"
              className="w-full md:w-full max-w-full lg:block"
            />
          </div>
          <form
            className="flex flex-col justify-center p-6 md:p-8 w-full md:w-1/2 lg:w-1/2 text-left gap-6"
            onSubmit={handleSubmit}
          >
            <h2 className="text-2xl md:text-3xl font-semibold text-secondary mb-4">
              Reset Password
            </h2>

            {!token && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                Invalid or missing reset token. Please request a new password
                reset.
              </div>
            )}

            <div className="flex flex-col gap-4">
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
                  type={showPassword ? "text" : "password"}
                  name="new_password"
                  value={formData.new_password}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  required
                  disabled={!token}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-secondary"
                  onClick={togglePasswordVisibility}
                  disabled={!token}
                >
                  <img src={showPassword ? close : open} alt="" />
                </button>
              </div>

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
                  disabled={!token}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-secondary"
                  onClick={toggleConfirmPasswordVisibility}
                  disabled={!token}
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
                  isFormValid && !isLoading && token
                    ? "bg-secondary hover:bg-green"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
                type="submit"
                disabled={!isFormValid || isLoading || !token}
              >
                {isLoading ? "Resetting Password..." : "Reset Password"}
              </button>

              <p className="mt-4 text-center">
                Remember your password?{" "}
                <a href="/login" className="text-secondary hover:underline">
                  Back to Sign In
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

export default ResetPassword;
