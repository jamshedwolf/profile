// Shared TypeScript Types

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  image_position?: string;
  technologies: string[];
  live_url: string | null;
  github_url: string | null;
  featured: boolean;
  published: boolean;
  created_at: string;
  updated_at?: string;
  user_id?: string | null;
}

export interface SocialLink {
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  label: string;
}

export interface Stat {
  value: number;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface Skill {
  name: string;
  icon?: string;
  level?: number;
}

export interface Service {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  features?: string[];
}

export interface Testimonial {
  name: string;
  role: string;
  content: string;
  avatar: string;
}

export interface EducationItem {
  title: string;
  institution: string;
  period: string;
  type: "education";
}

export interface ExperienceItem {
  title: string;
  company: string;
  period: string;
  type: "work";
}

export interface SkillsData {
  [category: string]: Skill[];
}

