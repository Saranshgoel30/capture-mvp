
import React from 'react';
import { ArrowRight } from 'lucide-react';
import Button from './ui-custom/Button';
import FadeIn from './ui-custom/FadeIn';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const CallToAction: React.FC = () => {
  const { user } = useAuth();

  return (
    <section id="cta" className="py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="relative bg-primary/10 rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent"></div>
          
          <div className="relative z-10 p-12 md:p-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <FadeIn>
                  <h2 className="text-4xl md:text-5xl font-bebas tracking-wider mb-6">
                    READY TO START YOUR CREATIVE JOURNEY?
                  </h2>
                </FadeIn>
                
                <FadeIn delay={100}>
                  <p className="text-lg mb-8">
                    Join our community of artists, filmmakers, photographers, and creators bringing their visions to life through collaboration.
                  </p>
                </FadeIn>
                
                <FadeIn delay={200}>
                  <div className="flex flex-col sm:flex-row gap-4">
                    {!user ? (
                      <>
                        <Link to="/signup">
                          <Button size="lg" icon={<ArrowRight size={18} />} iconPosition="right" className="rounded-full">
                            Create Account
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
                            Explore Projects
                          </Button>
                        </Link>
                        <Link to="/my-projects">
                          <Button size="lg" variant="outline" className="rounded-full">
                            My Projects
                          </Button>
                        </Link>
                      </>
                    )}
                  </div>
                </FadeIn>
              </div>
              
              <div className="hidden md:block">
                <FadeIn delay={300}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-background/80 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                      <h3 className="font-semibold mb-2">For Creators</h3>
                      <ul className="space-y-2 text-sm">
                        <li>• Find paid opportunities</li>
                        <li>• Build your portfolio</li>
                        <li>• Connect with like-minded artists</li>
                        <li>• Grow your network</li>
                      </ul>
                    </div>
                    <div className="bg-background/80 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                      <h3 className="font-semibold mb-2">For Project Owners</h3>
                      <ul className="space-y-2 text-sm">
                        <li>• Find talented creators</li>
                        <li>• Post project needs</li>
                        <li>• Direct collaboration</li>
                        <li>• Build your creative team</li>
                      </ul>
                    </div>
                  </div>
                </FadeIn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
