import React from 'react';
import { Lightbulb, Users, Rocket } from 'lucide-react';

const HighlightsSection: React.FC = () => {
  const highlights = [
    {
      icon: <Lightbulb className="h-16 w-16 text-primary opacity-50" />,
      title: "Creative Innovation",
      description: "Developed innovative approaches to complex challenges, resulting in elegant and effective solutions."
    },
    {
      icon: <Users className="h-16 w-16 text-primary opacity-50" />,
      title: "Collaboration",
      description: "Led diverse teams to achieve outstanding results through effective communication and shared vision."
    },
    {
      icon: <Rocket className="h-16 w-16 text-primary opacity-50" />,
      title: "Growth Journey",
      description: "Continuously expanding knowledge and skills through dedication to learning and personal development."
    }
  ];

  return (
    <section className="py-20 px-6 bg-secondary">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-inter mb-6 reveal">Highlights</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto reveal">
            A glimpse into some of my notable moments and achievements
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {highlights.map((highlight, index) => (
            <div 
              key={index}
              className="bg-card rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl reveal"
            >
              <div className="h-48 bg-primary bg-opacity-20 flex items-center justify-center">
                {highlight.icon}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{highlight.title}</h3>
                <p className="text-muted-foreground text-sm">{highlight.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HighlightsSection;
