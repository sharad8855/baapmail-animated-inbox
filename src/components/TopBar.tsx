
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
      className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-4 space-x-4"
    >
      {/* Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggleSidebar}
        className="lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Search Bar */}
      <motion.div
        className="flex-1 max-w-2xl"
        animate={{ scale: searchFocused ? 1.02 : 1 }}
        transition={{ type: "spring", damping: 25 }}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder={t('search')}
            value={state.searchQuery}
            onChange={handleSearch}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="pl-10 w-full"
          />
        </div>
      </motion.div>

      {/* Right Side Icons */}
      <div className="flex items-center space-x-2">
        {/* Notifications */}
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
          </Button>
        </motion.div>

        {/* Profile */}
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Button variant="ghost" size="sm" className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span className="hidden sm:inline text-sm font-medium">
              {state.user?.username}
            </span>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TopBar;
