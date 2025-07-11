import React from 'react';
import { motion } from 'framer-motion';
import { EquityGuideProps } from '@/types/equity';

const FounderGuide: React.FC<EquityGuideProps> = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12"
    >
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">For Founders</h2>
        <p className="text-lg text-gray-700 mb-4">
          You're a founder, you have a thousand things going on, but I really strongly urge you to consider the following. These decisions can genuinely have millions of dollars of impact on your employees.
        </p>
        <p className="text-lg text-gray-700 mb-8 font-medium">
          These things are important to do ASAP. Unfortunately, they are not the kind of decision that you can reverse or fix by revisiting later.
        </p>
      </div>

      <section className="space-y-8">
        <h3 className="text-2xl font-semibold text-gray-800">Understand QSBS</h3>
        <div className="space-y-6">
          <p className="text-gray-700">
            QSBS stands for "Qualified Small Business Stock." In plain terms, it's a massive tax break that lets people pay zero federal taxes on stock gains from qualifying startups.
          </p>
          <p className="text-gray-700">
            Here's how it works: if someone holds qualifying stock for the right amount of time, they can exclude millions of dollars in gains from federal taxes when they sell. It's honestly one of the best tax benefits available.
          </p>
          <p className="text-gray-700">
            QSBS got even better in 2025. For stock granted after July 4, 2025, the benefits are incredible. But the old rules still apply to anything granted before that date.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
              New 2025 Rules
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm ring-1 ring-gray-200">
              <p className="text-sm text-gray-600 mb-4">For stock granted after July 4, 2025:</p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700"><strong>3 years:</strong> 50% of gains tax-free</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700"><strong>4 years:</strong> 75% of gains tax-free</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700"><strong>5+ years:</strong> 100% of gains tax-free (up to $15M)</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  Cap: $15M per company • Assets: Under $75M when issuing
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
              Old Rules
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm ring-1 ring-gray-200">
              <p className="text-sm text-gray-600 mb-4">For stock granted before July 4, 2025:</p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700"><strong>5+ years:</strong> 100% of gains tax-free (up to $10M)</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  Cap: $10M per company • Assets: Under $50M when issuing
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="font-semibold text-gray-800 mb-4">Make Sure Your Company Qualifies</h4>
          <ul className="text-gray-700 space-y-2">
            <li>• <strong>Incorporate as a C-Corp</strong> (required for QSBS)</li>
            <li>• <strong>Keep gross assets under $75M</strong> when issuing stock</li>
            <li>• <strong>Ensure your business qualifies</strong> (most tech companies do)</li>
          </ul>
        </div>
      </section>

      <section className="space-y-8">
        <h3 className="text-2xl font-semibold text-gray-800">Allow Early Exercise of Options</h3>
        <div className="space-y-6">
          <p className="text-gray-700">
            In my opinion, this is one of the most impactful things you can do for employees. Let them exercise options before they vest. There's almost no downside for you, but immense potential upside for your employees.
          </p>
          <p className="text-gray-700">
            In short, what this means is that employees pay tax for and start their capital gains and QSBS clocks for these options closer to the grant date as opposed to as each tranche vests.
          </p>
          <p className="text-gray-700">
            There might be some small administrative overhead, but I strongly believe it's worth it. It'll make your offers more attractive, save your team members from unnecessary taxes, and make people feel more ownership from the get go.
          </p>
        </div>
        
        <div className="bg-yellow-50 rounded-lg p-6">
          <h4 className="font-semibold text-yellow-800 mb-4">Example: Sarah's Tax Savings</h4>
          <p className="text-yellow-700 mb-6">Sarah joins as employee #3 at a startup. She gets 100,000 options at $0.01 strike price.</p>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* With Early Exercise */}
            <div className="bg-white rounded-lg p-6 border-2 border-green-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">✓</span>
                </div>
                <h5 className="text-lg font-semibold text-green-800">With Early Exercise</h5>
              </div>
              
              <div className="space-y-4">
                <div className="bg-green-50 rounded-md p-3">
                  <p className="text-sm font-medium text-green-800">Year 1: Exercises immediately</p>
                  <p className="text-xs text-green-600">Pays $1,000 when FMV = $0.01</p>
                  <p className="text-xs text-green-600">Tax bill: $0 (no spread)</p>
                </div>
                
                <div className="bg-green-50 rounded-md p-3">
                  <p className="text-sm font-medium text-green-800">Year 5: Company sells for $50/share</p>
                  <p className="text-xs text-green-600">Total proceeds: $5,000,000</p>
                  <p className="text-xs text-green-600">Cost basis: $1,000</p>
                  <p className="text-xs text-green-600">Gain: $4,999,000</p>
                </div>
                
                <div className="bg-green-100 rounded-md p-3 border border-green-300">
                  <p className="text-sm font-bold text-green-800">Tax Treatment</p>
                  <p className="text-xs text-green-700">5+ year hold = QSBS eligible</p>
                  <p className="text-xs text-green-700">Federal tax: $0</p>
                  <p className="text-lg font-bold text-green-800 mt-2">Net after tax: $4,999,000</p>
                </div>
              </div>
            </div>

            {/* Without Early Exercise */}
            <div className="bg-white rounded-lg p-6 border-2 border-red-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">✗</span>
                </div>
                <h5 className="text-lg font-semibold text-red-800">Without Early Exercise</h5>
              </div>
              
              <div className="space-y-4">
                <div className="bg-red-50 rounded-md p-3">
                  <p className="text-sm font-medium text-red-800">Year 4: Exercises all vested options (100k)</p>
                  <p className="text-xs text-red-600">FMV now $10/share, exercises all 100,000 shares</p>
                  <p className="text-xs text-red-600">Spread = $9.99 × 100,000 = $999,000</p>
                  <p className="text-xs text-red-600">AMT hit ≈ 28 % → ~$280,000 (no liquidity!)</p>
                </div>
                
                <div className="bg-red-50 rounded-md p-3">
                  <p className="text-sm font-medium text-red-800">Year 5: Company sells for $50/share</p>
                  <p className="text-xs text-red-600">Total proceeds: $5,000,000</p>
                  <p className="text-xs text-red-600">Cost basis: $1,000 (strike price)</p>
                  <p className="text-xs text-red-600">Up-front AMT paid: ~$280,000</p>
                  <p className="text-xs text-red-600">Gain: $4,999,000</p>
                </div>
                
                <div className="bg-red-100 rounded-md p-3 border border-red-300">
                  <p className="text-sm font-bold text-red-800">Tax Treatment</p>
                  <p className="text-xs text-red-700">Only 1 year hold = Short-term capital gains</p>
                  <p className="text-xs text-red-700">Ordinary-income tax (~37 %) ≈ $1.85 M</p>
                  <p className="text-lg font-bold text-red-800 mt-2">Net after tax: ~ $2,870,000</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 bg-yellow-100 rounded-lg p-4 border border-yellow-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-800">Sarah's savings from early exercise:</p>
                <p className="text-2xl font-bold text-yellow-900">~$2,130,000</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-yellow-700">Plus avoided $280k AMT crisis</p>
                <p className="text-xs text-yellow-700">with no liquidity</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <h3 className="text-2xl font-semibold text-gray-800">Encourage 83(b) Elections for Restricted Stock</h3>
        <p className="text-gray-700">
          Anyone you grant restricted stock awards to should absolutely file an 83(b) election within 30 days. Make this crystal clear and provide resources to help them do it.
        </p>
        
        <div className="bg-purple-50 rounded-lg p-6">
          <h4 className="font-semibold text-purple-800 mb-4">Why 83(b) Elections Matter</h4>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                <span className="text-purple-700">Starts capital gains clock immediately</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                <span className="text-purple-700">Locks in current (low) valuation</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                <span className="text-purple-700">Enables QSBS qualification from day one</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                <span className="text-purple-700">Prevents massive tax bills on paper gains with no liquidity</span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-purple-200">
            <p className="text-purple-700 text-sm">
              <strong>Without 83(b):</strong> Employees could face hundreds of thousands in tax bills as shares vest, even though they can't sell the stock to pay the taxes. This can be financially devastating.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <h3 className="text-2xl font-semibold text-gray-800">Actually Communicate This Stuff</h3>
        <p className="text-gray-700">
          Don't just grant equity and hope for the best. Most people have no idea what they're getting. Take 10 minutes to explain:
        </p>
        
        <div className="bg-gray-50 rounded-lg p-6">
          <ul className="text-gray-700 space-y-2">
            <li>• <strong>What they're getting and why it matters</strong></li>
            <li>• <strong>The importance of early exercise and 83(b) elections</strong></li>
            <li>• <strong>How QSBS can benefit them</strong></li>
            <li>• <strong>Current 409A valuations and strike prices</strong></li>
          </ul>
        </div>
        
        <p className="text-gray-700">
          Your employees will appreciate the transparency, and it'll make your equity packages way more compelling/motivating when people understand the potential value.
        </p>
        
        <div className="bg-blue-50 rounded-lg p-6">
          <p className="text-blue-700">
            If you have employees who are thinking through this stuff, you can give them my number! I'm not an expert, but seriously always happy to help navigate the process.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">Other Good Reads & Resources</h3>
        <ul className="list-disc ml-6 text-gray-700 space-y-1">
          <li><a href="https://www.archetypelegal.com/blog/should-startups-offer-early-exercise-when-granting-stock-options" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Should Startups Offer Early Exercise?</a></li>
          <li><a href="https://capbase.com/should-a-startup-allow-early-exercise-of-stock-options/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Capbase: Should a Startup Allow Early Exercise?</a></li>
          <li><a href="https://learn.valur.com/founders-stock-plans/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Valur: Founders Stock Plans</a></li>
          <li><a href="https://carta.com/learn/equity/stock-options/taxes/83b-election/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Carta: 83(b) Election Guide</a></li>
          <li><a href="https://carta.com/learn/startups/tax-planning/qsbs/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Carta: QSBS 101</a></li>
        </ul>
      </section>
    </motion.div>
  );
};

export default FounderGuide; 