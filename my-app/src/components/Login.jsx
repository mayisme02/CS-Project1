import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, FacebookAuthProvider } from "firebase/auth";
import { useRef, useState, useEffect } from "react";
import { auth, db } from "../firebase/firebase.js";
import { doc, setDoc, getDoc } from "firebase/firestore";

const provider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

const Login = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [errorMessage, setErrorMessage] = useState("");
  const [showForgotLink, setShowForgotLink] = useState(false);
  const [isCooldown, setIsCooldown] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);

  // ฟังก์ชันจัดการ cooldown timer
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
  if (isCooldown) return; // ป้องกันกดล็อกอินช่วง cooldown

    const email = emailRef.current.value.trim();
    const password = passwordRef.current.value;

    // ตรวจสอบรูปแบบอีเมลก่อน
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("รูปแบบอีเมลไม่ถูกต้อง");
      setShowForgotLink(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Email login successful:", userCredential.user.uid);
      setErrorMessage("");
      setShowForgotLink(false);
    } catch (error) {
      console.error("Email login error:", error);

      if (error.code === "auth/wrong-password") {
        setErrorMessage("รหัสผ่านไม่ถูกต้อง");
        setShowForgotLink(true); // แสดงลิงก์ลืมรหัสผ่านทันที
      } else if (error.code === "auth/user-not-found") {
        setErrorMessage("ไม่พบบัญชีผู้ใช้นี้");
        setShowForgotLink(false);
      } else if (error.code === "auth/invalid-credential") {
        setErrorMessage("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
        setShowForgotLink(false);
      } else if (error.code === "auth/too-many-requests") {
        setErrorMessage("กรุณารอ " + 30 + " วินาที แล้วลองใหม่");
        setIsCooldown(true);
        setCooldownTime(30);  // กำหนดเวลาป้องกันกดซ้ำ 30 วินาที
        setShowForgotLink(true); // แนะนำเปลี่ยนรหัสผ่านด้วย
      } else {
        setErrorMessage("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
        setShowForgotLink(false);
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          username: user.displayName || "No Name",
          email: user.email,
          telephone: "",
        });
      }

      console.log("Google login successful:", user.uid);
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          username: user.displayName || "No Name",
          email: user.email,
          telephone: "",
        });
      }

      console.log("Facebook login successful:", user.uid);
    } catch (error) {
      console.error("Facebook login error:", error);
    }
  };

  return (
    <>
      <h2>เข้าสู่ระบบ</h2>
      <form onSubmit={handleEmailLogin}>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" required ref={emailRef} disabled={isCooldown} />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" required ref={passwordRef} disabled={isCooldown} />
        </div>

        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

        {showForgotLink && (
          <p>
             ลืมรหัสผ่าน?<a href="/resetpassword">ต้องการเปลี่ยนรหัสผ่านไหม?</a>
          </p>
        )}

        <button type="submit" disabled={isCooldown}>
          {isCooldown ? `กรุณารอสักครู่ (${cooldownTime} วินาที)` : "Login"}
        </button>
      </form>

      <p>
        ยังไม่มีบัญชีผู้ใช้ ? <a href="/register">Sign Up</a>
      </p>
      <h2>or connect with</h2>
      <button onClick={handleGoogleLogin} disabled={isCooldown}>Login with Google</button>
      <button onClick={handleFacebookLogin} disabled={isCooldown}>Login with Facebook</button>
    </>
  );
};

export default Login;
