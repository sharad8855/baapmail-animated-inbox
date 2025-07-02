
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sun, Moon, Monitor, Bell, Signature, User, LogOut, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMail } from '../contexts/MailContext';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../hooks/useTranslation';

const SettingsPanel: React.FC = () => {
  const { state, dispatch } = useMail();
  const { theme, setTheme, toggleTheme, getThemeIcon } = useTheme();
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

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun, emoji: '☀️' },
    { value: 'dark', label: 'Dark', icon: Moon, emoji: '🌙' },
    { value: 'system', label: 'System', icon: Monitor, emoji: '🖥️' },
  ];

  return (
    <AnimatePresence>
      {state.isSettingsOpen && (
        <>
          {/* Professional Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={handleClose}
          />

          {/* Professional Settings Panel */}
          <motion.div
            initial={{ x: 400, opacity: 0, scale: 0.95 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: 400, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md glass-effect shadow-professional-xl z-50 overflow-y-auto border-l border-border/50"
          >
            {/* Professional Header */}
            <div className="sticky top-0 glass-effect border-b border-border/50 p-6 z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Palette className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold text-foreground">
                    {t('settings')}
                  </h2>
                </div>
                <Button variant="ghost" size="sm" onClick={handleClose} className="hover-professional">
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Professional Settings Content */}
            <div className="p-6 space-y-8">
              {/* Theme Settings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-foreground flex items-center">
                    <div className="p-2 bg-primary/10 rounded-lg mr-3">
                      <Sun className="h-4 w-4 text-primary" />
                    </div>
                    {t('theme')}
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleTheme}
                    className="hover-professional"
                  >
                    <span className="mr-2">{getThemeIcon()}</span>
                    Quick Toggle
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  {themeOptions.map(({ value, label, icon: Icon, emoji }) => (
                    <motion.button
                      key={value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setTheme(value as any)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        theme === value
                          ? 'border-primary bg-primary/5 shadow-professional'
                          : 'border-border hover:border-primary/50 hover:bg-primary/2'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          theme === value ? 'bg-primary text-primary-foreground' : 'bg-muted'
                        }`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="text-left flex-1">
                          <div className="font-medium text-foreground">{t(value as any)}</div>
                          <div className="text-sm text-muted-foreground">
                            {value === 'system' ? 'Matches your device' : 
                             value === 'light' ? 'Clean and bright' : 'Easy on the eyes'}
                          </div>
                        </div>
                        <span className="text-lg">{emoji}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Language Settings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-medium text-foreground flex items-center">
                  <div className="p-2 bg-primary/10 rounded-lg mr-3">
                    <span className="text-sm">🌐</span>
                  </div>
                  {t('language')}
                </h3>
                <Select
                  value={state.settings.language}
                  onValueChange={handleLanguageChange}
                >
                  <SelectTrigger className="focus-professional">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">🇺🇸 English</SelectItem>
                    <SelectItem value="mr">🇮🇳 मराठी (Marathi)</SelectItem>
                    <SelectItem value="hi">🇮🇳 हिंदी (Hindi)</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>

              {/* Preferences */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-medium text-foreground flex items-center">
                  <div className="p-2 bg-primary/10 rounded-lg mr-3">
                    <Bell className="h-4 w-4 text-primary" />
                  </div>
                  Preferences
                </h3>

                {/* Auto Refresh */}
                <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
                      <span className="text-sm">🔄</span>
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{t('autoRefresh')}</div>
                      <div className="text-sm text-muted-foreground">Get new emails automatically</div>
                    </div>
                  </div>
                  <Switch
                    checked={state.settings.autoRefresh}
                    onCheckedChange={(checked) => handleSettingChange('autoRefresh', checked)}
                  />
                </div>

                {/* Notifications */}
                <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                      <Bell className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{t('notifications')}</div>
                      <div className="text-sm text-muted-foreground">Show desktop notifications</div>
                    </div>
                  </div>
                  <Switch
                    checked={state.settings.notifications}
                    onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
                  />
                </div>
              </motion.div>

              {/* Email Signature */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-4"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Signature className="h-4 w-4 text-primary" />
                  </div>
                  <label className="text-lg font-medium text-foreground">
                    {t('signature')}
                  </label>
                </div>
                <Input
                  value={state.settings.signature}
                  onChange={(e) => handleSettingChange('signature', e.target.value)}
                  placeholder="Enter your professional email signature"
                  className="focus-professional"
                />
              </motion.div>

              {/* Account Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="pt-6 border-t border-border"
              >
                <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
                  <div className="p-2 bg-primary/10 rounded-lg mr-3">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  Account Information
                </h3>
                
                <div className="space-y-3 p-4 rounded-lg bg-muted/30 border border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Username</span>
                    <span className="text-sm text-foreground font-medium">{state.user?.username}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Email</span>
                    <span className="text-sm text-foreground font-medium">{state.user?.email}</span>
                  </div>
                </div>
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-6"
                >
                  <Button
                    variant="outline"
                    onClick={() => dispatch({ type: 'LOGOUT' })}
                    className="w-full border-destructive/20 text-destructive hover:bg-destructive hover:text-destructive-foreground hover-professional"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SettingsPanel;
