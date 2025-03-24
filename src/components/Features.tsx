
import React from 'react';
import { BarChart, Layers, Zap, Shield, Lightbulb, LineChart } from 'lucide-react';
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
      <div className="h-full group p-6 rounded-xl border border-border bg-card/50 hover:bg-card hover:shadow-md transition-all-300">
        <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-all-300">
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
      icon: <Zap size={24} />,
      title: "Lightning Fast",
      description: "Our platform is optimized for speed, giving you results in milliseconds rather than seconds."
    },
    {
      icon: <Shield size={24} />,
      title: "Highly Secure",
      description: "Enterprise-grade security ensures your data is always protected and compliant."
    },
    {
      icon: <Layers size={24} />,
      title: "Seamless Integration",
      description: "Connects with your existing tools and workflows without complicated setup."
    },
    {
      icon: <BarChart size={24} />,
      title: "Insightful Analytics",
      description: "Gain valuable insights with our comprehensive analytics dashboard."
    },
    {
      icon: <Lightbulb size={24} />,
      title: "Smart Automation",
      description: "Automate repetitive tasks and focus on what matters most to your business."
    },
    {
      icon: <LineChart size={24} />,
      title: "Scalable Performance",
      description: "Our infrastructure scales with your needs, from startup to enterprise."
    }
  ];

  return (
    <section id="features" className="py-24 px-6 md:px-12 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <FadeIn>
            <span className="inline-block text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full mb-3">
              Core Features
            </span>
          </FadeIn>
          
          <FadeIn delay={100}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Succeed
            </h2>
          </FadeIn>
          
          <FadeIn delay={200}>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive suite of features is designed to help you achieve your goals efficiently and effectively.
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
