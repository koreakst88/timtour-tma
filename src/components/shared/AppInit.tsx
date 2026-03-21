"use client";

import { useEffect } from "react";
import { initAmplitude, Analytics } from "@/lib/amplitude";
import { initTelegram } from "@/lib/telegram";

export default function AppInit() {
  useEffect(() => {
    const init = async () => {
      if (typeof window === 'undefined') return;

      try {
        // Инициализация Telegram SDK
        await initTelegram();
        
        // Инициализация Amplitude
        initAmplitude();
        
        // Логгер открытия приложения
        Analytics.appOpened();
        
        console.log("SDKs Initialized successfully");
      } catch (error) {
        console.error("Failed to initialize SDKs:", error);
      }
    };

    init();
  }, []);

  return null;
}
