import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import "../Login.css";

function Login({ setIsAuthenticated }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      alert("Enter username and password");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);

        setIsAuthenticated(true);
        navigate("/");
      } else {
        alert("Invalid credentials");
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
          <h1>Expense Tracker</h1>
          <p>Track your expenses effortlessly and take control of your finances</p>
        </div>
      </div>

      <div className="login-right">
        <div className="login-box">
          <h2>Welcome Back</h2>
          <p className="subtitle">Please login to your account</p>

          <div className="input-group">
            <input
              type="text"
              placeholder="Enter your username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="forgot">Forgot Password?</div>

          <button className="login-btn" onClick={handleLogin}>
            Login
          </button>

          <div className="divider">Or continue with</div>

          {/* 🔥 Google Login */}
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
                  alert("Google login failed");
                }
              }}
              onError={() => console.log("Google Login Failed")}
            />
          </div>

          <p className="signup">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              style={{ cursor: "pointer", color: "blue" }}
            >
              Sign up
            </span>
          </p>
        </div>
      </div>

    </div>
  );
}

export default Login;