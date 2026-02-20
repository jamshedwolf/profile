import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Download,
  Star,
  Quote,
  ExternalLink,
  Github,
  GraduationCap,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import developerAvatar from "../assets/developer-avatar.jpg";
import { 
  socialLinks, 
  stats, 
  homeSkills, 
  homeServices, 
  testimonials 
} from "@/config/constants";
import { containerVariants, itemVariants } from "@/config/animations";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import { supabase } from "@/integrations/supabase/client";
import { UpworkIcon } from "@/components/icons/UpworkIcon";
import type { Project } from "@/types";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [api, setApi] = useState<CarouselApi>();
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrentSlide(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    onSelect();

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  // Fetch featured projects dynamically
  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      try {
        // Using type assertion since the projects table was just created
        const { data, error } = await supabase
          .from("projects" as any)
          .select("*")
          .eq("featured", true)
          .eq("published", true)
          .order("created_at", { ascending: false })
          .limit(3);

        if (error) throw error;
        setFeaturedProjects((data as unknown as Project[]) || []);
      } catch (error) {
        // Silently fail - will show empty state
        setFeaturedProjects([]);
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchFeaturedProjects();
  }, []);

  
     

  return (
    <>
      {/* Hero Section */}
      <section className="min-h-[calc(100vh-80px)] flex items-center hero-gradient relative overflow-hidden pt-20 md:pt-24 lg:pt-12 xl:pt-16">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-10 w-[500px] h-[500px] bg-gradient-to-br from-accent/20 to-primary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-primary/5 to-accent/5 rounded-full blur-3xl" />
        </div>

        {/* Social Links - Vertical - Outside Container */}
        <div className="hidden xl:flex flex-col gap-4 fixed left-6 top-1/2 -translate-y-1/2 z-20">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 hover:scale-110 bg-background/80 backdrop-blur-sm border border-border/50"
              aria-label={social.label}
            >
              <social.icon className="h-5 w-5" />
            </a>
          ))}
        </div>

        <div className="container-custom relative z-10 py-8 md:py-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-6"
            >

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20"
              >
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-sm text-primary font-medium">Seeking research and academic opportunities.</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-3"
              >
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-tight">
                  Hi, I'm{" "}
                  <span className="text-primary">Jamshed</span>{" "}
                  <span className="text-accent">Ali</span>
                </h1>
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-muted-foreground">
                  Aspiring AI Researcher & Developer
                </h2>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed"
              >
                I develop intelligent digital systems grounded in research, clean code, and modern technologies, with a strong focus on experimentation, usability, and real-world impact.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-nowrap gap-2 sm:gap-4 pt-4"
              >
                <Button variant="hero" size="default" asChild className="group shrink-0 h-10 flex-1 sm:flex-initial sm:h-14 sm:px-10 sm:text-lg">
                  <Link to="/contact" className="flex items-center justify-center whitespace-nowrap">
                    <span className="text-sm sm:text-lg">Let's Talk</span>
                    <ArrowRight className="ml-1.5 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform shrink-0" />
                  </Link>
                </Button>
               <Button
  variant="outline"
  size="default"
  asChild
  className="shrink-0 h-10 flex-1 sm:flex-initial sm:h-14 sm:px-10 sm:text-lg whitespace-nowrap"
>
  <a href="/Cv.pdf" download>
    <Download className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
    <span className="hidden sm:inline">Download CV</span>
    <span className="sm:hidden">CV</span>
  </a>
