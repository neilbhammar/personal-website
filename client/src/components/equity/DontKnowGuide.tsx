import React from 'react';
import { motion } from 'framer-motion';
import { EquityType } from '@/types/equity';
import EquityButton from './EquityButton';

interface DontKnowGuideProps {
  onNavigateToEquityType: (type: EquityType) => void;
}

const DontKnowGuide: React.FC<DontKnowGuideProps> = ({ onNavigateToEquityType }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10"
    >
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Not Sure What You Have?</h2>
        <p className="text-lg text-gray-700 mb-8">
          Totally fair. The paperwork is confusing and companies aren't great at explaining this stuff. Let's figure it out.
        </p>
      </div>

      <section className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800">The Two Types (Super Quick Version)</h3>
        
        <div className="space-y-4">
          <div className="border-l-4 border-blue-400 pl-4 bg-blue-50 p-4 rounded-r-lg">
            <p className="text-gray-700">
              <strong>Restricted Stock (RSAs):</strong> You actually own shares right now. They just unlock over time. Usually for the first 1-2 employees and founders.
            </p>
          </div>
          
          <div className="border-l-4 border-purple-400 pl-4 bg-purple-50 p-4 rounded-r-lg">
            <p className="text-gray-700">
              <strong>Stock Options (ISOs/NSOs):</strong> You have the right to buy shares at a set price. You don't own anything yet. More common for employees #3+.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800">Check Your Paperwork</h3>
        <p className="text-gray-700">
          Dig up your offer letter or employment agreement. Look for these specific words:
        </p>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-3">Restricted Stock clues:</h4>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li>• "Restricted Stock" or "RSA"</li>
              <li>• "Shares" (not "options")</li>
              <li>• "83(b) election"</li>
              <li>• You paid some money for shares</li>
            </ul>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-3">Stock Options clues:</h4>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li>• "Stock Options", "ISO", or "NSO"</li>
              <li>• "Strike Price" or "Exercise Price"</li>
              <li>• "Right to purchase"</li>
              <li>• You haven't paid anything yet</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800">Still Confused?</h3>
        <p className="text-gray-700">
          Just ask your founder, manager, or HR directly:
        </p>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="font-mono text-gray-800 text-center">
            "Am I getting restricted stock or stock options?"
          </p>
        </div>
        
        <p className="text-gray-700 text-sm">
          It's a totally normal question. If they can't give you a straight answer or seem annoyed, that's honestly a red flag.
        </p>
      </section>

      <section className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800">What to Do Next</h3>
        
        <div className="space-y-4">
          <div className="border-l-4 border-blue-400 pl-4">
            <p className="text-gray-700 mb-3">
              <strong>If you have Restricted Stock:</strong> You might need to file an 83(b) election within 30 days of getting your shares. This is time-sensitive and can save you a lot of money.
            </p>
            <EquityButton 
              variant="outline"
              onClick={() => onNavigateToEquityType('rsa')}
            >
              → Learn about RSAs and 83(b) elections
            </EquityButton>
          </div>
          
          <div className="border-l-4 border-purple-400 pl-4">
            <p className="text-gray-700 mb-3">
              <strong>If you have Stock Options:</strong> Ask about early exercise. It can help you start your QSBS clock earlier and potentially save you hundreds of thousands in taxes.
            </p>
            <EquityButton 
              variant="outline"
              onClick={() => onNavigateToEquityType('iso')}
            >
              → Learn about options and early exercise
            </EquityButton>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">A Few Red Flags</h3>
        <p className="text-gray-700">
          If your company is being weird about answering basic questions about your equity, that's not great. You should know what you're getting.
        </p>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <ul className="text-red-700 space-y-1 text-sm">
            <li>• Won't tell you if it's restricted stock or options</li>
            <li>• No documentation about your grant</li>
            <li>• Vague answers about valuations</li>
            <li>• Gets defensive when you ask about taxes</li>
          </ul>
        </div>
      </section>
    </motion.div>
  );
};

export default DontKnowGuide; 