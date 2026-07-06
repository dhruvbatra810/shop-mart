"use client";
import { useEffect, useState } from "react";

export default function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent));
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);
  }, []);

  if (isStandalone || !isIOS) return null;

  return (
    <div className="fixed bottom-4 inset-x-4 z-50 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl shadow-lg p-4 text-sm text-zinc-900 dark:text-zinc-100">
      <p className="font-medium mb-1">Install ShopSmart</p>
      <p className="text-zinc-600 dark:text-zinc-400">
        Tap the share icon, then &quot;Add to Home Screen&quot; to install.
      </p>
    </div>
  );
}
