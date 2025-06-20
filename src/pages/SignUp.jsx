import { useState } from "react";
import { Link } from "react-router-dom";
import "./SignUp.css";

export default function SignUp() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
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
    if (!form.name.trim()) e.name = "이름을 입력해주세요.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "이메일 형식이 올바르지 않습니다.";
    if (form.password.length < 8) e.password = "비밀번호는 8자 이상이어야 합니다.";
    if (form.password !== form.confirm) e.confirm = "비밀번호가 일치하지 않습니다.";
    if (!form.agree) e.agree = "약관에 동의해주세요.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      // TODO: 실제 회원가입 API 호출
      // await api.signUp(form)
      await new Promise((r) => setTimeout(r, 800));
      alert("회원가입이 완료되었습니다!");
    } catch (err) {
      alert("회원가입 중 오류가 발생했습니다.");
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
            <label htmlFor="name">이름</label>
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
            <label htmlFor="email">이메일</label>
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

          <div className="su-grid">
            <div className="su-field">
              <label htmlFor="password">비밀번호</label>
              <div className="su-password">
                <input
                  id="password"
                  name="password"
                  type={showPw ? "text" : "password"}
                  value={form.password}
                  onChange={onChange}
                  placeholder="8자 이상 입력"
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
              <label htmlFor="confirm">비밀번호 확인</label>
              <input
                id="confirm"
                name="confirm"
                type={showPw ? "text" : "password"}
                value={form.confirm}
                onChange={onChange}
                placeholder="다시 입력"
                autoComplete="new-password"
              />
              {errors.confirm && <span className="su-error">{errors.confirm}</span>}
            </div>
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

