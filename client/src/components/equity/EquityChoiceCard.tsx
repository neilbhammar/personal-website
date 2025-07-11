import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface EquityChoiceCardProps {
  title: string;
  description: string;
  onClick: () => void;
  className?: string;
}

const EquityChoiceCard: React.FC<EquityChoiceCardProps> = ({
  title,
  description,
  onClick,
  className
}) => {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "w-full text-left px-6 py-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 group bg-white hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2",
        className
      )}
    >
      <div className="flex justify-between items-center">
        <div className="flex-1 pr-4">
          <h4 className="text-lg font-medium text-gray-900 mb-1">
            {title}
          </h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>
        <svg className="w-4 h-4 text-gray-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
        </svg>
      </div>
    </motion.button>
  );
};

export default EquityChoiceCard; 