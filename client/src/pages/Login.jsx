import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    })
      .then(res => res.json())
      .then(data => {
  console.log("LOGIN RESPONSE:", data);

  if (data.token) {
    localStorage.setItem("token", data.token);
    
   navigate("/");
  } else {
    alert(data.message || "Login failed");
  }
});
  };

  return (
    <div className="container">
      <h2>Login</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;