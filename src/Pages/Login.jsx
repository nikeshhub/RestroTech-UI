import React, { useContext, useState } from "react";
import background from "./background.png";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/authContext";

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    // Add form submission logic here
    console.log("Form submitted:", formData);

    try {
      const response = await login(formData);

      navigate("/");
    } catch (error) {
      console.log("error registering", error);
    }
  };
  const imageArray = [
    {
      id: 1,
      src: "https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg",
    },
    {
      id: 2,
      src: "https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671136.jpg",
    },
    {
      id: 3,
      src: "https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671122.jpg",
    },
  ];
  const getCurrentTime = () => {
    const currentDate = new Date();
    let hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedTime = {
      time: `${hours}:${minutes < 10 ? "0" + minutes : minutes}`,
      ampm: ampm,
    };
    return formattedTime;
  };

  const getFormattedDate = () => {
    const dateOptions = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    const currentDate = new Date();
    return currentDate.toLocaleDateString("en-US", dateOptions);
  };

  const { time, ampm } = getCurrentTime();

  return (
    <div
      className="flex h-screen bg-cover"
      style={{
        backgroundImage: `url(${background})`,
      }}
    >
      <div className="flex flex-col justify-between w-1/2 p-10 ">
        <div className="max-w-xl m-9">
          <h1 className="text-9xl font-bold text-white">{time}</h1>
          <p className="text-4xl text-white">{ampm}</p>
          <p className="mt-2 text-4xl text-white">{getFormattedDate()}</p>
          <div className="flex mt-10 space-x-9 bg-black bg-opacity-50 rounded-3xl backdrop-blur p-7">
            {imageArray.map((value, i) => (
              <div
                key={i}
                className="w-20 h-20 rounded-full bg-gray-300"
                style={{
                  backgroundImage: `url("${value.src}?w=826&t=st=1717083923~exp=1717084523~hmac=cd61d6dd1f441820289bc27353da2714d6a8c10cc669ae1edd9b2c7f55d12fff?height=40&width=40")`,
                  backgroundSize: "cover",
                }}
              ></div>
            ))}
          </div>
        </div>
        <div className="flex justify-between">
          <button className="px-4 py-2 font-bold text-white bg-gray-500 rounded hover:bg-gray-700">
            Support
          </button>
          <button className="px-4 py-2 font-bold text-white bg-gray-500 rounded hover:bg-gray-700">
            Restart System
          </button>
          <button className="px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-700">
            Turn OFF
          </button>
        </div>
      </div>
      <div className="w-1/2 p-10">
        <div className="max-w-xl mx-auto bg-gray bg-opacity-30 backdrop-blur rounded-3xl shadow-lg p-16 border-2 border-orange-600 text-white ">
          <h2 className="text-3xl font-bold mb-12">User Authentication</h2>
          <div className="mt-6">
            <form onSubmit={handleLogin}>
              <div className="mb-10">
                <label
                  htmlFor="email"
                  className="block text-lg font-medium text-white mb-4"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter email"
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-3xl bg-white text-gray-900 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-lg mb-4 font-medium text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  onChange={handleChange}
                  id="password"
                  placeholder="Enter password"
                  className="w-full px-3 py-2 rounded-3xl bg-white text-gray-900 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <a
                href="#"
                className="block mb-6 text-sm text-left text-gray-100 hover:underline"
              >
                Forgot password?
              </a>
              <button
                type="submit"
                className="w-full px-4 p-6 font-bold bg-orange-400 rounded-3xl text-2xl hover:bg-orange-500 my-20"
              >
                Running order
              </button>
              <a
                href="/register"
                className="block mt-4 text-center text-sm font-bold text-white hover:underline"
              >
                Dont have an account? Register
              </a>
            </form>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default LoginPage;
