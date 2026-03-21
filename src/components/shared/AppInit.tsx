"use client";

import { useEffect } from "react";
import { initAmplitude, Analytics } from "@/lib/amplitude";
import { getTelegramUser, initTelegram } from "@/lib/telegram";
import { ADMIN_TG_COOKIE } from "@/lib/admin-constants";

export default function AppInit() {
  useEffect(() => {
    const init = async () => {
      if (typeof window === 'undefined') return;

      try {
        // Инициализация Telegram SDK
        await initTelegram();

        const tgUser = getTelegramUser();
        if (tgUser?.id) {
          document.cookie = `${ADMIN_TG_COOKIE}=${tgUser.id}; path=/; max-age=2592000; samesite=lax`;
        } else {
          document.cookie = `${ADMIN_TG_COOKIE}=; path=/; max-age=0; samesite=lax`;
        }
        
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
