import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function StudentDashboard() {

  const navigate = useNavigate();

  const [students, setStudents] = useState([]);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: ""
  });

  const [loading, setLoading] = useState(true);


  // Get JWT token
  const getToken = () => {
    return localStorage.getItem("token");
  };


  // Get students
  const getStudents = async () => {

    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }

    try {

      setLoading(true);

      const response = await fetch(
        "http://localhost:8080/students",
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      );


      if (response.status === 401 || response.status === 403) {

        localStorage.removeItem("token");

        navigate("/login");

        return;
      }


      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }


      const data = await response.json();

      setStudents(data);

    } catch (error) {

      console.error("Error:", error);

    } finally {

      setLoading(false);

    }

  };


  // Load students
  useEffect(() => {

    getStudents();

  }, []);


  // Handle form input
  const handleChange = (event) => {

    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });

  };


  // Add student
  const addStudent = async (event) => {

    event.preventDefault();

    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }


    const student = {

      id: Number(formData.id),

      name: formData.name,

      email: formData.email

    };


    try {

      const response = await fetch(
        "http://localhost:8080/students",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },

          body: JSON.stringify(student)

        }
      );


      if (response.status === 401 || response.status === 403) {

        localStorage.removeItem("token");

        navigate("/login");

        return;

      }


      if (!response.ok) {

        throw new Error("Failed to add student");

      }


      await response.json();


      alert("Student added successfully!");


      setFormData({
        id: "",
        name: "",
        email: ""
      });


      getStudents();


    } catch (error) {

      console.error("Error:", error);

      alert("Failed to add student");

    }

  };


  // Logout
  const logout = () => {

    localStorage.removeItem("token");

    setStudents([]);

    navigate("/login");

  };


  return (

    <div className="dashboard">

      {/* ================= HEADER ================= */}

      <header className="dashboard-header">

        <div className="header-left">

          <div className="logo">
            🎓
          </div>

          <div>

            <h1>
              Student Management
            </h1>

            <p>
              Manage your student records
            </p>

          </div>

        </div>


        <button
          className="logout-btn"
          onClick={logout}
        >
          <span>↪</span>
          Logout
        </button>

      </header>


      {/* ================= MAIN ================= */}

      <main className="dashboard-content">


        {/* Welcome */}

        <section className="welcome-section">

          <div>

            <h2>
              Welcome back 👋
            </h2>

            <p>
              Manage students and keep their information organized.
            </p>

          </div>

        </section>


        {/* ================= STAT CARD ================= */}

        <section className="stats-section">

          <div className="stat-card">

            <div className="stat-icon">
              👨‍🎓
            </div>

            <div>

              <p>
                Total Students
              </p>

              <h3>
                {students.length}
              </h3>

            </div>

          </div>

        </section>


        {/* ================= ADD STUDENT ================= */}

        <section className="dashboard-card">

          <div className="card-header">

            <div>

              <h2>
                Add New Student
              </h2>

              <p>
                Enter student information below.
              </p>

            </div>

          </div>


          <form
            className="student-form"
            onSubmit={addStudent}
          >

            <div className="input-group">

              <label>
                Student ID
              </label>

              <input
                type="number"
                name="id"
                placeholder="e.g. 11"
                value={formData.id}
                onChange={handleChange}
                required
              />

            </div>


            <div className="input-group">

              <label>
                Student Name
              </label>

              <input
                type="text"
                name="name"
                placeholder="Enter student name"
                value={formData.name}
                onChange={handleChange}
                required
              />

            </div>


            <div className="input-group">

              <label>
                Email Address
              </label>

              <input
                type="email"
                name="email"
                placeholder="student@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />

            </div>


            <button
              className="add-student-btn"
              type="submit"
            >
              <span>+</span>
              Add Student
            </button>

          </form>

        </section>


        {/* ================= STUDENT TABLE ================= */}

        <section className="dashboard-card">

          <div className="card-header">

            <div>

              <h2>
                Student Details
              </h2>

              <p>
                All registered students
              </p>

            </div>


            <div className="student-count">

              {students.length} Students

            </div>

          </div>


          <div className="table-wrapper">

            {loading ? (

              <div className="loading">

                Loading students...

              </div>

            ) : (

              <table className="student-table">

                <thead>

                  <tr>

                    <th>
                      ID
                    </th>

                    <th>
                      Name
                    </th>

                    <th>
                      Email
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {students.length > 0 ? (

                    students.map((student) => (

                      <tr key={student.id}>

                        <td>

                          <span className="student-id">

                            #{student.id}

                          </span>

                        </td>

                        <td>

                          <div className="student-name">

                            <div className="avatar">

                              {student.name
                                ? student.name.charAt(0).toUpperCase()
                                : "S"}

                            </div>

                            {student.name}

                          </div>

                        </td>

                        <td>

                          <span className="student-email">

                            {student.email}

                          </span>

                        </td>

                      </tr>

                    ))

                  ) : (

                    <tr>

                      <td
                        colSpan="3"
                        className="no-data"
                      >

                        No students found.

                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            )}

          </div>

        </section>


      </main>


      {/* ================= FOOTER ================= */}

      <footer className="dashboard-footer">

        <p>
          Student Management System
        </p>

        <p>
          © 2026
        </p>

      </footer>


    </div>

  );

}

export default StudentDashboard;