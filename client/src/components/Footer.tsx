import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 px-6 bg-foreground text-white">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-400">&copy; {currentYear} Neil Bhammar</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">
              Made with <span className="text-primary">&hearts;</span> and a lot of coffee
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
