export function TopBar({ current }: { current: "workspace" | "demo" }) {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <a href="/" className="brand">
          Proof<b>Pulse</b>
        </a>
        <span className="brand-sub">Don&apos;t pitch. Show what they could fix.</span>
        <nav className="topnav" aria-label="Main">
          <a href="/" aria-current={current === "workspace" ? "page" : undefined}>
            Workspace
          </a>
          <a href="/demo" aria-current={current === "demo" ? "page" : undefined}>
            Interactive demo
          </a>
        </nav>
      </div>
    </header>
  );
}
