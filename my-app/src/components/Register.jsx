import { useRef } from "react";
import { auth, db } from "../firebase/firebase.js";
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import "./Register.css"; // สไตล์ใหม่

const Register = () => {
  const usernameRef = useRef();
  const telephoneRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const username = usernameRef.current.value.trim();
    const telephone = telephoneRef.current.value.trim();
    const email = emailRef.current.value.trim();
    const password = passwordRef.current.value;

    if (password.length < 6) {
      alert("Password ต้องมีอย่างน้อย 6 ตัวอักษร");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        username,
        telephone,
        email,
      });

      console.log("User registered:", user.uid);
    } catch (error) {
      console.error("Registration error:", error);
      if (error.code === "auth/email-already-in-use") {
        alert("อีเมลนี้ถูกใช้งานแล้ว กรุณาใช้อีเมลอื่น");
      } else {
        alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
      }
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="title">ลงทะเบียน</h2>
        <p className="subtitle">
          By signing in you are agreeing our <br /> Term and privacy policy
        </p>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <span className="icon">👤</span>
            <input type="text" placeholder="Username" ref={usernameRef} required />
          </div>
          <div className="input-group">
            <span className="icon">📞</span>
            <input type="tel" placeholder="Telephone Number" ref={telephoneRef} required />
          </div>
          <div className="input-group">
            <span className="icon">📧</span>
            <input type="email" placeholder="Email Address" ref={emailRef} required />
          </div>
          <div className="input-group">
            <span className="icon">🔒</span>
            <input type="password" placeholder="Create Password" ref={passwordRef} required />
          </div>
          <button type="submit" className="btn-signup">SIGN UP</button>
        </form>
        <p className="login-link">
          มีบัญชีผู้ใช้แล้ว? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
