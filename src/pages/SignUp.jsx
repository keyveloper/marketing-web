import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SignUp.css";
import "../config/cognito"; // Amplify 설정 초기화
import { registerUser, getErrorMessage } from "../services/auth";

export default function SignUp() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    phoneNumber: "",
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const validate = () => {
    const e = {};

    // Username validation
    if (!form.username.trim()) e.username = "아이디를 입력해주세요.";

    // Phone number validation
    if (!form.phoneNumber.trim()) {
      e.phoneNumber = "전화번호를 입력해주세요.";
    } else if (!/^[0-9-+()]*$/.test(form.phoneNumber)) {
      e.phoneNumber = "올바른 전화번호 형식이 아닙니다.";
    }

    // Email validation
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "이메일 형식이 올바르지 않습니다.";

    // Name validation
    if (!form.name.trim()) e.name = "이름을 입력해주세요.";

    // Password validation with detailed rules
    if (form.password.length < 8) {
      e.password = "Password must be at least 8 characters";
    } else {
      const hasNumber = /\d/.test(form.password);
      const hasLowercase = /[a-z]/.test(form.password);
      const hasUppercase = /[A-Z]/.test(form.password);
      const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(form.password);

      if (!hasNumber) e.password = "Use a number";
      else if (!hasLowercase) e.password = "Use a lowercase letter";
      else if (!hasUppercase) e.password = "Use an uppercase letter";
      else if (!hasSymbol) e.password = "Use a symbol";
    }

    // Confirm password validation
    if (form.password !== form.confirmPassword) {
      e.confirmPassword = "비밀번호가 일치하지 않습니다.";
    }

    if (!form.agree) e.agree = "약관에 동의해주세요.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      // AWS Cognito 회원가입 호출
      const result = await registerUser({
        username: form.username,
        email: form.email,
        password: form.password,
        phoneNumber: form.phoneNumber,
        name: form.name,
      });

      if (result.success) {
        // 회원가입 성공 - 인증 페이지로 이동
        const username = form.username;
        const email = form.email;

        // 폼 초기화
        setForm({
          username: "",
          phoneNumber: "",
          email: "",
          name: "",
          password: "",
          confirmPassword: "",
          agree: false,
        });

        // 인증 페이지로 이동
        navigate('/verify-email', { state: { username, email } });
      } else {
        // 회원가입 실패
        const errorMsg = getErrorMessage(result.code);
        alert(
          `회원가입 실패\n\n` +
          `에러 코드: ${result.code}\n` +
          `메시지: ${errorMsg}\n\n` +
          `상세 내용: ${result.error}`
        );
        console.error('Signup error:', result);
      }
    } catch (err) {
      alert("회원가입 중 예상치 못한 오류가 발생했습니다.");
      console.error('Unexpected error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="su-page">
      <div className="su-card">
        <div className="su-brand">
          <div className="su-logo">Logo</div>
          <h1>Create your account</h1>
          <p className="su-sub">간단히 가입하고 지금 바로 시작하세요.</p>
        </div>

        <form className="su-form" onSubmit={onSubmit} noValidate>
          <div className="su-field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              value={form.username}
              onChange={onChange}
              placeholder="아이디를 입력하세요"
              autoComplete="username"
            />
            {errors.username && <span className="su-error">{errors.username}</span>}
          </div>

          <div className="su-field">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              value={form.phoneNumber}
              onChange={onChange}
              placeholder="010-1234-5678"
              autoComplete="tel"
            />
            {errors.phoneNumber && <span className="su-error">{errors.phoneNumber}</span>}
          </div>

          <div className="su-field">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              placeholder="you@example.com"
              autoComplete="email"
            />
            {errors.email && <span className="su-error">{errors.email}</span>}
          </div>

          <div className="su-field">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="홍길동"
              autoComplete="name"
            />
            {errors.name && <span className="su-error">{errors.name}</span>}
          </div>

          <div className="su-field">
            <label htmlFor="password">Password</label>
            <div className="su-password">
              <input
                id="password"
                name="password"
                type={showPw ? "text" : "password"}
                value={form.password}
                onChange={onChange}
                placeholder="8자 이상, 숫자/소문자/대문자/특수문자 포함"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="su-eye"
                aria-label={showPw ? "비밀번호 숨기기" : "비밀번호 표시"}
                onClick={() => setShowPw((s) => !s)}
              >
                {showPw ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.password && <span className="su-error">{errors.password}</span>}
          </div>

          <div className="su-field">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPw ? "text" : "password"}
              value={form.confirmPassword}
              onChange={onChange}
              placeholder="비밀번호를 다시 입력하세요"
              autoComplete="new-password"
            />
            {errors.confirmPassword && <span className="su-error">{errors.confirmPassword}</span>}
          </div>

          <label className="su-check">
            <input
              type="checkbox"
              name="agree"
              checked={form.agree}
              onChange={onChange}
            />
            <span>
              <b>이용약관</b> 및 <b>개인정보 처리방침</b>에 동의합니다.
            </span>
          </label>
          {errors.agree && <span className="su-error">{errors.agree}</span>}

          <button
            className="su-submit"
            type="submit"
            disabled={submitting}
          >
            {submitting ? "가입 중..." : "회원가입"}
          </button>

          <p className="su-foot">
            이미 계정이 있으신가요? <Link to="/login">로그인</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

