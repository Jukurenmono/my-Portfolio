import { useEffect, useState } from "react";
import ProfessionalSite from "../components/ProfessionalSite";
import ShowcaseSite from "../components/ShowcaseSite";

type Version = "professional" | "showcase";

export default function Page() {
  const [version, setVersion] = useState<Version>("professional");

  // Restore saved choice
  useEffect(() => {
    try {
      const saved = localStorage.getItem("site-version");
      if (saved === "showcase" || saved === "professional") setVersion(saved);
    } catch {}
  }, []);

  const switchVersion = () => {
    const next: Version = version === "professional" ? "showcase" : "professional";
    setVersion(next);
    try { localStorage.setItem("site-version", next); } catch {}
    window.scrollTo({ top: 0 });
  };

  return (
    <>
      {version === "professional" ? <ProfessionalSite /> : <ShowcaseSite />}
      <button
        onClick={switchVersion}
        style={{ zIndex: 300 }}
        className="fixed bottom-6 right-6 rounded-full border border-white/20 bg-slate-900/90 px-4 py-2 text-xs font-medium text-white shadow-lg backdrop-blur transition-colors hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
      >
        {version === "professional" ? "View original design" : "View simple version"}
      </button>
    </>
  );
}