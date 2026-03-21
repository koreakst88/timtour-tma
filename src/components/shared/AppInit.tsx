"use client";

import { useEffect } from "react";
import { initAmplitude, Analytics } from "@/lib/amplitude";
import { initTelegram } from "@/lib/telegram";

export default function AppInit() {
  useEffect(() => {
    try {
      // Инициализация Telegram SDK
      initTelegram();
      
      // Инициализация Amplitude
      initAmplitude();
      
      // Логгер открытия приложения
      Analytics.appOpened();
      
      console.log("SDKs Initialized successfully");
    } catch (error) {
      console.error("Failed to initialize SDKs:", error);
    }
  }, []);

  return null;
}
