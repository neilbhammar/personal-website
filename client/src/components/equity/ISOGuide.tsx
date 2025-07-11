import React from 'react';
import { motion } from 'framer-motion';
import { EquityGuideProps } from '@/types/equity';

/* -------------------------------------------------------------------------
   Stock Options Guide (Plain-English, 2025)
   Audience: First-time startup employee who knows nothing about equity.
   Style   : Simple sentences, friendly tone, examples with real numbers.
----------------------------------------------------------------------------*/

const Box: React.FC<{ title: string; color: string; children: React.ReactNode }> = ({ title, color, children }) => (
  <div className={`rounded-lg border p-5 border-${color}-300 bg-${color}-50 space-y-2`}>  {/* tailwind safe colors */}
    <h4 className={`font-semibold text-${color}-800`}>{title}</h4>
    {children}
  </div>
);

const bullet = (txt: string) => <li className="ml-4 list-disc text-gray-700">{txt}</li>;

const ISOGuide: React.FC<EquityGuideProps> = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-12"
  >
    {/* Header */}
    <section className="space-y-4">
      <h2 className="text-3xl font-bold text-gray-900">Startup Stock Options – Simple Guide</h2>
      <p className="text-gray-700 text-lg">
        You just got an offer with <strong>stock options</strong>. Translation: the company lets you buy shares later <em>at today’s dirt-cheap price</em>. You don't own the actual shares yet, just the option to buy them at the pre-determined price. </p>
    </section>

    {/* Big picture advice */}
    <section className="space-y-4">
      <h3 className="text-2xl font-semibold text-gray-800">The Big Picture (Employees&nbsp;1-10)</h3>
      <p className="text-gray-700">
        If you’re one of the first 10 hires at a VC-backed startup, you’re early enough that smart moves with your options can literally be worth millions.
      </p>
      <p className="text-gray-700">
        I'm going to throw a few new terms at you, but here’s the summary of what I'm trying to get across: If you believe in the company, you probably want to <strong>start owning</strong> your shares <em>as soon as humanly possible</em>. Why?
      </p>
      <ul className="ml-5 list-disc space-y-1 text-gray-700">
        <li>You lock in the current cheap tax bill (sometimes literally $0) and avoid future surprise tax bills as the company becomes more valuable (called AMT, we'll talk about that soon).</li>
        <li>You start your "ownership" clocks for long-term capital gains <em>and</em> QSBS (a special tax break for investing in startups) right away. Officialy owning the stock for longer can cut your federal tax down to 0&nbsp;% during an exit.</li>
      </ul>
      <p className="text-gray-700">
        There’s even a way to kick those clocks off (and lock in the cheap tax for all your shares) <strong>on your first day</strong>—it’s called <em>early exercise</em>. Stick with me for five minutes and I’ll show you how it works.
      </p>
      <p className="italic text-xs text-gray-500">Not financial advice, just what I wish someone had told me when I got my first offer.</p>
    </section>

    {/* Four key tax words */}
    <section className="space-y-6">
      <h3 className="text-2xl font-semibold text-gray-800">Four Tax Words You Need</h3>
      <div className="grid md:grid-cols-4 gap-4 text-sm">
        <Box title="Ordinary Income" color="red">
          <p>Same rate as your paycheck (up to 37&nbsp;% federal).</p>
        </Box>
        <Box title="Long-Term Cap Gains" color="yellow">
          <p>Hold &gt; 1&nbsp;year before selling → ~20&nbsp;% rate.</p>
        </Box>
        <Box title="Alternative Minimum Tax" color="blue">
          <p>28&nbsp;% alternative tax if your ISO “spread” is over a threshold (varies by deductions & filing status, but usually $70-90k).</p>
        </Box>
        <Box title="QSBS" color="green">
          <p>Own for 3, 4, or 5&nbsp;years & meet rules → up to $15&nbsp;M tax-free.</p>
        </Box>
      </div>
    </section>

    {/* 1. What are my options? ISO vs NSO */}
    <section className="space-y-6">
      <h3 className="text-2xl font-semibold text-gray-800">1. What kind of options do I have?</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <Box title="ISOs (Incentive Stock Options)" color="blue">
          <ul>{[
            'Employees only',
            'Best tax treatment if you plan right',
            'No regular tax at exercise – but AMT can sneak in',
            '$100 K/yr vesting limit',
          ].map(bullet)}</ul>
        </Box>
        <Box title="NSOs (Non-Qualified Stock Options)" color="purple">
          <ul>{[
            'Can go to anyone (consultants, advisors, etc.)',
            'Taxed like salary the day you exercise',
            'No AMT worries',
          ].map(bullet)}</ul>
        </Box>
      </div>
      {/* Tiny AMT call-out inside ISO card */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
        <p className="text-gray-700 font-semibold mb-1">Wait,what’s AMT?</p>
        <p className="text-gray-700">It’s a backup 28&nbsp;% tax that can trigger <em>only</em> for ISOs if your “spread” (fair-market value minus strike/exercise price) is large when you buy. Under ~$70-90&nbsp;K total spread you’re usually safe, but this varies by filing status.</p>
      </div>
    </section>

    {/* 2. Vesting 101 */}
    <section className="space-y-4">
      <h3 className="text-2xl font-semibold text-gray-800">2. Vesting 101</h3>
      <p className="text-gray-700">Most grants use a 4-year schedule with a 1-year cliff. Day&nbsp;365 you unlock 25&nbsp;% of your options, then a little each month until year&nbsp;4. Unless early exercise is allowed (we'll talk about that later), you won't be able to actually buy your shares until they vest or "unlock"</p>
    </section>

    {/* 3. How taxes hit when you exercise */}
    <section className="space-y-6">
      <h3 className="text-2xl font-semibold text-gray-800">3. Taxes the Day You Buy (Exercise)</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <Box title="ISO Example – Usually $0 Tax" color="blue">
          <p className="text-gray-700">Buy 10 000 ISOs at $0.50 when FMV is $0.55 → spread $500.</p>
          <p className="text-gray-700">Regular tax: $0. AMT? Very unlikely (spread ≪ $70 K).</p>
        </Box>
        <Box title="NSO Example – Ordinary Income" color="purple">
          <p className="text-gray-700">Buy 10 000 NSOs at $0.50 when FMV is $0.55 → spread $500.</p>
          <p className="text-gray-700">That $500 is taxed like salary the same year.</p>
        </Box>
      </div>
      <p className="text-gray-700"><strong>Fair Market Value (FMV):</strong> the per-share price set by the company’s independent 409a valuation (an accounting formula, usually 1/4 of the VC price).</p>
      <p className="text-gray-700"><strong>Strike/Exercise Price:</strong> the locked-in price you pay per share (set on grant day).</p>
      <p className="text-gray-700">“Spread” = FMV − strike, times how many shares you buy.</p>
    </section>

    {/* 4. Taxes when you sell */}
    <section className="space-y-6">
      <h3 className="text-2xl font-semibold text-gray-800">4. Taxes When You Finally Sell</h3>
      <p className="text-gray-700">So the company gets acquired, goes public (woo!), or you unload some shares in a secondary sale — here’s what the IRS cares about when cash finally hits your bank account:</p>
      <div className="grid md:grid-cols-3 gap-4">
        <Box title="< 1 Year Hold" color="red">
          <p className="text-gray-700">Short-term gain → taxed like salary (up to 37 %).</p>
        </Box>
        <Box title="≥ 1 Year Hold" color="yellow">
          <p className="text-gray-700">Long-term gain → ~20 % federal + 3.8 % NIIT.</p>
          <p className="text-gray-600">*And your grant was more than 2 years ago.</p>
        </Box>
        <Box title="QSBS Jackpot" color="green">
          <p className="text-gray-700">Hold 5 yrs (or 3-4 under new rules) & company qualifies → up to $15 M <strong>tax-free</strong>.</p>
        </Box>
      </div>
      <p className="text-gray-700 mt-2">Important: that “hold” clock starts the day you <em>exercise</em> (buy) your shares, <strong>not</strong> the day you got the grant.</p>
      {/* QSBS deep-dive card */}
      <div className="bg-green-50 border border-green-200 rounded p-4 mt-4">
        <p className="font-semibold text-green-800 mb-1">Wait—did we say "tax-free"?</p>
        <p className="text-gray-700 mb-2"><strong>Qualified Small Business Stock (QSBS)</strong> is a federal rule that rewards investing in startups. Meet the criteria and you can exclude a huge slice of your gains from federal tax.</p>
        
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div className="bg-white rounded p-3 border border-green-200">
            <p className="font-medium text-green-800 mb-2">New 2025 Rules</p>
            <p className="text-xs text-gray-600 mb-2">For shares acquired after July 4, 2025:</p>
            <ul className="list-disc ml-4 text-gray-700 space-y-1">
              <li>Hold for 3 years → 50% tax-free</li>
              <li>Hold for 4 years → 75% tax-free</li>
              <li>Hold for 5+ years → 100% tax-free (up to $15M)</li>
            </ul>
            <p className="text-xs text-gray-500 mt-2">Company must have under $75M in assets when issuing stock</p>
          </div>
          
          <div className="bg-white rounded p-3 border border-green-200">
            <p className="font-medium text-green-800 mb-2">Old Rules</p>
            <p className="text-xs text-gray-600 mb-2">For shares acquired before July 4, 2025:</p>
            <ul className="list-disc ml-4 text-gray-700 space-y-1">
              <li>Hold for 5+ years → 100% tax-free (up to $10M)</li>
            </ul>
            <p className="text-xs text-gray-500 mt-2">Company must have under $50M in assets when issuing stock</p>
          </div>
        </div>
        
        <p className="text-gray-700 mt-3">Most early-stage startups qualify. The key requirements: C-corp, active business (not just investments), and under the asset threshold when you got your shares.</p>
        <p className="text-gray-700 font-medium">Bottom line: the sooner you own, the sooner that QSBS clock starts ticking toward potentially millions in tax-free gains.</p>
      </div>

      {/* Example box */}
      <div className="bg-gray-50 border p-4 rounded mt-4">
        <p className="font-semibold text-gray-800 mb-1">Example: The QSBS Difference</p>
        <p className="text-gray-700 mb-2">Buy 25,000 shares at $0.10, sell 5 years later at $20 → $497,500 gain</p>
        <div className="grid md:grid-cols-2 gap-4 mt-2">
          <div className="text-gray-700">
            <p className="font-medium">With QSBS:</p>
            <p className="text-green-600 font-bold">$0 federal tax</p>
          </div>
          <div className="text-gray-700">
            <p className="font-medium">Without QSBS:</p>
            <p className="text-red-600 font-bold">~$119,400 tax (24% long-term gains)</p>
          </div>
        </div>
      </div>
    </section>

    {/* 5. When should you exercise? (if early exercise not allowed) */}
    <section className="space-y-4">
      <h3 className="text-2xl font-semibold text-gray-800">5. When Should You Exercise?</h3>
      <p className="text-gray-700">
        My personal move (again, <em>not</em> tax advice) is to exercise each monthly tranche as soon as it vests. Why?
      </p>
      <ul className="ml-5 list-disc text-gray-700 space-y-1">
        <li>The spread is smallest right when it vests, keeping AMT risk low.</li>
        <li>I start my short-term, long-term, and QSBS clocks ASAP.</li>
        <li>Owning the shares means no decision paralysis later when prices are high.</li>
      </ul>
    </section>

    {/* Early exercise highlight box */}
    <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-lg p-6 space-y-8">
      <section className="space-y-4">
        <h3 className="text-3xl font-bold text-green-800">An Even Better Way: Early Exercise & 83(b)</h3>
        <p className="text-gray-700">
          If the company allows it, you can exercise and own (as far as the IRS is concerned) <em>all</em> of your options now, even the unvested ones. This is called "early exercise" and - while you still need to vest/unlock the shares, you basically pre-pay for them. It has some huge benefits.
        </p>
        <ul className="ml-5 list-disc text-gray-700 space-y-1">
          <li><strong>Slashes AMT risk:</strong> the “spread” is near zero, so you’re unlikely to hit that $70-90&nbsp;K trigger.</li>
          <li><strong>Starts the clock early:</strong> QSBS and long-term capital-gains holding periods begin <em>today</em> instead of as each tranche vests — that’s up to a 4-year head start to paying 0 federal taxes during a sale.</li>
          <li>Cost is tiny due to the low strike price – often a few hundred or thousand dollars.</li>
          <li>If you leave early, unvested shares are bought back at what you paid.</li>
        </ul>
        <p className="text-gray-700 font-medium">Ask your founder if early exercise is allowed. If they say no, <strong>push hard</strong>. Grant documents can usually be tweaked with a quick lawyer update, and the potential tax savings are life-changing for employees.</p>
        <p className="text-gray-700">🚨 <strong>If you’re allowed to early&nbsp;exercise, you <em>must</em> mail Form&nbsp;83(b) to the IRS within 30&nbsp;days of your grant date.</strong> Miss the window and all those tax perks vanish.</p>
      </section>

      <section className="space-y-6">
        <h3 className="text-2xl font-semibold text-gray-800">Early vs. Wait – Real Numbers</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Box title="Early Exercise" color="green">
            <ul>{[
              'Buy 200,000 shares at $0.01 → cost $2,000',
              'File 83(b) – clocks start immediately',
              'Sell 5 yrs later at $25 → $5M gain',
              'QSBS qualified → $0 federal tax',
              'Net after tax: $5M',
            ].map(bullet)}</ul>
          </Box>
          <Box title="Exercise As You Vest" color="yellow">
            <ul>{[
              'Buy 50,000 shares/yr as they vest, price rises',
              'Year 1: $0.50 FMV → $25K spread (no AMT triggered)',
              'Year 2: $2.00 FMV → $100K spread → ~$8K AMT hit',
              'Year 3: $5.00 FMV → $250K spread → ~$50K AMT hit',
              'Year 4: $20.00 FMV → $1M spread → ~$260K AMT hit',
              'Sell at $25 → mixed holding periods',
              'Tax: ~$1.2M (short-term + long-term gains)',
              'Net after tax: ~$3.8M',
            ].map(bullet)}</ul>
          </Box>
        </div>
        
        <div className="bg-yellow-100 rounded-lg p-4 border border-yellow-300 mt-4">
          <div className="text-center">
            <p className="font-medium text-yellow-800 mb-2">Early exercise savings:</p>
            <p className="text-3xl font-bold text-yellow-900 mb-2">~$1.6M</p>
            <p className="text-sm text-yellow-700">from tax during the sale and exercise</p>
            <p className="text-sm text-yellow-700">(plus avoided a liquidity crisis!)</p>
          </div>
        </div>
      </section>
    </div>

    {/* 60-second checklist */}
    <section className="space-y-4">
      <h3 className="text-2xl font-semibold text-gray-800">60-Second Checklist – Do This Now</h3>
      <ol className="list-decimal ml-6 text-gray-700 space-y-1">
        <li>Understand if early exercise is allowed (ask the founder).</li>
        <li>Estimate cost + possible AMT for early exercise.</li>
        <li>If you choose early exercise, mail Form&nbsp;83(b) within 30&nbsp;days <strong>of your grant date</strong>.</li>
        <li>If early exercise isn’t possible, set a reminder to exercise each tranche the day it vests.</li>
        <li>Keep every grant, exercise slip & 83(b) in a safe folder.</li>
      </ol>
      <p className="italic text-xs text-gray-500">
        Missing the 30-day 83(b) window is the #1 mistake first-time employees make—don’t be that person.
      </p>
    </section>

    <section className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800">Other Good Reads & Resources</h3>
      <ul className="list-disc ml-6 text-gray-700 space-y-1">
        <li><a href="https://withcompound.com/manual/equity/stock-options/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Compound Manual: Stock Options</a></li>
        <li><a href="https://carta.com/learn/equity/stock-options/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Carta Learn: Stock Options 101</a></li>
        <li><a href="https://pulley.com/blog/iso-vs-nso-stock-options" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Pulley: ISO vs NSO</a></li>
        <li><a href="https://blog.angellist.com/stock-option-basics" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">AngelList: Stock Option Basics</a></li>
        <li><a href="https://carta.com/learn/startups/tax-planning/qsbs/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Carta: QSBS 101</a></li>
      </ul>
    </section>
  </motion.div>
);

export default ISOGuide; 