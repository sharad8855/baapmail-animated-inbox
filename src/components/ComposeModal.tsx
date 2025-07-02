
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useMail } from '../contexts/MailContext';
import { useTranslation } from '../hooks/useTranslation';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

const ComposeModal: React.FC = () => {
  const { state, dispatch } = useMail();
  const { t } = useTranslation();
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const handleClose = () => {
    dispatch({ type: 'TOGGLE_COMPOSE' });
  };

  const handleSend = () => {
    if (!to || !subject || !body) return;

    const newMail = {
      id: uuidv4(),
      from: state.user?.email || '',
      to,
      subject,
      body: body + '\n\n' + state.settings.signature,
      timestamp: new Date().toISOString(),
      starred: false,
      folder: 'sent',
      read: true,
    };

    dispatch({ type: 'ADD_MAIL', payload: newMail });
    toast.success(t('mailSent'));
    
    // Reset form
    setTo('');
    setSubject('');
    setBody('');
    handleClose();
  };

  return (
    <AnimatePresence>
      {state.isComposeOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t('compose')}
                </h2>
                <Button variant="ghost" size="sm" onClick={handleClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Form */}
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('to')}
                  </label>
                  <Input
                    type="email"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    placeholder="recipient@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('subject')}
                  </label>
                  <Input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enter subject"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('body')}
                  </label>
                  <Textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Write your message..."
                    rows={10}
                    className="resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={handleClose}>
                    Cancel
                  </Button>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={handleSend}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={!to || !subject || !body}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {t('send')}
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ComposeModal;
