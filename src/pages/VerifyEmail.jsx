import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "./VerifyEmail.css";
import "../config/cognito";
import { confirmUserSignUp, getErrorMessage } from "../services/auth";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();

  // SignUp 페이지에서 전달받은 username과 email
  const username = location.state?.username || "";
  const email = location.state?.email || "";

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // username이 없으면 회원가입 페이지로 리다이렉트
    if (!username) {
      alert("잘못된 접근입니다. 회원가입을 먼저 진행해주세요.");
      navigate("/signup");
    }
  }, [username, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!code.trim()) {
      setError("인증 코드를 입력해주세요.");
      return;
    }

    if (code.length !== 6) {
      setError("인증 코드는 6자리 숫자입니다.");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      const result = await confirmUserSignUp(username, code);

      if (result.success) {
        alert(
          `이메일 인증이 완료되었습니다!\n\n` +
          `이제 로그인할 수 있습니다.`
        );
        // 로그인 페이지로 이동 (또는 메인 페이지)
        navigate("/login"); // 로그인 페이지가 있다면
        // navigate("/"); // 또는 메인 페이지로
      } else {
        const errorMsg = getErrorMessage(result.code);
        setError(errorMsg);
        console.error("Verification error:", result);
      }
    } catch (err) {
      setError("인증 중 오류가 발생했습니다.");
      console.error("Unexpected error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="verify-page">
      <div className="verify-card">
        <div className="verify-brand">
          <div className="verify-logo">Logo</div>
          <h1>Verify your email</h1>
          <p className="verify-sub">
            이메일 <strong>{email}</strong>로 전송된<br />
            6자리 인증 코드를 입력해주세요.
          </p>
        </div>

        <form className="verify-form" onSubmit={onSubmit}>
          <div className="verify-field">
            <label htmlFor="code">인증 코드</label>
            <input
              id="code"
              name="code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="123456"
              maxLength={6}
              autoComplete="one-time-code"
              autoFocus
            />
            {error && <span className="verify-error">{error}</span>}
          </div>

          <button
            className="verify-submit"
            type="submit"
            disabled={submitting}
          >
            {submitting ? "인증 중..." : "인증하기"}
          </button>

          <div className="verify-foot">
            <p>인증 코드를 받지 못하셨나요?</p>
            <p className="verify-help">
              스팸 메일함을 확인하거나 몇 분 후 다시 시도해주세요.
            </p>
            <Link to="/signup" className="verify-link">
              회원가입 페이지로 돌아가기
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}