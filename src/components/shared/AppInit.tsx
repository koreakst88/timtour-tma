"use client";

import { useEffect } from "react";
import { initAmplitude, Analytics } from "@/lib/amplitude";
import { getTelegramUser, initTelegram } from "@/lib/telegram";
import { ADMIN_TG_COOKIE } from "@/lib/admin-constants";

export default function AppInit() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.history.scrollRestoration = 'manual'
    }

    const init = async () => {
      if (typeof window === 'undefined') return;

      const tg = window?.Telegram?.WebApp
      if (tg) {
        tg.ready()
        tg.expand()
        // Запрещаем вертикальный свайп 
        // чтобы не закрывалось при скролле
        if (tg.disableVerticalSwipes) {
          tg.disableVerticalSwipes()
        }
      }

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

  useEffect(() => {
    const tg = window?.Telegram?.WebApp

    // Telegram сам сообщает об открытии клавиатуры
    if (tg?.onEvent) {
      tg.onEvent('viewportChanged', (event: any) => {
        const tabbar = document.getElementById('tabbar')
        if (tabbar) {
          if (event.isStateStable === false) {
            tabbar.style.display = 'none'
          } else {
            tabbar.style.display = 'flex'
          }
        }
      })
    }
  }, [])

  return null;
}
