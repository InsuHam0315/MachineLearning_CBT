"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getUser, type User } from "@/lib/storage";
import ThemeToggle from "./ThemeToggle";
import FontSizeToggle from "./FontSizeToggle";

const NAV = [
  { label: "개념", href: "/notes", match: "/notes" },
  { label: "계산형", href: "/practice/calculation", match: "/practice/calculation" },
  { label: "서술형", href: "/practice/descriptive", match: "/practice/descriptive" },
  { label: "모의고사", href: "/practice/mock-01", match: "/practice/mock-0" },
  { label: "오답노트", href: "/review/wrong-notes", match: "/review" },
  { label: "기록", href: "/stats/study-record", match: "/stats" },
];

export default function Header() {
  const pathname = usePathname() || "/";
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => { setUser(getUser()); }, []);
  const active = (m: string) => pathname.startsWith(m);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="brand" href="/">
          <span className="brand__logo">ML</span>
          <span>머신러닝 기말<small>서술·계산형 대비</small></span>
        </Link>
        <span className="brand-range nowrap">1–7강</span>
        <button className="nav-toggle" aria-label="메뉴 열기" onClick={() => setOpen((v) => !v)}>≡</button>
        <nav className={"nav" + (open ? " is-open" : "")}>
          {NAV.map((n) => (
            <Link key={n.label} href={n.href} className={active(n.match) ? "is-active" : ""} onClick={() => setOpen(false)}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="header-right">
          <FontSizeToggle />
          <ThemeToggle />
          {user ? (
            <Link className="user-chip" href="/stats/study-record" title="학습기록"><span className="dot"></span>{user.name}</Link>
          ) : (
            <Link className="user-chip" href="/login"><span className="dot"></span>로그인</Link>
          )}
        </div>
      </div>
    </header>
  );
}
