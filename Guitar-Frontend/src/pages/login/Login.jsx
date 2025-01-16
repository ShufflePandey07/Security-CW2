import { motion } from "framer-motion";
import React, { useState } from "react";
import {
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaLock,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { animated, useSpring } from "react-spring";
import { toast } from "react-toastify";
import styled from "styled-components";
import { loginUserApi } from "../../Apis/api";

const BackgroundContainer = styled.div`
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoginCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 3rem;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
`;

const StyledInput = styled(animated.div)`
  position: relative;
  margin-bottom: 1.5rem;

  input {
    width: 100%;
    padding: 1rem 1rem 1rem 3rem;
    border: none;
    border-radius: 50px;
    background: rgba(255, 255, 255, 0.9);
    font-size: 1rem;
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px #a777e3;
    }
  }

  svg {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #6e8efb;
  }
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #6e8efb;
`;

const StyledButton = styled(motion.button)`
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 50px;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  color: white;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #a777e3, #6e8efb);
  }
`;

const GoogleButton = styled(StyledButton)`
  background: white;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 1rem;

  &:hover {
    background: #f1f1f1;
  }
`;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const inputSpring = useSpring({
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0px)" },
    config: { tension: 300, friction: 10 },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = { email, password };

    loginUserApi(data)
      .then((res) => {
        if (res.status === 201) {
          toast.success(res.data.message);
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.user));
          setTimeout(() => {
            window.location.href =
              res.data.user.role === "admin" ? "/admin/dashboard" : "/";
          }, 1000);
        }
      })
      .catch((err) => {
        const message = err.response?.data?.message || "Something wentt wrong";
        toast.error(message);
      });
  };

  return (
    <BackgroundContainer>
      <LoginCard
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2
          style={{
            textAlign: "center",
            color: "#6e8efb",
            marginBottom: "2rem",
          }}
        >
          Welcome Back
        </h2>
        <form onSubmit={handleSubmit}>
          <StyledInput style={inputSpring}>
            <FaEnvelope />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </StyledInput>
          <StyledInput style={inputSpring}>
            <FaLock />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <PasswordToggle
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </PasswordToggle>
          </StyledInput>
          <StyledButton
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Log In
          </StyledButton>
          <GoogleButton
            as="button"
            onClick={() =>
              (window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`)
            }
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaGoogle />
            Log in with Google
          </GoogleButton>
        </form>
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <Link
            to="/forgot_password"
            style={{ color: "#6e8efb", textDecoration: "none" }}
          >
            Forgot password?
          </Link>
        </div>
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          Don't have an account?{" "}
          <Link
            to="/register"
            style={{ color: "#a777e3", textDecoration: "none" }}
          >
            Sign up
          </Link>
        </div>
      </LoginCard>
    </BackgroundContainer>
  );
};

export default Login;
