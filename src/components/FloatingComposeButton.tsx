
import React from 'react';
import { motion } from 'framer-motion';
import { Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMail } from '../contexts/MailContext';
import { useTranslation } from '../hooks/useTranslation';

const FloatingComposeButton: React.FC = () => {
  const { dispatch } = useMail();
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-6 lg:hidden z-30"
    >
      <Button
        onClick={() => dispatch({ type: 'TOGGLE_COMPOSE' })}
        className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
        size="sm"
      >
        <Edit3 className="h-6 w-6" />
      </Button>
    </motion.div>
  );
};

export default FloatingComposeButton;
