import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");


  const handleChange = (event) => {

    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });

  };


  const handleLogin = async (event) => {

    event.preventDefault();

    setError("");

    try {

      const response = await fetch(
        "http://localhost:8080/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify(formData)
        }
      );


      const token = await response.text();


      if (response.ok) {

        // Save JWT session
        localStorage.setItem("token", token);

        // Go to student dashboard
        navigate("/students");

      } else {

        setError(token);

      }

    } catch (error) {

      console.error("Login error:", error);

      setError("Unable to connect to server");

    }

  };


  return (

    <div className="auth-container">

      <div className="auth-card">

        <h2>Login</h2>


        {error && (
          <p className="error-message">
            {error}
          </p>
        )}


        <form onSubmit={handleLogin}>

          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            required
          />


          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            required
          />


          <button type="submit">
            Login
          </button>

        </form>


        <p>

          Don't have an account?{" "}

          <Link to="/signup">
            Create Account
          </Link>

        </p>

      </div>

    </div>

  );

}

export default Login;