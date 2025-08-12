import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase/firebase";
import "./Resetpassword.css"; // ใช้สไตล์ใหม่

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
    <div className="reset-container">
      <div className="reset-card">
        <h2 className="title">รีเซ็ตรหัสผ่าน</h2>
        <p className="subtitle">
          กรอกอีเมลของคุณเพื่อรับลิงก์รีเซ็ตรหัสผ่าน
        </p>
        <form onSubmit={handleResetPassword}>
          <div className="input-group">
            <span className="icon">📧</span>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {error && <p className="error">{error}</p>}
          {message && <p className="success">{message}</p>}

          <button type="submit" className="btn-reset">ส่งลิงก์รีเซ็ตรหัสผ่าน</button>
        </form>
        <p className="back-link">
          <a href="/login">← กลับไปหน้าเข้าสู่ระบบ</a>
        </p>
      </div>
    </div>
  );
};

export default Resetpassword;
