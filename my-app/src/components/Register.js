import { useRef } from "react";
import { auth, db } from "../firebase/firebase.js"; 
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, getAuth, getRedirectResult} from "firebase/auth";

const Register = () => {
  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const telephoneRef = useRef();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const username = usernameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const telephone = telephoneRef.current.value;

    if (password.length < 6) {
    alert("Password ต้องมีอย่างน้อย 6 ตัวอักษร");
    return; // หยุดการทำงานถ้ารหัสผ่านสั้นเกินไป
  }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // เก็บ username กับ telephone ใน Firestore โดยใช้ user.uid เป็น id
      await setDoc(doc(db, "users", user.uid), {
        username: username,
        telephone: telephone,
        email: email,
      });

      console.log("User registered and data saved:", user.uid);

    } catch (error) {
  console.error("Registration error:", error);
  if (error.code === "auth/email-already-in-use") {
    alert("อีเมลนี้ถูกใช้งานแล้ว กรุณาใช้อีเมลอื่น");
  } else {
    alert("เกิดข้อผิดพลาดในการลงทะเบียน กรุณาลองใหม่อีกครั้ง");
  }
}
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="form-container">
        <h2>ลงทะเบียน</h2>
        <div>
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" name="username" required ref={usernameRef} />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required ref={emailRef} />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" required ref={passwordRef} />
        </div>
        <div>
          <label htmlFor="telephone">Telephone:</label>
          <input type="tel" id="telephone" name="telephone" required ref={telephoneRef} />
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </>
  );
};

export default Register;