import { useState } from 'react';
import { motion } from 'framer-motion';
import { Project } from '@/data/projects';
import { UserType, EquityType } from '@/types/equity';
import EquityButton from '@/components/equity/EquityButton';
import FounderGuide from '@/components/equity/FounderGuide';
import EmployeeChoice from '@/components/equity/EmployeeChoice';
import RSAGuide from '@/components/equity/RSAGuide';
import ISOGuide from '@/components/equity/ISOGuide';
import DontKnowGuide from '@/components/equity/DontKnowGuide';
import { Helmet } from 'react-helmet-async';

interface BlogPostProps {
  project: Project;
}

const publishedAt = new Date("2025-01-15");

export default function EarlyEmployeesGuideToEquity({ project }: BlogPostProps) {
  const [userType, setUserType] = useState<UserType>(null);
  const [equityType, setEquityType] = useState<EquityType>(null);
  
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const resetFlow = () => {
    setUserType(null);
    setEquityType(null);
  };

  const handleEquityTypeSelect = (type: EquityType) => {
    setEquityType(type);
  };

  const handleNavigateToEquityType = (type: EquityType) => {
    setEquityType(type);
  };

  const pageUrl = `https://yourdomain.com/blog/early-employees-guide-to-equity`;
  const pageImage = `https://yourdomain.com/images/projects/equity-guide-og.png`;
  const pageDescription = project.description;

  return (
    <>
      <Helmet>
        <title>{project.title}</title>
        <meta name="description" content={pageDescription} />

        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={project.title} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content={pageImage} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={project.title} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={pageImage} />
      </Helmet>

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="py-10 px-8 md:py-16 md:px-16 min-h-screen relative"
      >
        <article className="max-w-4xl mx-auto space-y-8">
          {/* Navigation */}
          <div className="flex justify-between items-center">
            <a 
              href="/projects" 
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              ← Back to projects
            </a>
            
            {(userType || equityType) && (
              <EquityButton 
                variant="ghost"
                onClick={resetFlow}
                className="text-gray-500 hover:text-gray-700"
              >
                Start over
              </EquityButton>
            )}
          </div>

          {/* Header */}
          <header className="space-y-4">
            <div className="flex flex-wrap gap-2 items-center">
              <div className="flex flex-wrap text-xs text-gray-500">
                {project.types.map((type, index) => (
                  <span key={type}>
                    {type}{index < project.types.length - 1 ? '\u00A0\u00A0•\u00A0\u00A0' : ''}
                  </span>
                ))}
              </div>
              
              <div className="flex gap-2 flex-wrap">
                {project.tags.map(tag => (
                  <span 
                    key={tag} 
                    className="text-xs px-2 py-0.5 rounded-md bg-gray-100 text-gray-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <h1 className="text-3xl font-medium">{project.title}</h1>
            <time className="block text-sm text-gray-500">
              {publishedAt.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </time>
          </header>



          {/* Main Content */}
          <motion.div {...fadeInUp} className="prose prose-lg max-w-4xl mx-auto">
            
            {/* Disclaimer */}
            <div className="text-sm text-gray-500 mb-8 border-l-2 border-gray-200 pl-4">
              <p>This isn't financial or legal advice. Always consult with a qualified tax professional before making any decisions about your equity.</p>
            </div>

            {/* Introduction and Choice */}
            {!userType && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="space-y-6">
                  <p className="text-xl text-gray-700 leading-relaxed">
                    If you're joining an early-stage startup as one of the first 10 employees, or you're a founder trying to figure out early equity grants, I wrote this to try and demistify some of it - especially Qualified Small Business Stock (QSBS).
                  </p>
                  
                  <p className="text-xl text-gray-700">
                    Most people don't understand what their equity actually means or what questions to ask. It's confusing stuff, and the decisions you make/questions you ask at the time of your grant can literally save you millions of dollars in taxes later.
                  </p>
                </div>

                <div className="space-y-4">
                  <EquityButton
                    variant="outline"
                    size="lg"
                    onClick={() => setUserType('employee')}
                    className="w-full"
                  >
                    I'm an Employee
                  </EquityButton>

                  <EquityButton
                    variant="outline"
                    size="lg"
                    onClick={() => setUserType('founder')}
                    className="w-full"
                  >
                    I'm a Founder
                  </EquityButton>
                </div>
              </motion.div>
            )}

            {/* Founder Section */}
            {userType === 'founder' && <FounderGuide />}

            {/* Employee Section - Choice */}
            {userType === 'employee' && !equityType && (
              <EmployeeChoice onEquityTypeSelect={handleEquityTypeSelect} />
            )}

            {/* RSA Section */}
            {equityType === 'rsa' && <RSAGuide />}

            {/* ISO Section */}
            {equityType === 'iso' && <ISOGuide />}

            {/* Don't Know Section */}
            {equityType === 'dont-know' && (
              <DontKnowGuide onNavigateToEquityType={handleNavigateToEquityType} />
            )}



          </motion.div>
        </article>
      </motion.main>
    </>
  );
} 