import Link from 'next/link';
import type { ReactNode } from 'react';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&family=Inter:wght@400;500;600&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  html{background:#0a0c0a;scroll-behavior:smooth;}
  body{background:#0a0c0a;color:#f3f5ef;font-family:'Inter',sans-serif;-webkit-font-smoothing:antialiased;}
  .lp-wrap{max-width:760px;margin:0 auto;padding:0 24px;}
  .lp-header{padding:28px 0 0;}
  .lp-nav{display:flex;align-items:center;gap:12px;padding-bottom:32px;border-bottom:1px solid #252b21;}
  .lp-nav a{color:#98a190;text-decoration:none;font-size:13px;}
  .lp-nav a:hover{color:#f3f5ef;}
  .lp-nav .sep{color:#252b21;}
  .lp-hero{padding:48px 0 40px;}
  .lp-tag{font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#3ea293;margin-bottom:12px;}
  .lp-title{font-family:'Montserrat',sans-serif;font-size:32px;font-weight:900;color:#f3f5ef;line-height:1.15;margin-bottom:12px;}
  .lp-meta{font-size:12.5px;color:#666f60;}
  .lp-body{padding-bottom:72px;}
  .lp-body h2{font-family:'Montserrat',sans-serif;font-size:17px;font-weight:800;color:#f3f5ef;margin:36px 0 12px;}
  .lp-body h3{font-size:14px;font-weight:700;color:#c9cccb;margin:24px 0 8px;}
  .lp-body p{font-size:14px;line-height:1.75;color:#98a190;margin-bottom:14px;}
  .lp-body ul,.lp-body ol{font-size:14px;line-height:1.75;color:#98a190;padding-left:22px;margin-bottom:14px;}
  .lp-body li{margin-bottom:6px;}
  .lp-body a{color:#34f5c5;text-decoration:none;}
  .lp-body a:hover{text-decoration:underline;}
  .lp-body strong{color:#f3f5ef;font-weight:600;}
  .lp-body hr{border:none;border-top:1px solid #252b21;margin:36px 0;}
  .lp-footer{padding:28px 0 32px;border-top:1px solid #252b21;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;}
  .lp-footer-brand{font-size:12px;color:#666f60;}
  .lp-footer-links{display:flex;gap:20px;font-size:12px;}
  .lp-footer-links a{color:#666f60;text-decoration:none;}
  .lp-footer-links a:hover{color:#98a190;}
  @media(max-width:600px){.lp-title{font-size:26px;}.lp-footer{flex-direction:column;align-items:flex-start;}}
`;

export default function LegalPageLayout({
  tag,
  title,
  updated,
  children,
}: {
  tag: string;
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="lp-wrap">

        <header className="lp-header">
          <nav className="lp-nav">
            <Link href="/">
              <img src="/assets/logo-mark.webp" alt="AIRLOCAL" style={{ height: 20, width: 'auto', verticalAlign: 'middle' }} />
            </Link>
            <span className="sep">›</span>
            <span style={{ fontSize: 13, color: '#f3f5ef' }}>{title}</span>
          </nav>
        </header>

        <div className="lp-hero">
          <div className="lp-tag">{tag}</div>
          <h1 className="lp-title">{title}</h1>
          <p className="lp-meta">Última actualización: {updated}</p>
        </div>

        <main className="lp-body">
          {children}
        </main>

        <footer className="lp-footer">
          <span className="lp-footer-brand">AIRLOCAL™ by propiqdata.com — © 2026</span>
          <div className="lp-footer-links">
            <Link href="/terms">Términos</Link>
            <Link href="/privacy">Privacidad</Link>
            <Link href="/refund-policy">Reembolso</Link>
            <a href="mailto:soporte@propiqdata.com">Soporte</a>
          </div>
        </footer>

      </div>
    </>
  );
}
