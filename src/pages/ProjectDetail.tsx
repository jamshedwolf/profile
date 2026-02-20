import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Github, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import type { Project } from "@/types";
import { containerVariants, itemVariants } from "@/config/animations";

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;

      try {
        const { data, error } = await supabase
          .from("projects" as any)
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setProject(data as unknown as Project);
      } catch (error) {
        console.error("Error fetching project:", error);
        navigate("/projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, navigate]);

  if (loading) {
    return (
      <section className="page-section">
        <div className="container-custom">
          <div className="text-center py-20">
            <p className="text-muted-foreground">Loading project...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!project) {
    return (
      <section className="page-section">
        <div className="container-custom">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
            <Button asChild>
              <Link to="/projects">Back to Projects</Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="page-section relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-br from-accent/10 to-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative z-10">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Project Image - Full Image Display */}
          <motion.div
            variants={itemVariants}
            className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-muted/20 to-muted/5 shadow-2xl border border-border/50"
          >
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-auto object-contain"
              style={{
                imageRendering: 'auto'
              }}
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent pointer-events-none" />
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
              {project.featured && (
                <Badge className="gradient-bg border-0 shadow-md text-sm font-semibold px-3 py-1.5">
                  ⭐ Featured
                </Badge>
              )}
            </div>
          </motion.div>

          {/* Project Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <motion.div variants={itemVariants}>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  {project.title}
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  {project.description}
                </p>
              </motion.div>

              {/* Technologies */}
              <motion.div variants={itemVariants} className="space-y-3">
                <h2 className="text-xl font-semibold">Technologies Used</h2>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <Badge
                      key={tech}
                      variant="secondary"
                      className="px-4 py-2 text-sm"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                variants={itemVariants}
                className="bg-card rounded-2xl p-6 border border-border/50 space-y-6 sticky top-24"
              >
                {/* Action Buttons */}
                <div className="space-y-3">
                  {project.live_url && (
                    <Button
                      size="lg"
                      variant="default"
                      className="w-full"
                      asChild
                    >
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Live Site
                      </a>
                    </Button>
                  )}
                  {project.github_url && (
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full"
                      asChild
                    >
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="mr-2 h-4 w-4" />
                        View Code
                      </a>
                    </Button>
                  )}
                </div>

                {/* Project Info */}
                <div className="pt-6 border-t border-border/50 space-y-4">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(project.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  {project.updated_at && (
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Updated: {new Date(project.updated_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

