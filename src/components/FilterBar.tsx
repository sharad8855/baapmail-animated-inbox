
import React from 'react';
import { motion } from 'framer-motion';
import { Filter, Star, Clock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMail } from '../contexts/MailContext';
import { useTranslation } from '../hooks/useTranslation';

const FilterBar: React.FC = () => {
  const { state, dispatch } = useMail();
  const { t } = useTranslation();

  const handleFilterToggle = (filterKey: keyof typeof state.filters) => {
    dispatch({
      type: 'UPDATE_FILTERS',
      payload: { [filterKey]: !state.filters[filterKey] }
    });
  };

  const activeFilters = Object.values(state.filters).filter(Boolean).length;

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="p-6 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm"
    >
      <div className="flex items-center space-x-4 flex-wrap gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
            <Filter className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Smart Filters
            </span>
            {activeFilters > 0 && (
              <Badge variant="secondary" className="ml-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                {activeFilters} active
              </Badge>
            )}
          </div>
        </div>

        <div className="flex space-x-3">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant={state.filters.unreadOnly ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterToggle('unreadOnly')}
              className={`rounded-xl h-10 px-4 font-medium transition-all duration-200 ${
                state.filters.unreadOnly 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg hover:shadow-xl' 
                  : 'border-2 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30'
              }`}
            >
              <Mail className="h-4 w-4 mr-2" />
              {t('unreadOnly')}
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant={state.filters.starredOnly ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterToggle('starredOnly')}
              className={`rounded-xl h-10 px-4 font-medium transition-all duration-200 ${
                state.filters.starredOnly 
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg hover:shadow-xl' 
                  : 'border-2 hover:border-yellow-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/30'
              }`}
            >
              <Star className="h-4 w-4 mr-2" />
              {t('starredOnly')}
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant={state.filters.lastWeek ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterToggle('lastWeek')}
              className={`rounded-xl h-10 px-4 font-medium transition-all duration-200 ${
                state.filters.lastWeek 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:shadow-xl' 
                  : 'border-2 hover:border-green-300 hover:bg-green-50 dark:hover:bg-green-900/30'
              }`}
            >
              <Clock className="h-4 w-4 mr-2" />
              {t('lastWeek')}
            </Button>
          </motion.div>
        </div>

        {activeFilters > 0 && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => dispatch({ 
                type: 'UPDATE_FILTERS', 
                payload: { unreadOnly: false, starredOnly: false, lastWeek: false } 
              })}
              className="text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl h-10 px-4 font-medium transition-all duration-200"
            >
              Clear all
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default FilterBar;
