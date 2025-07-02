
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
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          variant={isActive ? "secondary" : "ghost"}
          className={`w-full justify-start mb-1 h-10 ${
            isActive ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : ''
          } ${item.id === 'compose' ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}`}
          onClick={() => handleItemClick(item)}
        >
          <Icon className={`h-4 w-4 ${isCollapsed ? '' : 'mr-3'}`} />
          {!isCollapsed && (
            <>
              <span className="flex-1 text-left">{label}</span>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-auto bg-blue-600 text-white">
                  {unreadCount}
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
      className={`h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Mail className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900 dark:text-white">
              BAAP Mail
            </span>
          </motion.div>
        )}
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {sidebarItems.map(item => renderSidebarItem(item))}
        </div>

        {/* Custom Folders */}
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6"
          >
            <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Custom Folders
            </h3>
            <div className="space-y-1">
              {customFolders.map(item => renderSidebarItem(item, true))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom Items */}
      <div className="p-2 border-t border-gray-200 dark:border-gray-700">
        <div className="space-y-1">
          {bottomItems.map(item => renderSidebarItem(item))}
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
