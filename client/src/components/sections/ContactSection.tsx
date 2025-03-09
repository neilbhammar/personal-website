import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { FaTwitter, FaLinkedinIn, FaGithub, FaInstagram } from 'react-icons/fa';
import { useToast } from '@/hooks/use-toast';

const ContactSection: React.FC = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate form submission
    toast({
      title: "Message sent!",
      description: "Thank you for reaching out. I'll get back to you soon.",
    });
    
    // Reset form
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className="py-20 px-6">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="reveal">
              <h2 className="text-3xl md:text-4xl font-bold font-inter mb-6">Let's Connect</h2>
              <p className="text-muted-foreground mb-8">
                I'm always open to interesting conversations and new opportunities. Feel free to reach out!
              </p>
              
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary bg-opacity-20 flex items-center justify-center mr-4">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <a 
                    href="mailto:bhammar.neil@gmail.com" 
                    className="text-foreground hover:text-primary transition-colors"
                  >
                    bhammar.neil@gmail.com
                  </a>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <a 
                  href="#" 
                  className="social-btn w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white"
                >
                  <FaTwitter className="h-5 w-5" />
                </a>
                <a 
                  href="#" 
                  className="social-btn w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white"
                >
                  <FaLinkedinIn className="h-5 w-5" />
                </a>
                <a 
                  href="#" 
                  className="social-btn w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white"
                >
                  <FaGithub className="h-5 w-5" />
                </a>
                <a 
                  href="#" 
                  className="social-btn w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white"
                >
                  <FaInstagram className="h-5 w-5" />
                </a>
              </div>
            </div>
            
            <div className="reveal">
              <div className="bg-card rounded-2xl shadow-lg p-8 relative overflow-hidden">
                <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-primary bg-opacity-10 rounded-full"></div>
                <form className="relative z-10" onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <label htmlFor="name" className="block text-sm font-medium text-muted-foreground mb-2">Name</label>
                    <input 
                      type="text" 
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary transition-colors outline-none" 
                      placeholder="Your name"
                      required
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-2">Email</label>
                    <input 
                      type="email" 
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary transition-colors outline-none" 
                      placeholder="Your email"
                      required
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="message" className="block text-sm font-medium text-muted-foreground mb-2">Message</label>
                    <textarea 
                      id="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary transition-colors outline-none resize-none" 
                      placeholder="Your message"
                      required
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="w-full py-3 bg-primary text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
