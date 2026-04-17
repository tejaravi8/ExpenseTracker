import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import "../Login.css";

function Signup({ setIsAuthenticated }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!username || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, email, password })
      });

      const data = await res.json();

      if (res.ok) {
        alert("User registered successfully!");
        navigate("/login");
      } else {
        alert(JSON.stringify(data));
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="login-container">
      
      <div className="login-left">
        <div className="brand">
          <h1>Join Expense Tracker</h1>
          <p>Create an account and start managing your money smartly</p>
        </div>
      </div>

      <div className="login-right">
        <div className="login-box">
          <h2>Create Account</h2>
          <p className="subtitle">Sign up to get started</p>

          <div className="input-group">
            <input
              type="text"
              placeholder="Enter username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="input-group">
            <input
              type="email"
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="login-btn" onClick={handleSignup}>
            Sign Up
          </button>

          <div className="divider">Or continue with</div>

          {/* 🔥 Google Signup/Login */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <GoogleLogin
              onSuccess={async (res) => {
                const token = res.credential;

                const response = await fetch("http://127.0.0.1:8000/api/google-login/", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify({ token })
                });

                const data = await response.json();

                if (response.ok) {
                  localStorage.setItem("access", data.access);
                  localStorage.setItem("refresh", data.refresh);

                  setIsAuthenticated(true);
                  navigate("/");
                } else {
                  alert("Google signup failed");
                }
              }}
              onError={() => console.log("Google Signup Failed")}
            />
          </div>

          <p className="signup">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              style={{ cursor: "pointer", color: "blue" }}
            >
              Login
            </span>
          </p>
        </div>
      </div>

    </div>
  );
}

export default Signup;