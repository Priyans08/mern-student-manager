import { useState } from "react";

function StudentForm({ addStudent, editingStudent }) {
  const [formData, setFormData] = useState({
    name: "",
    role: ""
  });

  if (editingStudent && formData.name !== editingStudent.name) {
    setFormData({
      name: editingStudent.name,
      role: editingStudent.role
    });
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.role) return;

    addStudent(formData);

    setFormData({ name: "", role: "" });
  };

  return (
    <div>
      <h2>{editingStudent ? "Edit Student" : "Add Student"}</h2>

      <input
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
      />

      <input
        name="role"
        placeholder="Role"
        value={formData.role}
        onChange={handleChange}
      />

      <button className="add-btn" onClick={handleSubmit}>
        {editingStudent ? "Update" : "Add"}
      </button>
    </div>
  );
}

export default StudentForm;