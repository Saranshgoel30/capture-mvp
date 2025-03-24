
import React from 'react';
import { toast } from "sonner";
import { Send, Instagram } from 'lucide-react';
import Button from './ui-custom/Button';
import FadeIn from './ui-custom/FadeIn';

const Contact: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent successfully! We'll get back to you soon.");
  };

  return (
    <section id="contact" className="py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-bebas tracking-wider mb-4">
              GET IN TOUCH
            </h2>
          </FadeIn>
          
          <FadeIn delay={100}>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Have questions or want to learn more? Drop us a message and we'll get back to you as soon as possible.
            </p>
          </FadeIn>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <FadeIn delay={200}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-input bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="John Doe"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-input bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-input bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="How can we help?"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  placeholder="Tell us more about your questions or ideas..."
                />
              </div>
              
              <div className="flex justify-end">
                <Button type="submit" size="lg" icon={<Send size={18} />} iconPosition="right" className="rounded-full">
                  Send Message
                </Button>
              </div>
            </form>
          </FadeIn>
        </div>
        
        <div className="mt-16 text-center">
          <FadeIn delay={300}>
            <div className="flex justify-center items-center gap-6">
              <a href="#" className="text-foreground hover:text-primary transition-all-200">
                <Instagram size={24} />
              </a>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              © {new Date().getFullYear()} Capture. All rights reserved.
            </p>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

export default Contact;
