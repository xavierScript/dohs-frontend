import { useState } from "react";
// import hero from '../assets/register.jpg'
import hero2 from "../../assets/login2.png";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import open from "../../assets/open-eye.png";
import close from "../../assets/close-eye.png";
import axios from "axios";
import { Link } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [Error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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

    try {
      const loginEndpoint =
        "https://backend.onehealth-wwrg.com/api/v1/health/login";

      const response = await axios.post(loginEndpoint, formData);

      if (
        response.status >= 200 &&
        response.status < 300 &&
        response.data.access_token
      ) {
        // Store the access token
        localStorage.setItem("authToken", response.data.access_token);

        // Store user data
        localStorage.setItem("user", JSON.stringify(response.data.user));

        setFormData({
          email: "",
          password: "",
        });

        setSuccess("User logged in successfully");

        // Redirect based on user role
        window.location.href = "/stakeholder/dashboard";
      } else {
        console.error("Unexpected response format:", response.data);
        setError("No token received from the server.");
      }
    } catch (error) {
      console.error("Login request failed:", error);

      if (error.response) {
        // The server responded with an error status
        const errorMessage =
          error.response.data.msg ||
          error.response.data.message ||
          "Invalid email or password";
        setError(errorMessage);
      } else if (error.request) {
        // The request was made but no response was received
        setError("No response from server. Please try again.");
      } else {
        // Something happened in setting up the request
        setError("An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="flex flex-col items-center  justify-around">
        <div className="flex flex-col md:flex-row w-full max-w-6xl mt-32 mb-10 px-4 ">
          <div className="lg:block">
            <img
              src={hero2}
              alt="Woman with dog"
              className="w-full md:w-full max-w-full lg:block"
            />
          </div>
          <form
            className="flex flex-col justify-center p-6 md:p-8 w-full md:w-1/2 lg:w-1/2 text-left gap-10"
            onSubmit={handleSubmit}
          >
            <h2 className="text-2xl md:text-3xl font-semibold text-secondary mb-4">
              Sign In
            </h2>
            <div className="flex flex-col mb-4 h-full gap-4">
              <div className="flex flex-col mb-4 relative">
                <label
                  className=" text-gray-700 text-xs absolute -top-3 left-3 bg-white p-1 rounded"
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
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="flex flex-col mb-4 relative">
                <label
                  className="text-gray-700 text-xs absolute -top-3 left-3 bg-white p-1"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  id="password"
                  className="p-2 mb-2 border-2 border-secondary rounded-lg w-full hover:border-green focus:border-green active:border-green focus:outline-none active:outline-none text-secondary"
                  name="password"
                  type={showPassword ? "text" : "password"}
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

              <div className="flex items-center mb-4 mt-4">
                <Link className="mr-2" to="/forgot-password">
                  <p className="text-secondary hover:underline">
                    Forgot Password?
                  </p>
                </Link>
              </div>

              {Error && <p className="text-danger text-center">{Error}</p>}
              {success && (
                <p className="text-secondary text-center">{success}</p>
              )}
              <button
                className="p-2 bg-secondary text-white rounded-md hover:bg-green w-full disabled:bg-gray-400"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
              <p className="mt-4 text-center">
                Don&apos;t have an account?{" "}
                <Link to="/signup" className="text-green">
                  Sign up
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

export default Login;
