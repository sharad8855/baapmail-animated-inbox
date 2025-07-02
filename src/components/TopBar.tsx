
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Menu, User, Bell } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMail } from '../contexts/MailContext';
import { useTranslation } from '../hooks/useTranslation';

interface TopBarProps {
  onToggleSidebar: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onToggleSidebar }) => {
  const { state, dispatch } = useMail();
  const { t } = useTranslation();
  const [searchFocused, setSearchFocused] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value });
  };

  const unreadCount = state.mails.filter(mail => !mail.read).length;

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="h-18 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-700 flex items-center px-6 space-x-6 shadow-sm"
    >
      {/* Menu Button */}
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className="lg:hidden p-2 h-10 w-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        className="flex-1 max-w-2xl"
        animate={{ 
          scale: searchFocused ? 1.02 : 1,
          boxShadow: searchFocused ? '0 10px 25px rgba(0,0,0,0.1)' : '0 2px 4px rgba(0,0,0,0.05)'
        }}
        transition={{ type: "spring", damping: 25 }}
      >
        <div className="relative">
          <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors ${
            searchFocused ? 'text-blue-500' : 'text-gray-400'
          }`} />
          <Input
            type="text"
            placeholder={t('search')}
            value={state.searchQuery}
            onChange={handleSearch}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className={`pl-12 h-12 rounded-2xl border-2 transition-all duration-200 ${
              searchFocused 
                ? 'border-blue-300 bg-white dark:bg-gray-800' 
                : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'
            } focus:ring-2 focus:ring-blue-500/20`}
          />
        </div>
      </motion.div>

      {/* Right Side Icons */}
      <div className="flex items-center space-x-3">
        {/* Notifications */}
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Button 
            variant="ghost" 
            size="sm" 
            className="relative p-3 h-12 w-12 rounded-2xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 transition-all duration-200"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-6 w-6 rounded-full p-0 flex items-center justify-center bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold shadow-lg">
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
          </Button>
        </motion.div>

        {/* Profile */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center space-x-3 p-3 h-12 rounded-2xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-white dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <span className="hidden sm:inline text-sm font-semibold text-gray-700 dark:text-gray-300">
              {state.user?.username}
            </span>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TopBar;
