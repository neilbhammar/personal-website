import React from 'react';
import { motion } from 'framer-motion';
import { EquityGuideProps } from '@/types/equity';

const RSAGuide: React.FC<EquityGuideProps> = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10"
    >
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Restricted Stock Awards (RSAs)</h2>
        <p className="text-lg text-gray-700 mb-8">
          You got actual shares in the company. Here's everything you need to know to potentially save hundreds of thousands in taxes.
        </p>
      </div>

      {/* The critical action */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">🚨 Critical: File an 83(b) election within 30 days</h3>
        <p className="text-gray-700">
          This is the most important thing you'll do. You have exactly 30 days from when you got your shares to file this with the IRS. Miss it, and you could pay hundreds of thousands more in taxes.
        </p>
        
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-2">What to do right now:</h4>
          <ol className="text-gray-700 space-y-1">
            <li>1. Google "83(b) election template" or ask your company for help</li>
            <li>2. Fill it out with your grant details</li>
            <li>3. Mail it to the IRS (certified mail, keep the receipt)</li>
            <li>4. Also send a copy to your state tax authority</li>
          </ol>
        </div>
      </section>

      {/* What RSAs are */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">What are RSAs?</h3>
        <p className="text-gray-700">
          You're getting actual shares of the company, not just options. They're usually subject to vesting, which means they unlock over time.
        </p>
        
        <div className="border-l-4 border-gray-300 pl-4 space-y-3">
          <p className="text-gray-700">
            <strong>Typical vesting:</strong> 4 years with a 1-year cliff. You get nothing if you leave before 1 year, then 25% of your shares unlock after year 1, and the rest unlock monthly over 3 years.
          </p>
          <p className="text-gray-700">
            <strong>The cliff:</strong> It's designed to make sure you stick around for at least a year before getting anything.
          </p>
        </div>
      </section>

      {/* Without 83(b) - the problem */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">Without 83(b): The expensive problem</h3>
        <p className="text-gray-700">
          If you don't file the 83(b) election, you'll pay ordinary income tax every time your shares vest, based on the fair market value at that time.
        </p>
        
        <div className="border-l-4 border-gray-300 pl-4 space-y-3">
          <p className="text-gray-700">
            <strong>How fair market value works:</strong> It's usually determined by a 409A valuation (an accounting formula), which is typically around a quarter of the VC valuation.
          </p>
          <p className="text-gray-700">
            <strong>The issue:</strong> As the company grows over 4 years, your shares might be worth $5 each by year 3. If you vest 10,000 shares that month, you're getting taxed on $50,000 of "income" - money you don't actually have in cash.
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-2">Example: Sarah's tax nightmare</h4>
          <p className="text-gray-700 mb-2">Sarah gets 100,000 RSAs, doesn't file 83(b):</p>
          <div className="text-gray-700 space-y-1">
            <p><strong>Year 1:</strong> 25,000 shares vest at $2/share = $50,000 ordinary income tax</p>
            <p><strong>Year 2:</strong> 25,000 shares vest at $5/share = $125,000 ordinary income tax</p>
            <p><strong>Year 3:</strong> 25,000 shares vest at $10/share = $250,000 ordinary income tax</p>
            <p><strong>Year 4:</strong> 25,000 shares vest at $15/share = $375,000 ordinary income tax</p>
            <p className="font-semibold">Total: She owes taxes on $800,000 of "income" over 4 years</p>
          </div>
        </div>
      </section>

      {/* Then you get taxed again on sale */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">Then you get taxed again when you sell</h3>
        <p className="text-gray-700">
          Without QSBS benefits, when the company sells (let's say 5 years later), you'll pay capital gains tax on the sale:
        </p>
        
        <div className="border-l-4 border-gray-300 pl-4 space-y-2">
          <p className="text-gray-700">
            <strong>Shares held more than a year:</strong> Long-term capital gains tax (better, but still significant)
          </p>
          <p className="text-gray-700">
            <strong>Shares vested within the last year:</strong> Short-term capital gains tax (equivalent to ordinary income tax - ouch)
          </p>
        </div>
      </section>

      {/* With 83(b) - the solution */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">With 83(b): Much better</h3>
        <p className="text-gray-700">
          Filing the 83(b) election lets you pay taxes on all your shares upfront when the fair market value is super low, and starts your holding period immediately.
        </p>
        
        <div className="border-l-4 border-gray-300 pl-4 space-y-3">
          <p className="text-gray-700">
            <strong>You pay taxes upfront:</strong> When the company's just starting, fair market value might be a tenth or hundredth of a cent. Even if you own millions of shares, the tax bill will be pretty low.
          </p>
          <p className="text-gray-700">
            <strong>Your holding period starts immediately:</strong> Instead of waiting for each tranche to vest, you start the clock on long-term capital gains and QSBS right away.
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-2">Same example: Sarah files 83(b)</h4>
          <div className="text-gray-700 space-y-1">
            <p><strong>Day 1:</strong> Files 83(b), pays tax on 100,000 shares × $0.10 FMV = $10,000 of "income"</p>
            <p><strong>Tax bill upfront:</strong> ~$3,500 (depending on her tax bracket)</p>
            <p><strong>Years 1-4:</strong> $0 additional tax as shares vest</p>
            <p className="font-semibold">Savings: Hundreds of thousands in taxes</p>
          </div>
        </div>
      </section>

      {/* QSBS benefits */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">The QSBS bonus</h3>
        <p className="text-gray-700">
          Filing the 83(b) election also starts your QSBS (Qualified Small Business Stock) holding period immediately. If the company meets certain criteria (under $75M in assets when you got shares, C-corp, etc.), you could pay zero federal taxes when you sell.
        </p>
        
        <div className="border-l-4 border-gray-300 pl-4 space-y-3">
          <p className="text-gray-700">
            <strong>New 2025 QSBS rules</strong> (for shares acquired after July 4, 2025):
          </p>
          <ul className="text-gray-700 space-y-1 ml-4">
            <li>• 3+ years: 50% of gains tax-free</li>
            <li>• 4+ years: 75% of gains tax-free</li>
            <li>• 5+ years: 100% of gains tax-free (up to $15M)</li>
          </ul>
          <p className="text-gray-700">
            <strong>Old QSBS rules</strong> (for shares acquired before July 4, 2025): 5+ years gets you 100% tax-free up to $10M.
          </p>
        </div>
      </section>

      {/* Action plan */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">Your action plan</h3>
        <div className="space-y-3">
          <div className="border-l-4 border-gray-300 pl-4">
            <p className="text-gray-700">
              <strong>Step 1:</strong> Check your grant date. Do you still have time to file 83(b)? You have exactly 30 days.
            </p>
          </div>
          <div className="border-l-4 border-gray-300 pl-4">
            <p className="text-gray-700">
              <strong>Step 2:</strong> File the 83(b) election immediately. Don't wait - there's no downside to filing early.
            </p>
          </div>
          <div className="border-l-4 border-gray-300 pl-4">
            <p className="text-gray-700">
              <strong>Step 3:</strong> Ask your company for the current 409A valuation so you know what fair market value you'll be taxed on.
            </p>
          </div>
          <div className="border-l-4 border-gray-300 pl-4">
            <p className="text-gray-700">
              <strong>Step 4:</strong> Keep all your paperwork. You'll need proof you filed when you eventually sell.
            </p>
          </div>
        </div>
        
        <p className="text-gray-700 mt-6">
          Filing an 83(b) election is important because you want to start that QSBS clock as early as possible and avoid unforeseen tax events as you vest. Most people would rather pay a tiny amount (or almost nothing) upfront than get hit with massive tax bills later.
        </p>
      </section>

      {/* Further Reading */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">Other Good Reads & Resources</h3>
        <ul className="list-disc ml-6 text-gray-700 space-y-1">
          <li><a href="https://carta.com/learn/equity/restricted-stock/83b-election-guide/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Carta: 83(b) Election Guide for Restricted Stock</a></li>
          <li><a href="https://withcompound.com/manual/equity/restricted-stock/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Compound Manual: Restricted Stock</a></li>
          <li><a href="https://pulley.com/blog/rsa-vs-rsu-vs-stock-options" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Pulley: RSA vs RSU vs Options</a></li>
          <li><a href="https://stripe.com/blog/stock-options-tax-guide" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Stripe Atlas: Stock & Option Tax Guide</a></li>
          <li><a href="https://carta.com/learn/startups/tax-planning/qsbs/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Carta: QSBS 101</a></li>
        </ul>
      </section>
    </motion.div>
  );
};

export default RSAGuide; 