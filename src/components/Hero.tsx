
import React from 'react';
import { ArrowRight } from 'lucide-react';
import Button from './ui-custom/Button';
import FadeIn from './ui-custom/FadeIn';

const Hero: React.FC = () => {
  return (
    <section id="home" className="min-h-screen pt-28 pb-16 px-6 md:px-12 flex items-center">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Text content */}
          <div className="order-2 lg:order-1">
            <FadeIn delay={100}>
              <span className="inline-block text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full mb-3">
                Revolutionizing the Industry
              </span>
            </FadeIn>
            
            <FadeIn delay={200}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance mb-4">
                Transforming Ideas Into <span className="text-primary">Reality</span>
              </h1>
            </FadeIn>
            
            <FadeIn delay={300}>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                Our platform provides an intuitive solution to the industry's most pressing challenges, helping businesses thrive in the digital age.
              </p>
            </FadeIn>
            
            <FadeIn delay={400}>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" icon={<ArrowRight size={18} />} iconPosition="right">
                  Get Started
                </Button>
                
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </div>
            </FadeIn>
            
            <FadeIn delay={500}>
              <div className="mt-12 flex items-center gap-x-6">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div 
                      key={i} 
                      className="w-10 h-10 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-medium"
                    >
                      {i}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="font-medium">Join 2,500+ users</div>
                  <div className="text-sm text-muted-foreground">Already growing with us</div>
                </div>
              </div>
            </FadeIn>
          </div>
          
          {/* Hero image/illustration */}
          <div className="order-1 lg:order-2 flex justify-center">
            <FadeIn direction="left" delay={300}>
              <div className="relative">
                <div className="bg-gradient-to-b from-primary/20 to-transparent rounded-full w-[300px] h-[300px] md:w-[400px] md:h-[400px] flex items-center justify-center animate-pulse-subtle overflow-hidden">
                  <div className="absolute inset-0 bg-white/5 backdrop-blur-sm rounded-full" />
                  <div className="relative rounded-3xl overflow-hidden shadow-xl animate-float">
                    <div className="bg-primary h-40 w-56 md:h-60 md:w-80 rounded-3xl flex items-center justify-center">
                      <span className="text-white font-bold text-xl">Your Product</span>
                    </div>
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-secondary rounded-full animate-float" />
                <div className="absolute bottom-12 -left-8 w-8 h-8 bg-primary/30 rounded-full animate-float" style={{ animationDelay: '1s' }} />
                <div className="absolute bottom-4 right-4 w-16 h-16 bg-primary/20 rounded-full animate-float" style={{ animationDelay: '2s' }} />
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
