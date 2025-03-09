import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-6 px-6 text-center">
      <div className="container mx-auto">
        <p className="text-sm text-muted-foreground font-handwriting">
          &copy; {currentYear} Neil Bhammar
        </p>
      </div>
    </footer>
  );
};

export default Footer;
