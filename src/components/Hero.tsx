
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
      {/* Background gradient */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-background"></div>
        <div className="absolute inset-0 backdrop-blur-sm"></div>
      </div>
      
      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div>
            <FadeIn delay={100}>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bebas tracking-wider text-balance mb-6">
                WHERE <span className="text-primary">CREATORS</span> MEET <span className="text-primary">OPPORTUNITY</span>
              </h1>
            </FadeIn>
            
            <FadeIn delay={200}>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                Connect with creative projects that need your talents or find the perfect team to bring your vision to life. No gatekeepers. Just pure artistic collaboration.
              </p>
            </FadeIn>
            
            <FadeIn delay={300}>
              <div className="flex flex-col sm:flex-row gap-4">
                {!user ? (
                  <>
                    <Link to="/signup">
                      <Button size="lg" icon={<ArrowRight size={18} />} iconPosition="right" className="rounded-full">
                        Join Now
                      </Button>
                    </Link>
                    <Link to="/projects">
                      <Button size="lg" variant="outline" className="rounded-full">
                        Browse Projects
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/projects">
                      <Button size="lg" icon={<ArrowRight size={18} />} iconPosition="right" className="rounded-full">
                        Find Projects
                      </Button>
                    </Link>
                    <Link to="/find-creators">
                      <Button size="lg" variant="outline" className="rounded-full">
                        Find Creators
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </FadeIn>
          </div>
          
          {/* Illustration/visual side */}
          <FadeIn delay={400}>
            <div className="hidden md:block relative">
              <div className="grid grid-cols-3 grid-rows-3 gap-4">
                <div className="col-span-2 row-span-2 bg-primary/10 rounded-2xl p-6 backdrop-blur-sm border border-primary/20">
                  <h3 className="font-bebas text-2xl mb-3">FILMMAKERS</h3>
                  <p className="text-muted-foreground">Connect with cinematographers, editors, and sound designers for your next film project.</p>
                </div>
                <div className="col-span-1 row-span-1 bg-secondary/40 backdrop-blur-sm p-6 rounded-2xl">
                  <h3 className="font-bebas text-xl mb-2">MUSICIANS</h3>
                </div>
                <div className="col-span-1 row-span-2 bg-secondary/40 backdrop-blur-sm p-6 rounded-2xl">
                  <h3 className="font-bebas text-xl mb-2">PHOTOGRAPHERS</h3>
                </div>
                <div className="col-span-3 row-span-1 bg-secondary/40 backdrop-blur-sm p-6 rounded-2xl">
                  <h3 className="font-bebas text-xl mb-2">WRITERS & DESIGNERS</h3>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
        
        {/* Platform highlights cards */}
        <FadeIn delay={500}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="bg-secondary/40 backdrop-blur-md p-6 rounded-2xl border border-border/40">
              <h3 className="font-bebas text-2xl mb-3">DISCOVER</h3>
              <p className="text-muted-foreground">Find projects that match your skills and creative vision, from films to podcasts to marketing campaigns.</p>
            </div>
            
            <div className="bg-secondary/40 backdrop-blur-md p-6 rounded-2xl border border-border/40">
              <h3 className="font-bebas text-2xl mb-3">CONNECT</h3>
              <p className="text-muted-foreground">Build your network with fellow creatives who share your passion for artistic excellence.</p>
            </div>
            
            <div className="bg-secondary/40 backdrop-blur-md p-6 rounded-2xl border border-border/40">
              <h3 className="font-bebas text-2xl mb-3">CREATE</h3>
              <p className="text-muted-foreground">Collaborate directly with project leads and team members, with no middlemen or gatekeepers.</p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default Hero;
