
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sun, Moon, Monitor, Bell, Signature } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMail } from '../contexts/MailContext';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../hooks/useTranslation';

const SettingsPanel: React.FC = () => {
  const { state, dispatch } = useMail();
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();

  const handleClose = () => {
    dispatch({ type: 'TOGGLE_SETTINGS' });
  };

  const handleSettingChange = (key: string, value: any) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: { [key]: value } });
  };

  const handleLanguageChange = (language: 'en' | 'mr' | 'hi') => {
    handleSettingChange('language', language);
  };

  const themeIcons = {
    light: Sun,
    dark: Moon,
    system: Monitor,
  };

  return (
    <AnimatePresence>
      {state.isSettingsOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={handleClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t('settings')}
              </h2>
              <Button variant="ghost" size="sm" onClick={handleClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Settings Content */}
            <div className="p-6 space-y-6">
              {/* Theme Settings */}
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                  <Sun className="h-5 w-5 mr-2" />
                  {t('theme')}
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(themeIcons).map(([themeOption, Icon]) => (
                    <motion.button
                      key={themeOption}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setTheme(themeOption as any)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        theme === themeOption
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="h-6 w-6 mx-auto mb-1" />
                      <span className="text-sm capitalize">
                        {t(themeOption as any)}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Language Settings */}
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {t('language')}
                </h3>
                <Select
                  value={state.settings.language}
                  onValueChange={handleLanguageChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="mr">मराठी (Marathi)</SelectItem>
                    <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Auto Refresh */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <span className="text-gray-900 dark:text-white">
                    {t('autoRefresh')}
                  </span>
                </div>
                <Switch
                  checked={state.settings.autoRefresh}
                  onCheckedChange={(checked) => handleSettingChange('autoRefresh', checked)}
                />
              </div>

              {/* Notifications */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <span className="text-gray-900 dark:text-white">
                    {t('notifications')}
                  </span>
                </div>
                <Switch
                  checked={state.settings.notifications}
                  onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
                />
              </div>

              {/* Email Signature */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Signature className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <label className="text-gray-900 dark:text-white font-medium">
                    {t('signature')}
                  </label>
                </div>
                <Input
                  value={state.settings.signature}
                  onChange={(e) => handleSettingChange('signature', e.target.value)}
                  placeholder="Enter your email signature"
                />
              </div>

              {/* User Info */}
              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  Account Info
                </h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <p><span className="font-medium">Username:</span> {state.user?.username}</p>
                  <p><span className="font-medium">Email:</span> {state.user?.email}</p>
                </div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-4"
                >
                  <Button
                    variant="outline"
                    onClick={() => dispatch({ type: 'LOGOUT' })}
                    className="w-full"
                  >
                    Logout
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SettingsPanel;
