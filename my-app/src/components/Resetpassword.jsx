import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase/firebase";

const Resetpassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!email.trim()) {
      setError("กรุณากรอกอีเมล");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email.trim().toLowerCase());
      setMessage("ส่งลิงก์รีเซ็ตรหัสผ่านไปที่อีเมลแล้ว");
      setEmail("");
    } catch (err) {
      console.error("Reset password error:", err);
      if (err.code === "auth/user-not-found") {
        setError("ไม่พบบัญชีผู้ใช้นี้");
      } else if (err.code === "auth/invalid-email") {
        setError("รูปแบบอีเมลไม่ถูกต้อง");
      } else {
        setError("ไม่สามารถส่งรีเซ็ตรหัสผ่าน: " + err.message);
      }
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto" }}>
      <h2>รีเซ็ตรหัสผ่าน</h2>
      <form onSubmit={handleResetPassword}>
        <div>
          <label htmlFor="email">อีเมล:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {message && <p style={{ color: "green" }}>{message}</p>}

        <button type="submit">ส่งลิงก์รีเซ็ตรหัสผ่าน</button>
      </form>
      <p>
        <a href="/login">กลับไปหน้าเข้าสู่ระบบ</a>
      </p>
    </div>
  );
};

export default Resetpassword;
