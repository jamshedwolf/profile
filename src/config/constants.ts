// Portfolio Configuration Constants
import { 
  Github, 
  Linkedin, 
  Twitter,
  Briefcase,
  Code,
  Users,
  Award,
  Palette,
  Smartphone,

  Database,
  Globe,
  Rocket,
  Check,
  Mail
} from "lucide-react";
import { FileText, Zap, Cpu, BarChart2 } from "lucide-react";
import { UpworkIcon } from "@/components/icons/UpworkIcon";

// Social Media Links
export const socialLinks = [
   { icon: Github, href: "https://github.com/jamshedwolf", label: "GitHub" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/jamshedali12", label: "LinkedIn" },
 
  
  { icon: Mail, href: "mailto:jamsheedwolf@gmail.com", label: "Email" },
];

// Statistics
export const stats = [
  { value: 3, label: "Years Experience", icon: Briefcase },
  { value: 11, label: "Projects Completed", icon: Code },
  { value: 5, label: "Happy Clients", icon: Users },
  { value: 10, label: "Certifications", icon: Award },
];

// Skills for Home Page
export const homeSkills = [
  {
    name: "Python",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  },
  {
    name: "TensorFlow",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg",
  },
  {
    name: "NumPy",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg",
  },
  {
    name: "Pandas",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg",
  },
  {
    name: "Matplotlib",
    icon: "https://upload.wikimedia.org/wikipedia/commons/8/84/Matplotlib_icon.svg",
  },
  {
    name: "React",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  },
];




// Services for Home Page
export const homeServices = [
  { 
    icon: FileText, 
    title: "Research & Technical Writing", 
    description: "Writing research manuscripts, documentation, and clear technical explanations for AI-related work." 
  },
  { 
    icon: Zap, 
    title: "Problem Solving & Analysis", 
    description: "Approaching complex problems using logical reasoning, experimentation, and data-driven analysis." 
  },
  { 
    icon: Cpu, 
    title: "Deep Learning Systems", 
    description: "Working with deep learning concepts to understand model behavior, training processes, and performance." 
  },
  { 
    icon: BarChart2, 
    title: "Experimental Design & Evaluation", 
    description: "Designing experiments, visualizing results, and evaluating outcomes using research-oriented methods." 
  },
];

// Services for Services Page
export interface Service {
  icon: typeof Code;
  title: string;
  description: string;
  features: string[];
}

export const services: Service[] = [
  {
    icon: Code,
    title: "Frontend Development",
    description: "Building responsive, performant web applications with modern frameworks like React and Next.js.",
    features: [
      "React & Next.js Applications",
      "TypeScript Integration",
      "Performance Optimization",
      "Cross-browser Compatibility",
    ],
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description: "Creating intuitive and visually appealing interfaces that enhance user experience.",
    features: [
      "User Interface Design",
      "Prototyping & Wireframes",
      "Design Systems",
      "Accessibility Focus",
    ],
  },
  {
    icon: Database,
    title: "Backend Development",
    description: "Building robust server-side applications and APIs to power your applications.",
    features: [
      "RESTful API Design",
      "Database Architecture",
      "Authentication & Security",
      "Cloud Deployment",
    ],
  },
  {
    icon: Smartphone,
    title: "Responsive Design",
    description: "Ensuring your website looks and works great on all devices and screen sizes.",
    features: [
      "Mobile-first Approach",
      "Fluid Layouts",
      "Touch-friendly Interfaces",
      "Performance on Mobile",
    ],
  },
  {
    icon: Globe,
    title: "Web Applications",
    description: "Full-stack web application development from concept to deployment.",
    features: [
      "Custom Web Apps",
      "E-commerce Solutions",
      "Content Management",
      "Third-party Integrations",
    ],
  },
  {
    icon: Rocket,
    title: "Consulting",
    description: "Technical consulting to help you make the right technology decisions for your project.",
    features: [
      "Technical Audits",
      "Architecture Planning",
      "Code Reviews",
      "Team Mentoring",
    ],
  },
];

// Testimonials
export interface Testimonial {
  name: string;
  role: string;
  content: string;
  avatar: string;
}

export const testimonials: Testimonial[] = [
  {
    name: "Sarah Johnson",
    role: "CEO, TechStart",
    content: "Alex delivered an exceptional e-commerce platform that exceeded our expectations. The attention to detail and clean code quality was remarkable.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop",
  },
  {
    name: "Michael Chen",
    role: "Product Manager, InnovateLab",
    content: "Working with Alex was a pleasure. They understood our vision immediately and transformed it into a beautiful, functional application.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop",
  },
  {
    name: "Emily Rodriguez",
    role: "Founder, DesignHub",
    content: "The best developer I've worked with. Fast, reliable, and the code quality is top-notch. Highly recommend for any web project!",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop",
  },
];

// Navigation Links
export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },

  { href: "/contact", label: "Contact" },
];

// About Page Skills
export interface SkillCategory {
  name: string;
  level: number;
}

export interface SkillsData {
  [category: string]: SkillCategory[];
}

export const aboutSkills: SkillsData = {
  "Languages": [
    { name: "JavaScript", level: 90 },
    { name: "TypeScript", level: 85 },
    { name: "Python", level: 70 },
  ],
  "Frontend": [
    { name: "React", level: 95 },
    { name: "Next.js", level: 80 },
    { name: "Tailwind CSS", level: 90 },
    { name: "HTML/CSS", level: 95 },
  ],
  "Backend": [
    { name: "Node.js", level: 85 },
    { name: "PostgreSQL", level: 75 },
    { name: "MongoDB", level: 70 },
  ],
  "Tools": [
    { name: "Git", level: 90 },
    { name: "Docker", level: 65 },
    { name: "Figma", level: 80 },
  ],
};

// Education
export interface EducationItem {
  title: string;
  institution: string;
  period: string;
  type: "education";
}

export const education: EducationItem[] = [
  {
    title: "Computer Science Degree",
    institution: "Karakoram International University Gilgit-Baltistan",
    period: "2024",
    type: "education",
  },
  {
    title: "Full Stack Certification",
    institution: "Tech Academy Online",
    period: "2022",
    type: "education",
  },
];

// Experience
export interface ExperienceItem {
  title: string;
  company: string;
  period: string;
  type: "work";
}

export const experience: ExperienceItem[] = [
  {
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    period: "2023 - Present",
    type: "work",
  },
  {
    title: "Web Developer",
    company: "Digital Agency",
    period: "2021 - 2023",
    type: "work",
  },
  {
    title: "Junior Developer",
    company: "StartupHub",
    period: "2020 - 2021",
    type: "work",
  },
];

// Storage Configuration
export const STORAGE_CONFIG = {
  BUCKET_NAME: 'project-images',
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_MIME_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jfif'],
} as const;

// Client Testimonial Videos
export interface ClientVideo {
  videoUrl: string; // YouTube, Vimeo, or direct video URL
  clientName: string;
  clientRole: string;
  companyName?: string;
  thumbnail?: string; // Optional custom thumbnail image URL
}

export const clientVideos: ClientVideo[] = [
  {
    videoUrl: "https://youtu.be/Z6fmXkKqZwg",
    clientName: "Client Testimonial",
    clientRole: "Client",
    companyName: "Client Company",
  },
];