</Button>
              </motion.div>

              {/* Mobile Social Links */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex lg:hidden gap-3 pt-4"
              >
                {socialLinks.map((social) => (
                  <Button key={social.label} variant="social" size="icon" asChild>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                    >
                      <social.icon className="h-4 w-4" />
                    </a>
                  </Button>
                ))}
              </motion.div>
            </motion.div>

            {/* Right - Avatar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="flex justify-center lg:justify-end"
            >
              <div className="relative">
                {/* Main avatar */}
                <motion.div 
                  className="relative w-72 h-72 md:w-80 md:h-80 lg:w-[400px] lg:h-[400px] rounded-full overflow-hidden shadow-2xl group"
                  animate={{ 
                    y: [0, -10, 0],
                    scale: [1, 1.02, 1]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    rotate: [0, 2, -2, 0]
                  }}
                >
                  {/* Animated border glow */}
                  <motion.div
                    className="absolute inset-0 rounded-full border-4"
                    style={{
                      borderColor: "hsl(var(--primary) / 0.3)",
                    }}
                    animate={{
                      boxShadow: [
                        "0 0 20px hsl(var(--primary) / 0.2), 0 0 40px hsl(var(--primary) / 0.1)",
                        "0 0 40px hsl(var(--accent) / 0.3), 0 0 60px hsl(var(--accent) / 0.2)",
                        "0 0 20px hsl(var(--primary) / 0.2), 0 0 40px hsl(var(--primary) / 0.1)"
                      ]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  
                  {/* Rotating gradient ring */}
                  <motion.div
                    className="absolute inset-0 rounded-full opacity-40"
                    style={{
                      background: "conic-gradient(from 0deg, transparent, hsl(var(--primary) / 0.4), transparent 50%, hsl(var(--accent) / 0.4), transparent)",
                    }}
                    animate={{
                      rotate: 360
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity, 
                      ease: "linear"
                    }}
                  />
                  
                  <motion.img
                    src={developerAvatar}
                    alt="jamshed ALi"
                    className="w-full h-full object-cover rounded-full relative z-10"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  />
                  
                  {/* Animated gradient overlay */}
                  <motion.div 
                    className="absolute inset-0 pointer-events-none rounded-full z-20"
                    style={{
                      background: "linear-gradient(135deg, hsl(var(--primary) / 0.1), transparent, hsl(var(--accent) / 0.1))"
                    }}
                    animate={{
                      opacity: [0.4, 0.7, 0.4],
                      rotate: [0, 180, 360]
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  
                  {/* Pulsing ring effect */}
                  <motion.div
                    className="absolute inset-0 rounded-full border-2"
                    style={{
                      borderColor: "hsl(var(--primary) / 0.2)",
                    }}
                    animate={{
                      scale: [1, 1.15, 1],
                      opacity: [0.6, 0, 0.6]
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeOut"
                    }}
                  />
                  
                  {/* Additional pulsing ring */}
                  <motion.div
                    className="absolute inset-0 rounded-full border border-accent/30"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.4, 0, 0.4]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeOut",
                      delay: 0.5
                    }}
                  />
                </motion.div>

                {/* Floating badges */}
                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -right-4 top-10 bg-gradient-to-br from-primary to-accent backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-primary/40 text-white"
                >
                  <span className="text-3xl">👋</span>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute -left-8 bottom-20 bg-gradient-to-br from-accent to-primary backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-accent/40 text-white"
                >
                  <span className="text-2xl">Coder</span>
                </motion.div>

                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute right-10 -bottom-4 bg-gradient-to-br from-primary to-accent backdrop-blur-sm rounded-2xl px-4 py-2 shadow-xl border border-primary/40 flex items-center gap-2 text-white"
                >
                  <Star className="h-4 w-4 text-yellow-300 fill-yellow-300" />
                  <span className="font-medium text-sm">Researcher</span>
                </motion.div>
              </div>
            </motion.div>
          </div>

         
          {/* Scroll indicator */}
       
        </div>
      </section>

      {/* Skills Preview Section */}
      <section className="page-section bg-card relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-accent/10 to-primary/10 rounded-full blur-3xl" />
        </div>
        
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="section-title">
            My <span className="gradient-text">Research & Development Stack</span>
            </h2>
            <p className="section-subtitle max-w-2xl mx-auto">
          Technologies and tools I use in research and development
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
          >
            {homeSkills.map((skill, i) => (
              <motion.div
                key={skill.name}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-background border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg cursor-pointer group"
              >
                <img 
  src={skill.icon} 
  alt={skill.name} 
  className="w-12 h-12 object-contain transition-transform group-hover:scale-110 dark:invert"
/>

                <span className="text-sm font-medium text-center">{skill.name}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
           
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="page-section relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-accent/10 to-primary/10 rounded-full blur-3xl" />
        </div>
        
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.h2 
              className="section-title mb-4"
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
             What i can  <span className="gradient-text">Do</span>
            </motion.h2>
            <motion.p 
              className="section-subtitle max-w-2xl mx-auto text-lg"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Areas of study and technical skills supporting my academic and research development.
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          >
            {homeServices.map((service, i) => (
              <motion.div
                key={service.title}
                variants={itemVariants}
                whileHover={{ y: -15, scale: 1.03, rotate: 1 }}
                className="group relative p-8 rounded-3xl bg-gradient-to-br from-card/80 via-background to-card/60 border-2 border-border/60 hover:border-primary/60 shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 overflow-hidden backdrop-blur-sm"
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
                    initial={{ scale: 0.8, opacity: 0, rotate: -180 }}
                    whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.6, type: "spring", stiffness: 200 }}
                  >
                    <motion.div 
                      className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-xl group-hover:shadow-primary/40 relative"
                      whileHover={{ scale: 1.15, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <service.icon className="h-8 w-8 text-primary-foreground relative z-10" />
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Pulsing glow effect */}
                      <motion.div
                        className="absolute inset-0 rounded-2xl bg-primary/30"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 0, 0.5]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeOut"
                        }}
                      />
                    </motion.div>
                    
                    {/* Decorative dots around icon */}
                    <motion.div 
                      className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-accent/60"
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 + 0.3, duration: 0.3 }}
                      whileHover={{ scale: 1.5 }}
                    />
                    <motion.div 
                      className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full bg-primary/60"
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 + 0.4, duration: 0.3 }}
                      whileHover={{ scale: 1.5 }}
                    />
                  </motion.div>

                  {/* Content */}
                  <motion.h3 
                    className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300"
                    initial={{ x: -20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 + 0.2, duration: 0.5 }}
                  >
                    {service.title}
                  </motion.h3>
                  
                  <motion.p 
                    className="text-muted-foreground leading-relaxed"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 + 0.3, duration: 0.5 }}
                  >
                    {service.description}
                  </motion.p>
                  
                  {/* Decorative bottom element */}
                  
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            
          </motion.div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="page-section bg-card relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl" />
        </div>

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4"
          >
            <div>
              <h2 className="section-title mb-2">
                Featured <span className="gradient-text">Projects</span>
              </h2>
              <p className="text-muted-foreground text-lg">
                Some of my recent work
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/projects">
                View All Projects <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {loadingProjects ? (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">Loading featured projects...</p>
              </div>
            ) : featuredProjects.length > 0 ? (
              featuredProjects.map((project) => (
                <motion.article
                  key={project.id}
                  variants={itemVariants}
                  whileHover={{ y: -10 }}
                  className="group bg-background rounded-2xl overflow-hidden border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-xl cursor-pointer"
                >
                  <Link to={`/projects/${project.id}`} className="block">
                    <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-muted/20 to-muted/5">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        style={{ 
                          objectPosition: project.image_position || 'center',
                          imageRendering: 'auto'
                        }}
                        loading="eager"
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {/* Action Buttons Overlay */}
                      {(project.live_url || project.github_url) && (
                        <div 
                          className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 z-20"
                          onClick={(e) => e.preventDefault()}
                        >
                          {project.live_url && (
                            <Button
                              size="default"
                              variant="default"
                              className="rounded-lg shadow-xl bg-primary text-primary-foreground hover:bg-primary/90"
                              asChild
                              onClick={(e) => e.stopPropagation()}
                            >
                              <a
                                href={project.live_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Live
                              </a>
                            </Button>
                          )}
                          {project.github_url && (
                            <Button
                              size="default"
                              variant="outline"
                              className="rounded-lg shadow-xl bg-background/95 backdrop-blur-sm"
                              asChild
                              onClick={(e) => e.stopPropagation()}
                            >
                              <a
                                href={project.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Github className="h-4 w-4 mr-2" />
                                Code
                              </a>
                            </Button>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <h3 className="font-semibold text-xl mb-2 group-hover:text-primary transition-colors line-clamp-1">
                        {project.title}
                      </h3>
                      <p className="text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1 text-xs rounded-full bg-secondary text-secondary-foreground"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No featured projects yet. Check back soon!</p>
              </div>
            )}
          </motion.div>
        </div>
      </section>

    
      
      

      {/* My Journey Section */}
      <section className="page-section bg-card relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl" />
        </div>
        
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              My <span className="gradient-text">Journey</span>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground">Education & Experience</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-16">
            {/* Education */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-4 mb-10">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20">
                  <GraduationCap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold">Education</h3>
              </div>
              <div className="space-y-4">
                <motion.div
                  variants={itemVariants}
                  className="group relative"
                >
                  {/* Chain connector line */}
                  <div className="absolute left-3 top-8 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary to-primary/20" />
                  
                  {/* Chain link circle */}
                  <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent border-2 border-background shadow-md flex items-center justify-center z-10">
                    <div className="w-1.5 h-1.5 rounded-full bg-background" />
                  </div>
                  
                  <div className="ml-10 p-4 rounded-xl bg-background border border-border/50 hover:border-primary/30 hover:shadow-md transition-all duration-300">
                    <h4 className="text-lg md:text-xl font-bold text-foreground mb-1">Computer Science Degree</h4>
                    Karakoram International University Gilgit-Baltistan
                    <p className="text-sm md:text-base text-muted-foreground mb-1"></p>
                    <p className="text-xs md:text-sm text-primary font-semibold">2023-2027</p>
                  </div>
                </motion.div>
                <motion.div
                  variants={itemVariants}
                  className="group relative"
                >
                  {/* Chain link circle - last item */}
                  <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent border-2 border-background shadow-md flex items-center justify-center z-10">
                    <div className="w-1.5 h-1.5 rounded-full bg-background" />
                  </div>
                  
                  <div className="ml-10 p-4 rounded-xl bg-background border border-border/50 hover:border-primary/30 hover:shadow-md transition-all duration-300">
                    <h4 className="text-lg md:text-xl font-bold text-foreground mb-1">12th Standard</h4>
                    <p className="text-sm md:text-base text-muted-foreground mb-1"> <b>Institute</b> :The Learning Academy Gilgit</p>
                    <p className="text-xs md:text-sm text-primary font-semibold">2021-2023</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Experience */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-4 mb-10">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-accent/20 to-primary/20">
                  <Briefcase className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold">Experience</h3>
              </div>
              <div className="space-y-4">
                <motion.div
                  variants={itemVariants}
                  className="group relative"
                >
                  {/* Chain connector line */}
                  <div className="absolute left-3 top-8 bottom-0 w-0.5 bg-gradient-to-b from-accent via-accent to-accent/20" />
                  
                  {/* Chain link circle */}
                  <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-gradient-to-br from-accent to-primary border-2 border-background shadow-md flex items-center justify-center z-10">
                    <div className="w-1.5 h-1.5 rounded-full bg-background" />
                  </div>
                  
                  <div className="ml-10 p-4 rounded-xl bg-background border border-border/50 hover:border-accent/30 hover:shadow-md transition-all duration-300">
                  <h4 className="text-lg md:text-xl font-bold text-foreground mb-1">Machine learning Learner
                  </h4>
                    <p className="text-sm md:text-base text-muted-foreground mb-1">Ai Researcher </p>
                    <p className="text-xs md:text-sm text-accent font-semibold">2024 - 2026</p>
                  </div>
                </motion.div>
                <motion.div
                  variants={itemVariants}
                  className="group relative"
                >
                  {/* Chain connector line */}
                  <div className="absolute left-3 top-8 bottom-0 w-0.5 bg-gradient-to-b from-accent/20 via-accent to-accent/20" />
                  
                  {/* Chain link circle */}
                  <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-gradient-to-br from-accent to-primary border-2 border-background shadow-md flex items-center justify-center z-10">
                    <div className="w-1.5 h-1.5 rounded-full bg-background" />
                  </div>
                  
                  <div className="ml-10 p-4 rounded-xl bg-background border border-border/50 hover:border-accent/30 hover:shadow-md transition-all duration-300">
                     <h4 className="text-lg md:text-xl font-bold text-foreground mb-1">Lead Frontend Developer </h4>
                    <p className="text-sm md:text-base text-muted-foreground mb-1">Triangle Technologies </p>
                    <p className="text-xs md:text-sm text-accent font-semibold">2023 - 2024</p>
                   
                    
                  </div>
                </motion.div>
               
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/* <section className="page-section bg-card relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-primary/15 to-accent/15 rounded-full blur-3xl" />
        </div>

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Ready to bring your{" "}
              <span className="gradient-text">ideas to life</span>?
            </h2>
            <p className="text-xl text-muted-foreground mb-10">
              Let's collaborate and create something amazing together. 
              I'm just a message away!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl" asChild className="group">
                <Link to="/contact">
                  Start a Project
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <a href="https://www.upwork.com/freelancers/~0120b6b4766aff10a3" target="_blank" rel="noopener noreferrer">
                  <UpworkIcon className="mr-2 h-5 w-5" />
                  Hire on Upwork
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section> */}
    </>
  );
}
