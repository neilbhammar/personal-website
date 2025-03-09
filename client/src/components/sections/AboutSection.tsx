import React from 'react';
import { CheckCircle } from 'lucide-react';

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 px-6">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold font-inter mb-8 reveal">About Me</h2>
          <div className="grid md:grid-cols-2 gap-10">
            <div className="reveal">
              <p className="text-muted-foreground mb-6">
                I'm Neil Bhammar, a passionate creator dedicated to crafting unique, innovative solutions. 
                My work spans various domains, focused on delivering exceptional results.
              </p>
              <p className="text-muted-foreground mb-6">
                I believe in the power of thoughtful design and precise execution. When I'm not working, 
                you might find me exploring new technologies, reading, or seeking inspiration in unexpected places.
              </p>
              <div className="flex flex-wrap gap-3 mt-8">
                <span className="px-4 py-1 bg-secondary rounded-full text-foreground text-sm">Design</span>
                <span className="px-4 py-1 bg-secondary rounded-full text-foreground text-sm">Development</span>
                <span className="px-4 py-1 bg-secondary rounded-full text-foreground text-sm">Innovation</span>
                <span className="px-4 py-1 bg-secondary rounded-full text-foreground text-sm">Creativity</span>
              </div>
            </div>
            
            <div className="reveal">
              <div className="bg-card rounded-2xl shadow-lg p-6 h-full relative overflow-hidden group">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary bg-opacity-10 rounded-full transition-transform duration-300 group-hover:scale-150"></div>
                <h3 className="text-xl font-bold mb-4 relative z-10">What I Do</h3>
                <ul className="space-y-4 relative z-10">
                  <li className="flex items-start">
                    <span className="text-primary mr-3 mt-1">
                      <CheckCircle className="h-5 w-5" />
                    </span>
                    <span className="text-card-foreground">Create thoughtful, engaging experiences</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-3 mt-1">
                      <CheckCircle className="h-5 w-5" />
                    </span>
                    <span className="text-card-foreground">Develop elegant solutions to complex problems</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-3 mt-1">
                      <CheckCircle className="h-5 w-5" />
                    </span>
                    <span className="text-card-foreground">Collaborate with forward-thinking teams</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-3 mt-1">
                      <CheckCircle className="h-5 w-5" />
                    </span>
                    <span className="text-card-foreground">Push the boundaries of what's possible</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
