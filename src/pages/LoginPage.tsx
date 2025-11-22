import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginByName } from "../services/userService";
import { setCurrentUserId } from "../utils/auth";
import { notifications } from "../utils/notifications";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username.trim()) {
      notifications.error("Please enter your name");
      return;
    }

    try {
      const user = await loginByName(username.trim());
      setCurrentUserId(user.id);
      navigate("/plan");
    } catch (error) {
      console.error("Login error:", error);
      notifications.error("Login failed. Please try again.");
    }
  };

  return (
    <>
      <div className="bg-[rgba(0,250,134,0.77)] min-h-screen w-full flex items-center justify-center">
        <div className="flex flex-col p-20 gap-10 bg-[rgba(252,252,252,1)] h-full  ">
          <p className="text-center">Welcome to Login-light</p>
          <input
            type="text"
            placeholder="Write your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border-2 p-4"
          />
          <button
            className="bg-[rgba(0,250,134,0.77)] p-5"
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
