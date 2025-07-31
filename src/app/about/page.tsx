"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Target, 
  Award, 
  Shield, 
  Fish, 
  MapPin, 
  CloudSun, 
  Scale, 
  MessageCircle,
  Bot,
  Globe,
  Heart
} from "lucide-react";

export default function AboutPage() {
  const { t } = useLanguage();

  const features = [
    {
      icon: MapPin,
      title: "Interactive Maps",
      description: "Real-time location tracking and fishing spot discovery"
    },
    {
      icon: CloudSun,
      title: "Weather Intelligence",
      description: "AI-powered weather forecasts and fishing analytics"
    },
    {
      icon: Scale,
      title: "Legal Guidance",
      description: "Comprehensive fishing laws and regulations database"
    },
    {
      icon: Shield,
      title: "Safety First",
      description: "Emergency SOS and safety guidelines for water activities"
    },
    {
      icon: MessageCircle,
      title: "AI Assistant",
      description: "Intelligent chatbot for personalized fishing advice"
    },
    {
      icon: Globe,
      title: "Multi-language",
      description: "Support for multiple languages and regional communities"
    }
  ];

  const stats = [
    { number: "10,000+", label: "Active Users" },
    { number: "50,000+", label: "Fishing Spots Mapped" },
    { number: "25+", label: "Countries Supported" },
    { number: "99.9%", label: "Uptime Reliability" }
  ];

  const team = [
    {
      name: "MatsyaN QuarkVerse Team",
      role: "Development Team",
      description: "Passionate developers and fishing enthusiasts"
    }
  ];

  return (
    <div className="min-h-screen bg-custom-white dark:bg-black">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
        
        {/* Hero Section */}
        <section className="text-center space-y-6">
          <div className="space-y-4">
            <Badge variant="outline" className="px-4 py-2 border-custom-secondary/30 text-custom-secondary">
              <Bot className="w-4 h-4 mr-2" />
              <span className="font-claude">About FisherMate.AI</span>
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-medium font-claude">
              Revolutionizing Fishing
              <span className="block text-custom-primary">with AI Technology</span>
            </h1>
            <p className="text-xl text-muted-foreground dark:text-custom-secondary max-w-3xl mx-auto leading-relaxed font-claude">
              FisherMate.AI is your intelligent fishing companion, combining cutting-edge AI technology 
              with comprehensive fishing expertise to ensure safer, smarter, and more successful fishing experiences.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-medium font-claude">Our Mission</h2>
            <p className="text-lg text-muted-foreground dark:text-custom-secondary leading-relaxed font-claude">
              We believe that fishing should be accessible, safe, and enjoyable for everyone. 
              Our mission is to democratize fishing knowledge and provide advanced tools that 
              help both novice and experienced anglers make informed decisions on the water.
            </p>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              <span className="text-sm text-muted-foreground">
                Built with passion for the fishing community
              </span>
            </div>
          </div>
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-custom-primary" />
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                To become the world's most trusted AI-powered fishing platform, 
                connecting millions of anglers with the knowledge, tools, and community 
                they need for successful and sustainable fishing practices.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Features Grid */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">What Makes Us Different</h2>
            <p className="text-lg text-muted-foreground">
              Advanced AI technology meets traditional fishing wisdom
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="modern-card hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-custom-primary/10">
                      <feature.icon className="w-5 h-5 text-custom-primary" />
                    </div>
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Our Impact</h2>
            <p className="text-lg text-muted-foreground">
              Trusted by fishing enthusiasts worldwide
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="modern-card text-center">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-custom-primary">
                      {stat.number}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Technology Section */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Powered by Advanced Technology</h2>
            <p className="text-lg text-muted-foreground">
              Cutting-edge AI and modern web technologies
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="modern-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-custom-primary" />
                  AI & Machine Learning
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground">
                  Our AI models analyze weather patterns, water conditions, and historical data 
                  to provide intelligent fishing recommendations and predictions.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Google AI</Badge>
                  <Badge variant="secondary">Weather Analysis</Badge>
                  <Badge variant="secondary">Pattern Recognition</Badge>
                </div>
              </CardContent>
            </Card>
            <Card className="modern-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-custom-primary" />
                  Modern Platform
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground">
                  Built with Next.js, React, and modern web standards for fast, reliable, 
                  and accessible user experiences across all devices.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Next.js</Badge>
                  <Badge variant="secondary">PWA</Badge>
                  <Badge variant="secondary">Real-time Data</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Team Section */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Built by Fishing Enthusiasts</h2>
            <p className="text-lg text-muted-foreground">
              A passionate team dedicated to improving the fishing experience
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member, index) => (
              <Card key={index} className="modern-card text-center">
                <CardHeader>
                  <div className="w-20 h-20 mx-auto bg-custom-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Users className="w-10 h-10 text-custom-primary" />
                  </div>
                  <CardTitle>{member.name}</CardTitle>
                  <p className="text-sm text-custom-primary font-medium">{member.role}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="text-center space-y-6">
          <Card className="modern-card">
            <CardHeader>
              <CardTitle>Join Our Community</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Have questions, feedback, or want to contribute? We'd love to hear from you!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Badge variant="outline" className="px-4 py-2">
                  <Fish className="w-4 h-4 mr-2" />
                  Open Source Project
                </Badge>
                <Badge variant="outline" className="px-4 py-2">
                  <Users className="w-4 h-4 mr-2" />
                  Community Driven
                </Badge>
              </div>
            </CardContent>
          </Card>
        </section>

      </div>
    </div>
  );
}
