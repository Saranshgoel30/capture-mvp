
import React from 'react';
import { Users, Camera, Sparkles, Megaphone, Globe, Heart } from 'lucide-react';
import FadeIn from './ui-custom/FadeIn';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, delay }) => {
  return (
    <FadeIn delay={delay} direction="up">
      <div className="h-full group p-6 rounded-xl border border-border bg-card/50 hover:bg-card hover:shadow-md transition-all duration-300">
        <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-300">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </FadeIn>
  );
};

const Features: React.FC = () => {
  const features = [
    {
      icon: <Users size={24} />,
      title: "Creative Community",
      description: "Connect with passionate creators in India who share your artistic vision for collaborative projects."
    },
    {
      icon: <Camera size={24} />,
      title: "Portfolio Showcase",
      description: "Build a portfolio that highlights your skills and attracts collaborative opportunities across India."
    },
    {
      icon: <Sparkles size={24} />,
      title: "Project Matching",
      description: "Our platform helps match your unique talents with creative projects seeking your expertise."
    },
    {
      icon: <Megaphone size={24} />,
      title: "Direct Networking",
      description: "Connect directly with project leads and fellow creators without unnecessary barriers."
    },
    {
      icon: <Globe size={24} />,
      title: "National & Global Reach",
      description: "Find projects in your local community or collaborate with creators across India and beyond."
    },
    {
      icon: <Heart size={24} />,
      title: "Supportive Network",
      description: "Join a community of creative professionals who understand and support your artistic journey."
    }
  ];

  return (
    <section id="features" className="py-24 px-6 md:px-12 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <FadeIn>
            <span className="inline-block text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full mb-3">
              Platform Features
            </span>
          </FadeIn>
          
          <FadeIn delay={100}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Designed for Creative Collaboration
            </h2>
          </FadeIn>
          
          <FadeIn delay={200}>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform brings together all the tools and connections you need to find your next creative collaboration and build your artistic career.
            </p>
          </FadeIn>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={100 * (index + 1)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
