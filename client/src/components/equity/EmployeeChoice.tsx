import React from 'react';
import { motion } from 'framer-motion';
import { EquityType } from '@/types/equity';
import EquityChoiceCard from './EquityChoiceCard';

interface EmployeeChoiceProps {
  onEquityTypeSelect: (type: EquityType) => void;
}

const EmployeeChoice: React.FC<EmployeeChoiceProps> = ({ onEquityTypeSelect }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">For Employees: Understanding Your Equity</h2>
        <p className="text-lg text-gray-700 mb-8">
          What kind of equity are you receiving? This changes how you think about early exercising, taxes, and more.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-50 border border-none rounded-xl p-6">
          
          <div className="space-y-4">
            <EquityChoiceCard
              title="Restricted Stock Awards (RSAs)"
              description="You're getting actual shares of the company, usually subject to vesting. More common for very early employees (first 1-2 hires)."
              onClick={() => onEquityTypeSelect('rsa')}
            />

            <EquityChoiceCard
              title="Stock Options (ISOs/NSOs)"
              description="You get the right to purchase shares at a predetermined price. More common for employees #3-15+."
              onClick={() => onEquityTypeSelect('iso')}
            />

            <EquityChoiceCard
              title="I'm Not Sure"
              description="Help me figure out what type of equity I have and what questions to ask my company."
              onClick={() => onEquityTypeSelect('dont-know')}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EmployeeChoice; 