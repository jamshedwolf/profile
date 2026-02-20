import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Code, 
  Palette, 
  Smartphone, 
  Globe, 
  Database, 
  Rocket,
  ArrowRight,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Service {
  icon: typeof Code;
  title: string;
  description: string;
  features: string[];
}

const services: Service[] = [
  {
    icon: Code,
    title: "Frontend Development",
    description: "I develop modern, responsive web applications using React, Next.js, and TypeScript. I focus on creating fast, user-friendly interfaces that work seamlessly across all browsers and devices.",
    features: [
      "React & Next.js application development",
      "TypeScript for better code quality",
      "Responsive and mobile-friendly designs",
      "Performance optimization",
      "Component-based architecture",
      "Modern UI frameworks integration",
    ],
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description: "I create clean, intuitive user interfaces that are both beautiful and functional. I convert design mockups into working code while ensuring accessibility and great user experience.",
    features: [
      "Design to code conversion",
      "Responsive layout implementation",
      "User interface development",
      "Accessibility standards (WCAG)",
      "Interactive components",
      "Design system implementation",
    ],
  },
  {
    icon: Database,
    title: "Backend Development",
    description: "I build secure and scalable backend systems using Node.js and PostgreSQL. I develop RESTful APIs, handle database operations, and implement authentication systems.",
    features: [
      "RESTful API development",
      "Database design and management",
      "User authentication & authorization",
      "Server-side logic implementation",
      "API integration",
      "Data security implementation",
    ],
  },
  {
    icon: Smartphone,
    title: "Responsive Design",
    description: "I ensure all websites and applications work perfectly on mobile phones, tablets, and desktops. I use mobile-first approach to create fluid, touch-friendly interfaces.",
    features: [
      "Mobile-first responsive design",
      "Cross-device compatibility",
      "Touch-optimized interfaces",
      "Flexible grid layouts",
      "Mobile performance optimization",
      "Responsive image handling",
    ],
  },
  {
    icon: Globe,
    title: "Web Applications",
    description: "I build complete web applications from scratch, including frontend, backend, and database. I handle everything from planning to deployment, ensuring a smooth user experience.",
    features: [
      "Full-stack web development",
      "Custom web applications",
      "E-commerce solutions",
      "Content management systems",
      "Third-party integrations",
      "Deployment and hosting",
    ],
  },
  {
    icon: Rocket,
    title: "Consulting",
    description: "I provide technical guidance and help with project planning, code reviews, and technology decisions. I assist teams in choosing the right tools and improving their development process.",
    features: [
      "Project planning and architecture",
      "Code review and optimization",
      "Technology recommendations",
      "Performance analysis",
      "Best practices guidance",
      "Development workflow improvement",
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Services() {
  return (
    <>
      <section className="page-section relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-accent/10 to-primary/10 rounded-full blur-3xl" />
        </div>
        
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <motion.h1 
              className="section-title mb-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              My <span className="gradient-text">Services</span>
            </motion.h1>
            <motion.p 
              className="section-subtitle max-w-2xl mx-auto text-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              I offer a range of services to help bring your digital ideas to life. 
              From design to deployment, I've got you covered.
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                variants={itemVariants}
                whileHover={{ y: -12, scale: 1.02 }}
                className="group relative bg-gradient-to-br from-card/80 via-background to-card/60 rounded-3xl p-8 border-2 border-border/60 hover:border-primary/60 shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 overflow-hidden h-full backdrop-blur-sm"
                style={{
                  boxShadow: "0 10px 40px -10px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05) inset"
                }}
              >
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-60" />
                
                {/* Subtle pattern overlay */}
                <div 
                  className="absolute inset-0 opacity-[0.02]"
                  style={{
                    backgroundImage: "radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)",
                    backgroundSize: "24px 24px"
                  }}
                />
                
                {/* Shine effect on hover */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  initial={{ x: "-100%", opacity: 0 }}
                  whileHover={{ x: "100%", opacity: 1 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                />
                
                {/* Glowing border effect */}
                <motion.div
                  className="absolute inset-0 rounded-3xl opacity-30 group-hover:opacity-100 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10"
                  style={{
                    filter: "blur(8px)",
                  }}
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                
                {/* Top highlight for depth */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                
                <div className="relative z-10">
                  {/* Icon with enhanced styling */}
                  <motion.div 
                    className="relative mb-6"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <div className="relative w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary/20 group-hover:shadow-xl group-hover:shadow-primary/40">
                      <service.icon className="h-8 w-8 text-primary-foreground relative z-10" />
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    {/* Decorative dots around icon */}
                    <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-accent/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.div>

                  {/* Content */}
                  <motion.h3 
                    className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors duration-300"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                  >
                    {service.title}
                  </motion.h3>
                  
                  <motion.p 
                    className="text-muted-foreground text-base mb-6 leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                  >
                    {service.description}
                  </motion.p>

                  {/* Features with enhanced styling */}
                  <motion.ul 
                    className="space-y-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.4, duration: 0.5 }}
                  >
                    {service.features.map((feature, featureIndex) => (
                      <motion.li
                        key={feature}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + featureIndex * 0.1 + 0.5, duration: 0.3 }}
                        className="flex items-center gap-3 text-sm text-foreground group/item"
                      >
                        <div className="relative">
                          <div className="absolute inset-0 bg-primary/20 rounded-full blur-sm opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
                          <Check className="h-5 w-5 text-primary shrink-0 relative z-10 bg-primary/10 rounded-full p-1 group-hover/item:scale-110 transition-transform duration-300" />
                        </div>
                        <span className="group-hover/item:text-primary transition-colors duration-300 font-medium">
                          {feature}
                        </span>
                      </motion.li>
                    ))}
                  </motion.ul>
                  
                  {/* Decorative bottom element */}
                  <div className="mt-6 pt-6 border-t border-border/30">
                    <motion.div
                      className="flex items-center gap-2 text-primary text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ x: -10 }}
                      whileHover={{ x: 0 }}
                    >
                      <span>Learn More</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="page-section bg-card">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-4">
              Ready to start your <span className="gradient-text">project</span>?
            </h2>
            <p className="text-muted-foreground mb-8">
              Let's discuss your ideas and see how we can work together to bring 
              your vision to life. I'm always excited to take on new challenges.
            </p>
            <Button variant="hero" size="lg" asChild>
              <Link to="/contact">
                Get In Touch <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  );
}
