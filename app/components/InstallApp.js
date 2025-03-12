"use client";

import { useEffect, useState } from "react";

export default function InstallApp() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault(); // Prevent default prompt
      setDeferredPrompt(event); // Store event
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt(); // Show install prompt

    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  return !isInstalled && deferredPrompt ? (
    <button
      onClick={handleInstallClick}
      className="text-white hover:text-gray-300 transition duration-200 mx-2 md:mx-0"
    >
      Install App
    </button>
  ) : null;
}
