
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMail } from '../contexts/MailContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import LoginPage from '../components/LoginPage';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import MainContent from '../components/MainContent';
import ComposeModal from '../components/ComposeModal';
import SettingsPanel from '../components/SettingsPanel';
import FloatingComposeButton from '../components/FloatingComposeButton';
import { Toaster } from 'sonner';
import { toast } from 'sonner';
import { useTranslation } from '../hooks/useTranslation';

const MailApp: React.FC = () => {
  const { state } = useMail();
  const { t } = useTranslation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile screen
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Toast for new mails
  useEffect(() => {
    const newMails = state.mails.filter(mail => 
      !mail.read && 
      mail.folder === 'inbox' && 
      new Date(mail.timestamp).getTime() > Date.now() - 60000 // Last minute
    );

    if (newMails.length > 0 && state.settings.notifications) {
      const latestMail = newMails[0];
      toast.success(`${t('newMail')}: ${latestMail.from}`, {
        description: latestMail.subject,
        action: {
          label: 'View',
          onClick: () => {
            // Navigate to inbox and select mail
            dispatch({ type: 'SET_CURRENT_FOLDER', payload: 'inbox' });
            dispatch({ type: 'SET_SELECTED_MAIL', payload: latestMail });
          },
        },
      });
    }
  }, [state.mails, state.settings.notifications, t]);

  if (!state.user) {
    return <LoginPage />;
  }

  return (
    <div className="h-screen flex bg-gray-100 dark:bg-gray-900 overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence>
        {(!isMobile || !sidebarCollapsed) && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", damping: 25 }}
            className={isMobile ? 'fixed inset-y-0 left-0 z-40' : 'relative'}
          >
            <Sidebar
              isCollapsed={sidebarCollapsed && !isMobile}
              onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <MainContent />
      </div>

      {/* Modals and Overlays */}
      <ComposeModal />
      <SettingsPanel />
      <FloatingComposeButton />

      {/* Mobile Sidebar Backdrop */}
      {isMobile && !sidebarCollapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      {/* Toast Container */}
      <Toaster 
        position="bottom-right" 
        richColors 
        closeButton
        theme={state.settings.theme === 'system' ? undefined : state.settings.theme}
      />
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <ThemeProvider>
      <MailApp />
    </ThemeProvider>
  );
};

export default Index;
