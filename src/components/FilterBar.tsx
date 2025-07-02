
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
      className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center space-x-2 flex-wrap gap-2">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Filters:
          </span>
          {activeFilters > 0 && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {activeFilters} active
            </Badge>
          )}
        </div>

        <div className="flex space-x-2">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant={state.filters.unreadOnly ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterToggle('unreadOnly')}
              className={state.filters.unreadOnly ? 'bg-blue-600 text-white' : ''}
            >
              <Mail className="h-3 w-3 mr-1" />
              {t('unreadOnly')}
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant={state.filters.starredOnly ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterToggle('starredOnly')}
              className={state.filters.starredOnly ? 'bg-yellow-500 text-white' : ''}
            >
              <Star className="h-3 w-3 mr-1" />
              {t('starredOnly')}
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant={state.filters.lastWeek ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterToggle('lastWeek')}
              className={state.filters.lastWeek ? 'bg-green-600 text-white' : ''}
            >
              <Clock className="h-3 w-3 mr-1" />
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
              className="text-gray-500 hover:text-gray-700"
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
