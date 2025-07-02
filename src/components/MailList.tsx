
import React from 'react';
import { motion } from 'framer-motion';
import { Star, Trash, Clock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMail, Mail as MailType } from '../contexts/MailContext';
import { toast } from 'sonner';
import { useTranslation } from '../hooks/useTranslation';

const MailList: React.FC = () => {
  const { state, dispatch } = useMail();
  const { t } = useTranslation();

  const getFilteredMails = () => {
    let mails = state.mails.filter(mail => {
      // Folder filter
      if (state.currentFolder !== 'allmail' && mail.folder !== state.currentFolder) {
        return false;
      }

      // Search filter
      if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase();
        return (
          mail.from.toLowerCase().includes(query) ||
          mail.subject.toLowerCase().includes(query) ||
          mail.to.toLowerCase().includes(query)
        );
      }

      return true;
    });

    // Apply additional filters
    if (state.filters.unreadOnly) {
      mails = mails.filter(mail => !mail.read);
    }

    if (state.filters.starredOnly) {
      mails = mails.filter(mail => mail.starred);
    }

    if (state.filters.lastWeek) {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      mails = mails.filter(mail => new Date(mail.timestamp) > weekAgo);
    }

    return mails.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const handleMailClick = (mail: MailType) => {
    dispatch({ type: 'SET_SELECTED_MAIL', payload: mail });
    if (!mail.read) {
      dispatch({ type: 'MARK_AS_READ', payload: mail.id });
    }
  };

  const handleStarToggle = (e: React.MouseEvent, mail: MailType) => {
    e.stopPropagation();
    dispatch({
      type: 'UPDATE_MAIL',
      payload: { id: mail.id, updates: { starred: !mail.starred } }
    });
  };

  const handleDelete = (e: React.MouseEvent, mailId: string) => {
    e.stopPropagation();
    dispatch({ type: 'DELETE_MAIL', payload: mailId });
    toast.success(t('mailDeleted'));
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const filteredMails = getFilteredMails();

  if (filteredMails.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg">No emails found</p>
          <p className="text-sm">Try adjusting your filters or search query</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 space-y-2">
        {filteredMails.map((mail, index) => (
          <motion.div
            key={mail.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
              mail.read
                ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
            } hover:shadow-md`}
            onClick={() => handleMailClick(mail)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className={`text-sm font-medium truncate ${
                    mail.read ? 'text-gray-900 dark:text-gray-100' : 'text-blue-900 dark:text-blue-100'
                  }`}>
                    {mail.from}
                  </span>
                  {!mail.read && (
                    <Badge variant="secondary" className="bg-blue-600 text-white text-xs">
                      New
                    </Badge>
                  )}
                </div>
                <h3 className={`font-medium truncate mb-1 ${
                  mail.read ? 'text-gray-800 dark:text-gray-200' : 'text-blue-800 dark:text-blue-200'
                }`}>
                  {mail.subject}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {mail.body}
                </p>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  {formatTime(mail.timestamp)}
                </span>
                
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleStarToggle(e, mail)}
                    className="p-1 h-8 w-8"
                  >
                    <Star 
                      className={`h-4 w-4 ${
                        mail.starred 
                          ? 'text-yellow-500 fill-yellow-500' 
                          : 'text-gray-400 hover:text-yellow-500'
                      }`} 
                    />
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleDelete(e, mail.id)}
                    className="p-1 h-8 w-8 text-gray-400 hover:text-red-500"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MailList;
