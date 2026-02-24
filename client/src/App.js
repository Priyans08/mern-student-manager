import { useState, useEffect } from "react";
import StudentForm from "./components/studentForm";
import StudentList from "./components/studentList";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Routes, Route, Link } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function App() {
  const [students, setStudents] = useState([]);

  const [editingIndex, setEditingIndex] = useState(null);

  const [search, setSearch] = useState("");
  const filteredStudents = Array.isArray(students)
    ? students.filter((s) =>
        s.name.toLowerCase().includes(search.toLowerCase()),
      )
    : [];

  const sortStudents = () => {
    const sorted = [...students].sort((a, b) => a.name.localeCompare(b.name));
    setStudents(sorted);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return; 

    fetch("https://student-manager-backend-ev5m.onrender.com/students", {
      headers: { authorization: token },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setStudents(data);
        } else {
          console.log("Auth error:", data);
          setStudents([]);
        }
      })
      .catch((err) => console.log("Fetch error:", err));
  }, []);

  const addStudent = (student) => {
    const token = localStorage.getItem("token");

    fetch("https://student-manager-backend-ev5m.onrender.com/students", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
      body: JSON.stringify(student),
    })
      .then((res) => res.json())
      .then((savedStudent) => {
        setStudents((prev) => [
          ...(Array.isArray(prev) ? prev : []),
          savedStudent,
        ]);
        setEditingIndex(null);
      });
  };
  const deleteStudent = (id) => {
    const token = localStorage.getItem("token");

    fetch(`https://student-manager-backend-ev5m.onrender.com/students/${id}`, {
      method: "DELETE",
      headers: { authorization: token },
    }).then(() => {
      setStudents(students.filter((s) => s._id !== id));
    });
  };

  const editStudent = (index) => {
    setEditingIndex(index);
  };

  return (
    <div>
      <nav>
        <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
      </nav>

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <div className="container">
                <h1>Student Manager</h1>

                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    window.location.href = "/login";
                  }}
                >
                  Logout
                </button>

                <StudentForm
                  addStudent={addStudent}
                  editingStudent={
                    editingIndex !== null ? students[editingIndex] : null
                  }
                />
                <button onClick={sortStudents}>Sort by Name</button>

                <input
                  placeholder="Search student..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <StudentList
                  students={filteredStudents}
                  deleteStudent={deleteStudent}
                  editStudent={editStudent}
                />
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
