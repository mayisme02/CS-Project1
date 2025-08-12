import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
} from "firebase/auth";
import { useRef, useState, useEffect } from "react";
import { auth, db } from "../firebase/firebase.js";
import { doc, setDoc, getDoc } from "firebase/firestore";
import "./Login.css"; // สร้างไฟล์ CSS แยกสำหรับสไตล์

const provider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [errorMessage, setErrorMessage] = useState("");
  const [showForgotLink, setShowForgotLink] = useState(false);
  const [isCooldown, setIsCooldown] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);

  useEffect(() => {
    let timer;
    if (isCooldown && cooldownTime > 0) {
      timer = setTimeout(() => setCooldownTime(cooldownTime - 1), 1000);
    } else if (cooldownTime === 0) {
      setIsCooldown(false);
      setErrorMessage("");
    }
    return () => clearTimeout(timer);
  }, [isCooldown, cooldownTime]);

  const handleEmailLogin = async (event) => {
    event.preventDefault();
    if (isCooldown) return;

    const email = emailRef.current.value.trim();
    const password = passwordRef.current.value;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("รูปแบบอีเมลไม่ถูกต้อง");
      setShowForgotLink(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setErrorMessage("");
      setShowForgotLink(false);
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        setErrorMessage("รหัสผ่านไม่ถูกต้อง");
        setShowForgotLink(true);
      } else if (error.code === "auth/user-not-found") {
        setErrorMessage("ไม่พบบัญชีผู้ใช้นี้");
      } else if (error.code === "auth/too-many-requests") {
        setErrorMessage("กรุณารอ 30 วินาที แล้วลองใหม่");
        setIsCooldown(true);
        setCooldownTime(30);
        setShowForgotLink(true);
      } else {
        setErrorMessage("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userDocRef = doc(db, "users", user.uid);
      if (!(await getDoc(userDocRef)).exists()) {
        await setDoc(userDocRef, {
          username: user.displayName || "No Name",
          email: user.email,
          telephone: "",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;
      const userDocRef = doc(db, "users", user.uid);
      if (!(await getDoc(userDocRef)).exists()) {
        await setDoc(userDocRef, {
          username: user.displayName || "No Name",
          email: user.email,
          telephone: "",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">เข้าสู่ระบบ</h2>
        <form onSubmit={handleEmailLogin}>
          <input
            type="email"
            placeholder="Email Address"
            ref={emailRef}
            disabled={isCooldown}
          />
          <input
            type="password"
            placeholder="Password"
            ref={passwordRef}
            disabled={isCooldown}
          />
          {errorMessage && <p className="error">{errorMessage}</p>}
          {showForgotLink && (
            <p className="forgot">
              ลืมรหัสผ่าน? <a href="/resetpassword">เปลี่ยนรหัสผ่าน</a>
            </p>
          )}
          <button type="submit" className="btn-login" disabled={isCooldown}>
            {isCooldown
              ? `กรุณารอสักครู่ (${cooldownTime} วินาที)`
              : "LOGIN"}
          </button>
        </form>
        <p className="signup">
          ยังไม่มีบัญชีผู้ใช้? <a href="/register">Sign Up</a>
        </p>
        <p className="or-text">or connect with</p>
        <button
          className="btn-google"
          onClick={handleGoogleLogin}
          disabled={isCooldown}
        >
          <img src="/google-icon.png" alt="Google" /> Login with Google
        </button>
        <button
          className="btn-facebook"
          onClick={handleFacebookLogin}
          disabled={isCooldown}
        >
          <img src="/facebook-icon.png" alt="Facebook" /> Login with Facebook
        </button>
      </div>
    </div>
  );
}
