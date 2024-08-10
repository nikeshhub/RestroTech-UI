import axios from "axios";
import React, { useState } from "react";
import logo from "../logo.png";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    phoneNumber: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/user/register",
        formData
      );

      toast.success("User successfully created");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      console.log("error registering", error);
      toast.error(error.message);
    }
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center h-screen">
      <div className="flex w-full max-w-4xl bg-white rounded-lg shadow-md">
        <div className="w-1/2 flex flex-col items-center justify-center p-8 bg-teal-600 rounded-l-lg">
          <img src={logo} alt="RestroTech Logo" className="w-24 mb-4" />
          <p className="text-3xl font-bold text-center text-white mb-2">
            <span>WELCOME</span> <br /> to <br />
            <span className="text-orange-400"> RESTROTECH</span>
          </p>
          <h2 className="text-2xl font-bold text-center text-white mt-9">
            Join RestroTech Today!
          </h2>
        </div>
        <div className="w-1/2 p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="phoneNumber"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Phone Number
              </label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                required
                value={formData.phoneNumber}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="address"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                />
                <span
                  className="absolute inset-y-0 right-0 flex items-center px-2 cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </span>
              </div>
            </div>
            <div className="mb-6">
              <label
                htmlFor="confirmPassword"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                />
                <span
                  className="absolute inset-y-0 right-0 flex items-center px-2 cursor-pointer"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Join Now
              </button>
              <a
                href="/login"
                className="inline-block align-baseline font-bold text-sm text-teal-600 hover:text-teal-800"
              >
                Already have an account? Login
              </a>
            </div>
          </form>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default Register;
