
import React from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Inbox,
  Star,
  Send,
  FileText,
  Archive,
  AlertTriangle,
  Trash,
  Clock,
  AlertCircle,
  FolderOpen,
  RefreshCw,
  File,
  BarChart3,
  Settings,
  Calendar,
  Edit3,
  Briefcase,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMail } from '../contexts/MailContext';
import { useTranslation } from '../hooks/useTranslation';

const sidebarItems = [
  { id: 'compose', icon: Edit3, label: 'compose', action: true },
  { id: 'inbox', icon: Inbox, label: 'inbox', count: true },
  { id: 'starred', icon: Star, label: 'starred' },
  { id: 'sent', icon: Send, label: 'sent' },
  { id: 'drafts', icon: FileText, label: 'drafts' },
  { id: 'allmail', icon: Mail, label: 'allMail' },
  { id: 'spam', icon: AlertTriangle, label: 'spam' },
  { id: 'trash', icon: Trash, label: 'trash' },
  { id: 'scheduled', icon: Clock, label: 'scheduled' },
  { id: 'important', icon: AlertCircle, label: 'important' },
  { id: 'archive', icon: Archive, label: 'archive' },
  { id: 'outbox', icon: RefreshCw, label: 'outbox' },
];

const customFolders = [
  { id: 'work', icon: Briefcase, label: 'Work' },
  { id: 'personal', icon: User, label: 'Personal' },
];

const bottomItems = [
  { id: 'templates', icon: File, label: 'templates' },
  { id: 'reports', icon: BarChart3, label: 'reports' },
  { id: 'settings', icon: Settings, label: 'settings', action: true },
  { id: 'calendar', icon: Calendar, label: 'calendar' },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const { state, dispatch } = useMail();
  const { t } = useTranslation();

  const handleItemClick = (item: any) => {
    if (item.id === 'compose') {
      dispatch({ type: 'TOGGLE_COMPOSE' });
    } else if (item.id === 'settings') {
      dispatch({ type: 'TOGGLE_SETTINGS' });
    } else {
      dispatch({ type: 'SET_CURRENT_FOLDER', payload: item.id });
    }
  };

  const getUnreadCount = (folder: string) => {
    return state.mails.filter(mail => mail.folder === folder && !mail.read).length;
  };

  const renderSidebarItem = (item: any, isCustom = false) => {
    const Icon = item.icon;
    const isActive = state.currentFolder === item.id;
    const unreadCount = item.count ? getUnreadCount(item.id) : 0;
    const label = isCustom ? item.label : t(item.label as any);

    return (
      <motion.div
        key={item.id}
        whileHover={{ x: 4, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <Button
          variant={isActive ? "secondary" : "ghost"}
          className={`w-full justify-start mb-2 h-12 rounded-xl transition-all duration-200 ${
            isActive 
              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40' 
              : 'hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-md'
          } ${
            item.id === 'compose' 
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 font-semibold' 
              : ''
          }`}
          onClick={() => handleItemClick(item)}
        >
          <Icon className={`h-5 w-5 ${isCollapsed ? '' : 'mr-3'}`} />
          {!isCollapsed && (
            <>
              <span className="flex-1 text-left font-medium">{label}</span>
              {unreadCount > 0 && (
                <Badge 
                  variant="secondary" 
                  className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm"
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Badge>
              )}
            </>
          )}
        </Button>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", damping: 25 }}
      className={`h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300 shadow-xl ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700">
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center space-x-3"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-xl text-gray-900 dark:text-white">
                BAAP Mail
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Professional Email
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {sidebarItems.map(item => renderSidebarItem(item))}
        </div>

        {/* Custom Folders */}
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <div className="flex items-center space-x-2 px-3 py-2 mb-3">
              <FolderOpen className="h-4 w-4 text-gray-400" />
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Custom Folders
              </h3>
            </div>
            <div className="space-y-1">
              {customFolders.map(item => renderSidebarItem(item, true))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom Items */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700">
        <div className="space-y-1">
          {bottomItems.map(item => renderSidebarItem(item))}
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
