
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
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-gray-500 dark:text-gray-400"
        >
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 rounded-full flex items-center justify-center">
            <Mail className="h-10 w-10 text-blue-500 dark:text-blue-400" />
          </div>
          <p className="text-xl font-semibold mb-2">No emails found</p>
          <p className="text-sm">Try adjusting your filters or search query</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
      <div className="p-6 space-y-3">
        {filteredMails.map((mail, index) => (
          <motion.div
            key={mail.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 ${
              mail.read
                ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg'
                : 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border-blue-200 dark:border-blue-700 shadow-md hover:shadow-xl'
            } hover:border-blue-300 dark:hover:border-blue-600`}
            onClick={() => handleMailClick(mail)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
                    mail.read 
                      ? 'bg-gradient-to-r from-gray-400 to-gray-500' 
                      : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                  }`}>
                    {mail.from.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className={`text-sm font-semibold truncate block ${
                      mail.read ? 'text-gray-700 dark:text-gray-300' : 'text-blue-900 dark:text-blue-100'
                    }`}>
                      {mail.from}
                    </span>
                    {!mail.read && (
                      <Badge variant="secondary" className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                        New
                      </Badge>
                    )}
                  </div>
                </div>
                <h3 className={`font-semibold truncate mb-2 text-lg ${
                  mail.read ? 'text-gray-800 dark:text-gray-200' : 'text-blue-800 dark:text-blue-200'
                }`}>
                  {mail.subject}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate leading-relaxed">
                  {mail.body}
                </p>
              </div>

              <div className="flex items-center space-x-3 ml-6">
                <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap font-medium">
                  {formatTime(mail.timestamp)}
                </span>
                
                <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleStarToggle(e, mail)}
                    className="p-2 h-10 w-10 rounded-full hover:bg-yellow-100 dark:hover:bg-yellow-900/30"
                  >
                    <Star 
                      className={`h-5 w-5 transition-colors ${
                        mail.starred 
                          ? 'text-yellow-500 fill-yellow-500' 
                          : 'text-gray-400 hover:text-yellow-500'
                      }`} 
                    />
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleDelete(e, mail.id)}
                    className="p-2 h-10 w-10 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500"
                  >
                    <Trash className="h-5 w-5" />
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
