"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUser, setUser, logout, type User } from "@/lib/storage";

function fmtDate(ts: number) { try { const d = new Date(ts); return d.getFullYear() + "." + (d.getMonth() + 1) + "." + d.getDate(); } catch { return ""; } }

export default function LoginForm() {
  const router = useRouter();
  const [current, setCurrent] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [sid, setSid] = useState("");
  const [err, setErr] = useState("");
  useEffect(() => { setCurrent(getUser()); }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const nm = name.trim();
    if (!nm) { setErr("이름(또는 닉네임)을 입력해 주세요."); return; }
    const prev = getUser();
    setUser({ name: nm, sid: sid.trim(), since: prev && prev.since ? prev.since : Date.now() });
    router.push("/");
  }
  function doLogout() { logout(); setCurrent(null); setName(""); setSid(""); }

  return (
    <div className="card auth-card glass">
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <span className="brand__logo" style={{ width: 54, height: 54, fontSize: "1.3rem", margin: "0 auto" }}>ML</span>
      </div>
      <h1 className="center">로컬 로그인</h1>
      <p className="muted center" style={{ marginTop: -4 }}>서버 인증 없이 이름만으로 시작합니다.<br />모든 학습 기록은 <b>이 브라우저(localStorage)</b>에만 저장됩니다.</p>

      <div style={{ margin: "18px 0" }}>
        {current ? (
          <>
            <div className="callout callout--tip"><div className="co-head">✔ 로그인 상태</div>
              <p><b>{current.name}</b>{current.sid ? " · " + current.sid : ""} 님으로 로그인되어 있습니다. (시작일 {fmtDate(current.since)})</p>
            </div>
            <div className="btn-row" style={{ marginTop: 12 }}>
              <Link className="btn btn--primary" href="/">대시보드로 이동 →</Link>
              <button type="button" className="btn btn--ghost" onClick={doLogout}>로그아웃</button>
            </div>
          </>
        ) : (
          <div className="callout callout--warn"><div className="co-head">로그인되지 않음</div><p>이름만 입력하면 바로 시작할 수 있습니다.</p></div>
        )}
      </div>

      {!current ? (
        <form onSubmit={submit}>
          <div className="form-group"><label htmlFor="nameInput">이름 / 닉네임 <span style={{ color: "var(--red)" }}>*</span></label>
            <input id="nameInput" type="text" placeholder="예: 함인수" autoComplete="off" value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div className="form-group"><label htmlFor="sidInput">학번 / 별칭 (선택)</label>
            <input id="sidInput" type="text" placeholder="예: 20251234 (선택 입력)" autoComplete="off" value={sid} onChange={(e) => setSid(e.target.value)} /></div>
          {err ? <div className="callout callout--danger" style={{ marginBottom: 12 }}>{err}</div> : null}
          <button type="submit" className="btn btn--primary btn--block">로그인하고 시작하기 →</button>
        </form>
      ) : null}

      <p className="muted center" style={{ fontSize: ".8rem", marginTop: 16 }}>로그인은 선택 사항입니다. 게스트로도 모든 기능을 사용할 수 있어요.</p>
      <div className="center" style={{ marginTop: 8 }}><Link href="/">← 대시보드로 돌아가기</Link></div>
    </div>
  );
}
