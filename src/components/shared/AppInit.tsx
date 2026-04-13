"use client";

import { useEffect } from "react";
import { initAmplitude, Analytics } from "@/lib/amplitude";
import { getTelegramUser, initTelegram } from "@/lib/telegram";
import { ADMIN_TG_COOKIE } from "@/lib/admin-constants";

export default function AppInit() {
  useEffect(() => {
    const applyTelegramScrollLock = () => {
      const tg = window?.Telegram?.WebApp

      document.documentElement.style.overscrollBehaviorY = 'none'
      document.body.style.overscrollBehaviorY = 'none'

      if (!tg) return

      tg.ready()
      tg.expand()

      // Запрещаем вертикальный свайп, чтобы Telegram
      // не сворачивал мини-приложение при активном скролле.
      if (typeof tg.disableVerticalSwipes === 'function') {
        tg.disableVerticalSwipes()
      }
    }

    if (typeof window !== 'undefined') {
      window.history.scrollRestoration = 'manual'
      applyTelegramScrollLock()
    }

    const init = async () => {
      if (typeof window === 'undefined') return;

      try {
        // Инициализация Telegram SDK
        await initTelegram();
        applyTelegramScrollLock()

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

    const reapplyLock = () => applyTelegramScrollLock()
    window.addEventListener('focus', reapplyLock)
    window.addEventListener('pageshow', reapplyLock)

    return () => {
      window.removeEventListener('focus', reapplyLock)
      window.removeEventListener('pageshow', reapplyLock)
    }
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
