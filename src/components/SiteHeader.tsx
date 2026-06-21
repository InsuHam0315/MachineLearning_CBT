"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getUser, type User } from "@/lib/storage";

const NAV = [
  { label: "홈", href: "/", match: "/" },
  { label: "개념", href: "/notes", match: "/notes" },
  { label: "공식", href: "/notes#sec-formulas", match: "__none" },
  { label: "계산형", href: "/practice/calculation", match: "/practice/calculation" },
  { label: "서술형", href: "/practice/descriptive", match: "/practice/descriptive" },
  { label: "모의1", href: "/practice/mock-01", match: "/practice/mock-01" },
  { label: "모의2", href: "/practice/mock-02", match: "/practice/mock-02" },
  { label: "모의3", href: "/practice/mock-03", match: "/practice/mock-03" },
  { label: "오답", href: "/review/wrong-notes", match: "/review/wrong-notes" },
  { label: "기록", href: "/stats/study-record", match: "/stats/study-record" },
];

export default function SiteHeader() {
  const pathname = usePathname() || "/";
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => { setUser(getUser()); }, []);

  const isActive = (m: string) => (m === "/" ? pathname === "/" : m !== "__none" && pathname.startsWith(m));

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="brand" href="/">
          <span className="brand__logo">ML</span>
          <span>머신러닝 기말 대비<small>서술형·계산형 풀이 트레이너</small></span>
        </Link>
        <button className="nav-toggle" aria-label="메뉴" onClick={() => setOpen((v) => !v)}>☰</button>
        <nav className={"nav" + (open ? " is-open" : "")}>
          {NAV.map((n) => (
            <Link key={n.label} href={n.href} className={isActive(n.match) ? "is-active" : ""} onClick={() => setOpen(false)}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="header-right">
          {user ? (
            <Link className="user-chip" href="/stats/study-record" title="학습기록 보기">
              <span className="dot"></span>{user.name}
            </Link>
          ) : (
            <Link className="user-chip is-guest" href="/login">
              <span className="dot"></span>게스트 · 로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
