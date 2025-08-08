import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import "../config/cognito";
import { loginUser, getErrorMessage } from "../services/auth";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
    rememberMe: false,
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
    if (!form.username.trim()) e.username = "아이디를 입력해주세요.";
    if (!form.password) e.password = "비밀번호를 입력해주세요.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const result = await loginUser(form.username, form.password);

      if (result.success) {
        // 로그인 성공
        alert("로그인 성공!");

        // 전체 페이지 새로고침으로 App 상태 갱신
        window.location.href = "/";
      } else {
        // 로그인 실패
        const errorMsg = getErrorMessage(result.code);
        setErrors({ general: errorMsg });
        console.error("Login error:", result);
      }
    } catch (err) {
      setErrors({ general: "로그인 중 오류가 발생했습니다." });
      console.error("Unexpected error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <div className="login-logo">Logo</div>
          <h1>Welcome back</h1>
          <p className="login-sub">로그인하고 서비스를 이용하세요.</p>
        </div>

        <form className="login-form" onSubmit={onSubmit} noValidate>
          {errors.general && (
            <div className="login-error-banner">{errors.general}</div>
          )}

          <div className="login-field">
            <label htmlFor="username">아이디</label>
            <input
              id="username"
              name="username"
              value={form.username}
              onChange={onChange}
              placeholder="아이디를 입력하세요"
              autoComplete="username"
              autoFocus
            />
            {errors.username && (
              <span className="login-error">{errors.username}</span>
            )}
          </div>

          <div className="login-field">
            <label htmlFor="password">비밀번호</label>
            <div className="login-password">
              <input
                id="password"
                name="password"
                type={showPw ? "text" : "password"}
                value={form.password}
                onChange={onChange}
                placeholder="비밀번호를 입력하세요"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="login-eye"
                aria-label={showPw ? "비밀번호 숨기기" : "비밀번호 표시"}
                onClick={() => setShowPw((s) => !s)}
              >
                {showPw ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.password && (
              <span className="login-error">{errors.password}</span>
            )}
          </div>

          <div className="login-options">
            <label className="login-check">
              <input
                type="checkbox"
                name="rememberMe"
                checked={form.rememberMe}
                onChange={onChange}
              />
              <span>로그인 상태 유지</span>
            </label>
            <Link to="/forgot-password" className="login-forgot">
              비밀번호 찾기
            </Link>
          </div>

          <button
            className="login-submit"
            type="submit"
            disabled={submitting}
          >
            {submitting ? "로그인 중..." : "로그인"}
          </button>

          <p className="login-foot">
            아직 계정이 없으신가요? <Link to="/signup">회원가입</Link>
          </p>
        </form>
      </div>
    </div>
  );
}