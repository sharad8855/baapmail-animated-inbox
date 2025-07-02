
import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useMail } from '../contexts/MailContext';
import MailList from './MailList';
import MailDetail from './MailDetail';
import FilterBar from './FilterBar';

const MainContent: React.FC = () => {
  const { state } = useMail();

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      <FilterBar />
      
      <div className="flex-1 flex">
        <AnimatePresence mode="wait">
          {state.selectedMail ? (
            <MailDetail key="detail" />
          ) : (
            <MailList key="list" />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MainContent;
