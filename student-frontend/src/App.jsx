import { useEffect, useState } from "react";
import "./App.css";

import Login from "./components/Login";
import Signup from "./components/Signup";

function App() {

  const [page, setPage] = useState("login");

  const [students, setStudents] = useState([]);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: ""
  });


  // Check if user is already logged in
  useEffect(() => {

    const token = localStorage.getItem("token");

    if (token) {
      setPage("students");
    }

  }, []);


  // Get students
  const getStudents = () => {

    const token = localStorage.getItem("token");

    if (!token) {
      setPage("login");
      return;
    }

    fetch("http://localhost:8080/students", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then((response) => {

        if (response.status === 401 || response.status === 403) {

          localStorage.removeItem("token");
          setPage("login");

          throw new Error("Session expired");

        }

        return response.json();

      })
      .then((data) => {

        setStudents(data);

      })
      .catch((error) => {

        console.error("Error:", error);

      });
  };


  // Load students when student page opens
  useEffect(() => {

    if (page === "students") {
      getStudents();
    }

  }, [page]);


  // Handle input
  const handleChange = (event) => {

    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });

  };


  // Add student
  const addStudent = (event) => {

    event.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      setPage("login");
      return;
    }

    const student = {

      id: Number(formData.id),

      name: formData.name,

      email: formData.email

    };


    fetch("http://localhost:8080/students", {

      method: "POST",

      headers: {

        "Content-Type": "application/json",

        "Authorization": `Bearer ${token}`

      },

      body: JSON.stringify(student)

    })
      .then((response) => {

        if (response.status === 401 || response.status === 403) {

          localStorage.removeItem("token");

          setPage("login");

          throw new Error("Session expired");

        }

        if (!response.ok) {

          throw new Error("Failed to add student");

        }

        return response.json();

      })

      .then((data) => {

        console.log("Student added:", data);

        alert("Student added successfully!");

        setFormData({

          id: "",

          name: "",

          email: ""

        });

        getStudents();

      })

      .catch((error) => {

        console.error("Error:", error);

      });

  };


  // Logout
  const logout = () => {

    localStorage.removeItem("token");

    setStudents([]);

    setPage("login");

  };


  // -----------------------------
  // LOGIN PAGE
  // -----------------------------

  if (page === "login") {

    return (

      <div>

        <Login />

        <div style={{
          textAlign: "center",
          marginTop: "15px"
        }}>

          <p>
            Don't have an account?
          </p>

          <button
            onClick={() => setPage("signup")}
          >
            Create Account
          </button>

        </div>

      </div>

    );

  }


  // -----------------------------
  // SIGNUP PAGE
  // -----------------------------

  if (page === "signup") {

    return (

      <div>

        <Signup />

        <div style={{
          textAlign: "center",
          marginTop: "15px"
        }}>

          <p>
            Already have an account?
          </p>

          <button
            onClick={() => setPage("login")}
          >
            Login
          </button>

        </div>

      </div>

    );

  }


  // -----------------------------
  // STUDENT DASHBOARD
  // -----------------------------

  return (

    <div className="app-container">

      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px"
      }}>

        <h1>Student Management System</h1>

        <button
          onClick={logout}
          style={{
            padding: "10px 20px",
            border: "none",
            borderRadius: "6px",
            background: "#dc2626",
            color: "white",
            cursor: "pointer"
          }}
        >
          Logout
        </button>

      </div>


      {/* ADD STUDENT */}

      <div className="form-card">

        <h2>Add Student</h2>

        <form onSubmit={addStudent}>

          <div className="form-group">

            <label>ID</label>

            <input
              type="number"
              name="id"
              placeholder="Enter student ID"
              value={formData.id}
              onChange={handleChange}
              required
            />

          </div>


          <div className="form-group">

            <label>Name</label>

            <input
              type="text"
              name="name"
              placeholder="Enter student name"
              value={formData.name}
              onChange={handleChange}
              required
            />

          </div>


          <div className="form-group">

            <label>Email</label>

            <input
              type="email"
              name="email"
              placeholder="Enter student email"
              value={formData.email}
              onChange={handleChange}
              required
            />

          </div>


          <button
            className="add-btn"
            type="submit"
          >
            Add Student
          </button>

        </form>

      </div>


      {/* STUDENT LIST */}

      <div className="table-card">

        <h2>Students</h2>

        <div className="table-container">

          <table className="student-table">

            <thead>

              <tr>

                <th>ID</th>

                <th>Name</th>

                <th>Email</th>

              </tr>

            </thead>


            <tbody>

              {students.length > 0 ? (

                students.map((student) => (

                  <tr key={student.id}>

                    <td>{student.id}</td>

                    <td>{student.name}</td>

                    <td>{student.email}</td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="3"
                    className="no-data"
                  >
                    No students found
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );
}

export default App;