
import React from 'react';
import FadeIn from './ui-custom/FadeIn';
import { CheckCircle } from 'lucide-react';

const About: React.FC = () => {
  const advantages = [
    "Intuitive design principles for exceptional user experience",
    "Focused on simplicity without sacrificing functionality",
    "Attention to detail in every aspect of the product",
    "Thoughtfully crafted with your needs in mind",
    "Continuously improved based on user feedback"
  ];

  return (
    <section id="about" className="py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image/Illustration side */}
          <FadeIn direction="right">
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 to-primary/30 relative">
                  {/* Main image/illustration placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3/4 h-3/4 bg-white rounded-xl shadow-xl p-6 flex items-center justify-center">
                      <span className="text-xl font-semibold text-center text-foreground">
                        Your Product Vision
                      </span>
                    </div>
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute top-6 left-6 w-16 h-16 bg-primary/20 rounded-full animate-float" />
                  <div className="absolute bottom-12 right-8 w-10 h-10 bg-secondary rounded-full animate-float" style={{ animationDelay: '1.5s' }} />
                </div>
              </div>
              
              {/* Stats card */}
              <div className="absolute -bottom-6 -right-6 glass-morphism p-6 rounded-xl shadow-lg md:max-w-[240px]">
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Satisfaction</span>
                    <span className="text-sm font-medium">98%</span>
                  </div>
                  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: '98%' }}></div>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Performance</span>
                    <span className="text-sm font-medium">95%</span>
                  </div>
                  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: '95%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
          
          {/* Text content */}
          <div>
            <FadeIn>
              <span className="inline-block text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full mb-3">
                About Us
              </span>
            </FadeIn>
            
            <FadeIn delay={100}>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why Choose Our Solution?
              </h2>
            </FadeIn>
            
            <FadeIn delay={200}>
              <p className="text-lg text-muted-foreground mb-6">
                We believe in creating products that are not only functional but also beautiful and intuitive. Our approach focuses on simplicity, clarity, and attention to detail – ensuring that every interaction feels natural and purposeful.
              </p>
            </FadeIn>
            
            <FadeIn delay={300}>
              <p className="text-lg text-muted-foreground mb-8">
                From the very beginning, we've been guided by the principle that technology should enhance human capability without adding complexity. This philosophy informs every aspect of our product design.
              </p>
            </FadeIn>
            
            <FadeIn delay={400}>
              <div className="space-y-3 mb-8">
                {advantages.map((advantage, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="text-primary mt-1 mr-3 h-5 w-5 flex-shrink-0" />
                    <span>{advantage}</span>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
