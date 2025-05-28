
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, Briefcase, MessageCircle, Sparkles, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import FadeIn from '@/components/ui-custom/FadeIn';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50/20 via-blue-50/10 to-purple-50/20"></div>
      
      {/* Geometric Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 border border-violet-200 rounded-full"></div>
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 border border-blue-200 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-purple-200 rounded-full"></div>
      </div>
      
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.015]"></div>
      
      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-screen py-20">
          {/* Left Column - Content */}
          <div className="space-y-12">
            <FadeIn>
              {/* Premium Badge */}
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-100 group hover:shadow-lg transition-all duration-300">
                <div className="w-2 h-2 bg-violet-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-violet-700">Where Creativity Meets Collaboration</span>
                <Sparkles className="h-4 w-4 text-violet-500" />
              </div>
            </FadeIn>
            
            <FadeIn delay={0.2}>
              {/* Main Headline with Better Typography */}
              <div className="space-y-6">
                <h1 className="text-6xl lg:text-7xl xl:text-8xl font-bebas font-bold leading-[0.9] tracking-tight">
                  <span className="block bg-gradient-to-r from-violet-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Create
                  </span>
                  <span className="block bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 bg-clip-text text-transparent">
                    Together
                  </span>
                </h1>
                
                {/* Decorative Line */}
                <div className="w-24 h-1 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"></div>
              </div>
            </FadeIn>
            
            <FadeIn delay={0.4}>
              {/* Refined Subheadline */}
              <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-2xl font-light">
                Connect with visionary creators, collaborate on groundbreaking projects, and bring your wildest creative dreams to life in a community that celebrates innovation.
              </p>
            </FadeIn>
            
            <FadeIn delay={0.6}>
              {/* Refined Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/projects">
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto text-lg px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 group"
                  >
                    <Sparkles className="mr-3 h-5 w-5 group-hover:rotate-12 transition-transform" />
                    Discover Magic
                    <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                
                <Link to="/login">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="w-full sm:w-auto text-lg px-8 py-4 border-2 border-violet-200 hover:border-violet-300 hover:bg-violet-50 transition-all duration-300 group"
                  >
                    Start Creating
                    <Star className="ml-3 h-5 w-5 group-hover:rotate-12 transition-transform" />
                  </Button>
                </Link>
              </div>
            </FadeIn>
          </div>
          
          {/* Right Column - Feature Preview Cards */}
          <div className="relative">
            <FadeIn delay={0.8}>
              <div className="grid grid-cols-1 gap-6">
                {/* Card 1 - Elevated */}
                <div className="relative transform rotate-2 hover:rotate-0 transition-transform duration-500">
                  <div className="p-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-violet-100 shadow-2xl hover:shadow-3xl transition-all duration-500 group">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bebas text-xl mb-2 text-foreground">Connect with Visionaries</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">Meet extraordinary creators who share your passion for innovation</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Card 2 - Centered */}
                <div className="relative transform -rotate-1 hover:rotate-0 transition-transform duration-500 ml-8">
                  <div className="p-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-blue-100 shadow-2xl hover:shadow-3xl transition-all duration-500 group">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg">
                        <Briefcase className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bebas text-xl mb-2 text-foreground">Join Epic Projects</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">Dive into groundbreaking projects that challenge boundaries</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Card 3 - Lower */}
                <div className="relative transform rotate-1 hover:rotate-0 transition-transform duration-500">
                  <div className="p-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-emerald-100 shadow-2xl hover:shadow-3xl transition-all duration-500 group">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
                        <MessageCircle className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bebas text-xl mb-2 text-foreground">Collaborate Seamlessly</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">Experience effortless collaboration with creative tools</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
            
            {/* Decorative Elements */}
            <div className="absolute -top-4 -left-4 w-8 h-8 border-2 border-violet-300 rounded-full opacity-40"></div>
            <div className="absolute -bottom-8 -right-6 w-12 h-12 border-2 border-blue-300 rounded-full opacity-30"></div>
            <div className="absolute top-1/2 -right-8 w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-50"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
