
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Trash, Reply, Forward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMail } from '../contexts/MailContext';
import { useTranslation } from '../hooks/useTranslation';
import { toast } from 'sonner';

const MailDetail: React.FC = () => {
  const { state, dispatch } = useMail();
  const { t } = useTranslation();

  if (!state.selectedMail) return null;

  const mail = state.selectedMail;

  const handleBack = () => {
    dispatch({ type: 'SET_SELECTED_MAIL', payload: null });
  };

  const handleStarToggle = () => {
    dispatch({
      type: 'UPDATE_MAIL',
      payload: { id: mail.id, updates: { starred: !mail.starred } }
    });
  };

  const handleDelete = () => {
    dispatch({ type: 'DELETE_MAIL', payload: mail.id });
    dispatch({ type: 'SET_SELECTED_MAIL', payload: null });
    toast.success(t('mailDeleted'));
  };

  const handleReply = () => {
    dispatch({ type: 'TOGGLE_COMPOSE' });
    // In a real app, you'd pre-fill the compose form with reply data
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      transition={{ type: "spring", damping: 25 }}
      className="flex-1 bg-white dark:bg-gray-800 flex flex-col h-full"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('back')}
            </Button>
          </motion.div>

          <div className="flex items-center space-x-2">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button variant="ghost" size="sm" onClick={handleStarToggle}>
                <Star 
                  className={`h-4 w-4 ${
                    mail.starred 
                      ? 'text-yellow-500 fill-yellow-500' 
                      : 'text-gray-400'
                  }`} 
                />
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleDelete}
                className="text-gray-400 hover:text-red-500"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {mail.subject}
          </h1>
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <div>
              <span className="font-medium">From: </span>
              <span>{mail.from}</span>
            </div>
            <span>{formatDate(mail.timestamp)}</span>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">To: </span>
            <span>{mail.to}</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="prose dark:prose-invert max-w-none"
        >
          <div className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 leading-relaxed">
            {mail.body}
          </div>
        </motion.div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex space-x-2">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button onClick={handleReply} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Reply className="h-4 w-4 mr-2" />
              Reply
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="outline" onClick={handleReply}>
              <Forward className="h-4 w-4 mr-2" />
              Forward
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default MailDetail;
