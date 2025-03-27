
import React from 'react';
import { ArrowRight } from 'lucide-react';
import Button from './ui-custom/Button';
import FadeIn from './ui-custom/FadeIn';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Hero: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <section id="home" className="min-h-screen pt-28 pb-16 px-6 md:px-12 flex items-center relative overflow-hidden">
      {/* Overlay background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-background"></div>
        <div className="absolute inset-0 backdrop-blur-sm"></div>
      </div>
      
      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 gap-12 items-center">
          {/* Text content */}
          <div className="text-center">
            <FadeIn delay={100}>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bebas tracking-wider text-balance mb-6">
                CONNECT. CREATE. <span className="text-primary">CAPTURE.</span>
              </h1>
            </FadeIn>
            
            <FadeIn delay={200}>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                The platform where creators find projects and projects find creators.
                No more gatekeeping. Just pure artistic collaboration.
              </p>
            </FadeIn>
            
            <FadeIn delay={300}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/projects">
                  <Button size="lg" icon={<ArrowRight size={18} />} iconPosition="right" className="rounded-full">
                    Find Projects
                  </Button>
                </Link>
                
                {!user && (
                  <Link to="/projects">
                    <Button size="lg" variant="outline" className="rounded-full">
                      Explore Without Signing Up
                    </Button>
                  </Link>
                )}
              </div>
            </FadeIn>
          </div>
          
          {/* Illustration/explanation of the platform */}
          <FadeIn delay={400}>
            <div className="max-w-4xl mx-auto w-full">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-secondary/40 backdrop-blur-md p-6 rounded-2xl">
                  <h3 className="font-bebas text-2xl mb-3">CREATORS</h3>
                  <p className="text-muted-foreground">Find projects that match your skills, connect with other artists, and build your portfolio.</p>
                </div>
                
                <div className="bg-secondary/40 backdrop-blur-md p-6 rounded-2xl">
                  <h3 className="font-bebas text-2xl mb-3">PROJECTS</h3>
                  <p className="text-muted-foreground">Post your creative project and find the perfect team to bring your vision to life.</p>
                </div>
                
                <div className="bg-secondary/40 backdrop-blur-md p-6 rounded-2xl">
                  <h3 className="font-bebas text-2xl mb-3">COLLABORATE</h3>
                  <p className="text-muted-foreground">Connect directly, no middlemen, no gatekeepers, just pure artistic collaboration.</p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

export default Hero;
