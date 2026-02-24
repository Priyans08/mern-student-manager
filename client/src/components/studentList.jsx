function StudentList({ students, deleteStudent, editStudent }) {
  return (
    <div>
      <h2>Students</h2>

      {students.length === 0 ? (
        <p>No students found</p>
      ) : (
        students.map((s, index) => (
          <div key={index} className="card">
            <h3>{s.name}</h3>
            <p>{s.role}</p>

            <button
              className="edit-btn"
              onClick={() => editStudent(s._id)}
            >
              Edit
            </button>

            <button
              className="delete-btn"
              onClick={() => deleteStudent(s._id)}
            >
              Delete
            </button>

            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default StudentList;