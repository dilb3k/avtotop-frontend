'use client';

import { useEffect, useState, ReactNode, createContext, useContext } from 'react';
import WebApp from '@twa-dev/sdk';

type WebAppType = typeof WebApp;

interface TelegramWebAppContextType {
  webApp: WebAppType | null;
  isReady: boolean;
  isExpanded: boolean;
  user: WebAppType['initDataUnsafe']['user'] | null;
}

const TelegramWebAppContext = createContext<TelegramWebAppContextType | null>(null);

export function TelegramWebAppProvider({ children }: { children: ReactNode }) {
  const [webApp, setWebApp] = useState<WebAppType | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [user, setUser] = useState<WebAppType['initDataUnsafe']['user'] | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const init = async () => {
      try {
        const wa = WebApp;
        setWebApp(wa);
        
        wa.ready();
        wa.expand();
        setIsExpanded(true);
        
        if (wa.initDataUnsafe?.user) {
          setUser(wa.initDataUnsafe.user);
        }
        
        wa.onEvent('viewportChanged', () => {
          setIsExpanded(wa.isExpanded);
        });
        
        setIsReady(true);
      } catch (error) {
        console.error('Telegram Web App init error:', error);
        setIsReady(true);
      }
    };

    init();
  }, []);

  return (
    <TelegramWebAppContext.Provider value={{ webApp, isReady, isExpanded, user }}>
      {children}
    </TelegramWebAppContext.Provider>
  );
}

export function useTelegramWebApp() {
  const context = useContext(TelegramWebAppContext);
  if (!context) {
    throw new Error('useTelegramWebApp must be used within TelegramWebAppProvider');
  }
  return context;
}