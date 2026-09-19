import { useState } from "react";
import hero from "../../assets/login2.png";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import axios from "axios";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);

    if (!formData.email) {
      setError("Please enter your email address.");
      setIsLoading(false);
      return;
    }

    try {
      // Note: You'll need to provide the correct endpoint for requesting password reset
      const response = await axios.post(
        "https://backend.onehealth-wwrg.com/api/v1/health/forgot-password",
        {
          email: formData.email,
        }
      );

      if (response.status >= 200 && response.status < 300) {
        setSuccess(
          "Password reset instructions have been sent to your email address. Please check your inbox and follow the instructions to reset your password."
        );
        setFormData({ email: "" });
      }
    } catch (error) {
      console.error("Forgot password request failed:", error);

      if (error.response) {
        const errorMessage =
          error.response.data.msg ||
          error.response.data.message ||
          "Failed to send reset instructions. Please try again.";
        setError(errorMessage);
      } else if (error.request) {
        setError("No response from server. Please try again.");
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="flex flex-col items-center justify-around">
        <div className="flex flex-col md:flex-row w-full max-w-6xl mt-32 mb-10 px-4">
          <div className="lg:block">
            <img
              src={hero}
              alt="Forgot Password"
              className="w-full md:w-full max-w-full lg:block"
            />
          </div>
          <form
            className="flex flex-col justify-center p-6 md:p-8 w-full md:w-1/2 lg:w-1/2 text-left gap-6"
            onSubmit={handleSubmit}
          >
            <h2 className="text-2xl md:text-3xl font-semibold text-secondary mb-4">
              Forgot Password
            </h2>

            <p className="text-gray-600 mb-4">
              Enter your email address and we'll send you instructions to reset
              your password.
            </p>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col mb-4 relative">
                <label
                  className="text-gray-700 text-xs absolute -top-3 left-3 bg-white p-1 rounded"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  className="p-2 mb-2 border-2 border-secondary rounded-lg w-full hover:border-green focus:border-green active:border-green focus:outline-none active:outline-none text-secondary"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  required
                />
              </div>

              {error && <p className="text-red-500 text-center">{error}</p>}
              {success && (
                <p className="text-green-600 text-center">{success}</p>
              )}

              <button
                className="p-2 bg-secondary text-white rounded-md hover:bg-green w-full disabled:bg-gray-400"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Reset Instructions"}
              </button>

              <p className="mt-4 text-center">
                Remember your password?{" "}
                <Link to="/login" className="text-secondary hover:underline">
                  Back to Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ForgotPassword;
