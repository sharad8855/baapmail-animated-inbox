
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useMail } from '../contexts/MailContext';
import { useTranslation } from '../hooks/useTranslation';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const ComposeModal: React.FC = () => {
  const { state, dispatch } = useMail();
  const { t } = useTranslation();
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined);
  const [isScheduled, setIsScheduled] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!to.trim()) {
      newErrors.to = 'Recipient email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
      newErrors.to = 'Please enter a valid email address';
    }
    
    if (!subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!body.trim()) {
      newErrors.body = 'Message body is required';
    }

    if (isScheduled && (!scheduledDate || scheduledDate <= new Date())) {
      newErrors.schedule = 'Please select a future date and time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClose = () => {
    dispatch({ type: 'TOGGLE_COMPOSE' });
    // Reset form
    setTo('');
    setSubject('');
    setBody('');
    setScheduledDate(undefined);
    setIsScheduled(false);
    setErrors({});
  };

  const handleSend = () => {
    if (!validateForm()) {
      toast.error('Please fix the errors before sending');
      return;
    }

    const newMail = {
      id: uuidv4(),
      from: state.user?.email || '',
      to: to.trim(),
      subject: subject.trim(),
      body: body.trim() + '\n\n' + state.settings.signature,
      timestamp: isScheduled && scheduledDate ? scheduledDate.toISOString() : new Date().toISOString(),
      starred: false,
      folder: isScheduled ? 'scheduled' : 'sent',
      read: true,
    };

    dispatch({ type: 'ADD_MAIL', payload: newMail });
    
    if (isScheduled) {
      toast.success(`Email scheduled for ${format(scheduledDate!, 'PPP at p')}`);
    } else {
      toast.success(t('mailSent'));
    }
    
    handleClose();
  };

  const handleScheduleToggle = () => {
    setIsScheduled(!isScheduled);
    if (!isScheduled) {
      setScheduledDate(undefined);
    }
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
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden border border-gray-200 dark:border-gray-700">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <Send className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {isScheduled ? 'Schedule Email' : t('compose')}
                  </h2>
                </div>
                <Button variant="ghost" size="sm" onClick={handleClose} className="rounded-full">
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Form */}
              <div className="p-6 space-y-6 max-h-[calc(90vh-180px)] overflow-y-auto">
                {/* To Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {t('to')} <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="email"
                    value={to}
                    onChange={(e) => {
                      setTo(e.target.value);
                      if (errors.to) setErrors({...errors, to: ''});
                    }}
                    placeholder="recipient@example.com"
                    className={cn(
                      "h-12 rounded-xl border-2 transition-all duration-200",
                      errors.to 
                        ? "border-red-300 focus:border-red-500" 
                        : "border-gray-200 focus:border-blue-500"
                    )}
                  />
                  {errors.to && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm font-medium"
                    >
                      {errors.to}
                    </motion.p>
                  )}
                </div>

                {/* Subject Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {t('subject')} <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    value={subject}
                    onChange={(e) => {
                      setSubject(e.target.value);
                      if (errors.subject) setErrors({...errors, subject: ''});
                    }}
                    placeholder="Enter subject"
                    className={cn(
                      "h-12 rounded-xl border-2 transition-all duration-200",
                      errors.subject 
                        ? "border-red-300 focus:border-red-500" 
                        : "border-gray-200 focus:border-blue-500"
                    )}
                  />
                  {errors.subject && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm font-medium"
                    >
                      {errors.subject}
                    </motion.p>
                  )}
                </div>

                {/* Schedule Toggle */}
                <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Schedule for later</span>
                  <Button
                    type="button"
                    variant={isScheduled ? "default" : "outline"}
                    size="sm"
                    onClick={handleScheduleToggle}
                    className={cn(
                      "ml-auto rounded-full px-4",
                      isScheduled && "bg-blue-500 hover:bg-blue-600"
                    )}
                  >
                    {isScheduled ? 'Scheduled' : 'Schedule'}
                  </Button>
                </div>

                {/* Calendar Picker */}
                <AnimatePresence>
                  {isScheduled && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2"
                    >
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Schedule Date & Time <span className="text-red-500">*</span>
                      </label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full h-12 justify-start text-left font-normal rounded-xl border-2",
                              !scheduledDate && "text-muted-foreground",
                              errors.schedule ? "border-red-300" : "border-gray-200"
                            )}
                          >
                            <Calendar className="mr-3 h-5 w-5" />
                            {scheduledDate ? (
                              format(scheduledDate, "PPP 'at' p")
                            ) : (
                              <span>Pick a date and time</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-2xl" align="start">
                          <div className="p-4">
                            <CalendarComponent
                              mode="single"
                              selected={scheduledDate}
                              onSelect={(date) => {
                                if (date) {
                                  // Set to current time + 1 hour if no time is set
                                  const now = new Date();
                                  const scheduledTime = new Date(date);
                                  scheduledTime.setHours(now.getHours() + 1, now.getMinutes());
                                  setScheduledDate(scheduledTime);
                                  if (errors.schedule) setErrors({...errors, schedule: ''});
                                }
                              }}
                              disabled={(date) => date < new Date()}
                              initialFocus
                              className="rounded-xl"
                            />
                            {scheduledDate && (
                              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                                  Email will be sent on {format(scheduledDate, "PPP 'at' p")}
                                </p>
                              </div>
                            )}
                          </div>
                        </PopoverContent>
                      </Popover>
                      {errors.schedule && (
                        <motion.p 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm font-medium"
                        >
                          {errors.schedule}
                        </motion.p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Body Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {t('body')} <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    value={body}
                    onChange={(e) => {
                      setBody(e.target.value);
                      if (errors.body) setErrors({...errors, body: ''});
                    }}
                    placeholder="Write your message..."
                    rows={8}
                    className={cn(
                      "resize-none rounded-xl border-2 transition-all duration-200",
                      errors.body 
                        ? "border-red-300 focus:border-red-500" 
                        : "border-gray-200 focus:border-blue-500"
                    )}
                  />
                  {errors.body && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm font-medium"
                    >
                      {errors.body}
                    </motion.p>
                  )}
                </div>

                {/* Signature Preview */}
                {state.settings.signature && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">Signature will be added:</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 italic">{state.settings.signature}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <Button variant="outline" onClick={handleClose} className="rounded-xl px-6">
                  Cancel
                </Button>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={handleSend}
                    className={cn(
                      "rounded-xl px-8 text-white font-semibold shadow-lg",
                      isScheduled 
                        ? "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700" 
                        : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                    )}
                    disabled={!to || !subject || !body}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {isScheduled ? 'Schedule' : t('send')}
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

export default ComposeModal;
