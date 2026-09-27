import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Signup() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");


  const handleChange = (event) => {

    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });

  };


  const handleSignup = async (event) => {

    event.preventDefault();

    setMessage("");
    setError("");


    try {

      const response = await fetch(
        "http://localhost:8080/auth/signup",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify(formData)
        }
      );


      const result = await response.text();


      if (response.ok) {

        setMessage("Signup successful! Redirecting to login...");


        setFormData({
          name: "",
          email: "",
          password: ""
        });


        // Go to login after signup
        setTimeout(() => {

          navigate("/login");

        }, 1500);


      } else {

        setError(result);

      }

    } catch (error) {

      console.error("Signup error:", error);

      setError("Unable to connect to server");

    }

  };


  return (

    <div className="auth-container">

      <div className="auth-card">

        <h2>Create Account</h2>


        {message && (
          <p className="success-message">
            {message}
          </p>
        )}


        {error && (
          <p className="error-message">
            {error}
          </p>
        )}


        <form onSubmit={handleSignup}>

          <input
            type="text"
            name="name"
            placeholder="Enter name"
            value={formData.name}
            onChange={handleChange}
            required
          />


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
            Signup
          </button>

        </form>


        <p>

          Already have an account?{" "}

          <Link to="/login">
            Login
          </Link>

        </p>

      </div>

    </div>

  );

}

export default Signup;