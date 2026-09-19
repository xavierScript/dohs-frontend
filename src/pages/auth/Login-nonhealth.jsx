import { useState } from "react";
import hero2 from "../../assets/login1.png";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import open from "../../assets/open-eye.png";
import close from "../../assets/close-eye.png";
import { Link } from "react-router-dom";

const NonHealthLogin = () => {
  const [formData, setFormData] = useState({
    email: "",

    password: "",
  });

  const [Error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      console.log("Form data:", formData);

      const response = await axios.post(
        "https://backend.onehealth-wwrg.com/api/v1/non-health/login",
        {
          email: formData.email,
          password: formData.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        // Handle different possible token field names
        const token = response.data.access_token || response.data.token;

        if (token) {
          localStorage.setItem("authToken", token);

          // Store user data if available
          if (response.data.user) {
            localStorage.setItem("user", JSON.stringify(response.data.user));
          }

          setFormData({
            email: "",
            password: "",
          });

          setSuccess("User logged in successfully");

          // Redirect to construction page
          setTimeout(() => {
            window.location.href = "/construction";
          }, 1000);
        } else {
          console.error("Unexpected response format:", response.data);
          setError("No token received from the server.");
        }
      }
    } catch (error) {
      console.error("Login request failed:", error);
      if (error.response) {
        setError(
          error.response.data.message ||
            error.response.data.error ||
            "Invalid email address or password"
        );
      } else {
        setError("Network error. Please check your connection and try again.");
      }
    }
  };

  return (
    <>
      <Navbar />

      <div className="flex flex-col items-center mt-50">
        <div className="flex flex-col md:flex-row w-full max-w-6xl mt-32 mb-10 px-4 ">
          <div className=" lg:block">
            <img
              src={hero2}
              alt="Hand with dog"
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
                  className="text-gray-700 text-xs absolute -top-3 left-3 bg-white p-1"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  id="email"
                  className="p-2 mb-2 border-2 border-secondary rounded-lg w-full hover:border-green focus:border-green active:border-green focus:outline-none active:outline-none text-secondary"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
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
                <a className="mr-2" href="/reset">
                  <p>Forgot Password?</p>
                </a>
              </div>

              {Error && <p className="text-danger text-center">{Error}</p>}
              {success && (
                <p className="text-secondary text-center">{success}</p>
              )}
              <button
                className="p-2 bg-secondary text-white rounded-lg hover:bg-teal-700 w-full"
                type="submit"
              >
                Sign in
              </button>
              <p className="mt-4 text-center">
                Don&apos;t have an account?{" "}
                <Link to="/signup-non-health" className="text-green">
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

export default NonHealthLogin;
