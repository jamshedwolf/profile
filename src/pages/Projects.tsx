import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ExternalLink, Github, Folder, Plus, Edit2, Trash2, Eye, EyeOff, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { STORAGE_CONFIG } from "@/config/constants";
import { containerVariants, itemVariants } from "@/config/animations";
import { mapErrorMessage } from "@/lib/errorUtils";
import { uploadToStorage, checkBucketExists } from "@/lib/storageUtils";
import { ImagePositioner } from "@/components/projects/ImagePositioner";
import type { Project } from "@/types";

export default function Projects() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [technologyInput, setTechnologyInput] = useState<string>("");
  const [technologiesList, setTechnologiesList] = useState<string[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    image_position: "50% 50%",
    technologies: "",
    live_url: "",
    github_url: "",
    featured: false,
    published: false,
  });

  useEffect(() => {
    fetchProjects();
  }, [user]);

  // Initialize technologies list when editing
  useEffect(() => {
    if (editingProject) {
      setTechnologiesList(editingProject.technologies || []);
    } else {
      setTechnologiesList([]);
      setTechnologyInput("");
    }
  }, [editingProject]);

  // Check if storage bucket exists on mount
  useEffect(() => {
    const checkBucket = async () => {
      if (user) {
        const exists = await checkBucketExists(STORAGE_CONFIG.BUCKET_NAME);
        if (!exists) {
          toast({
            title: "Storage Bucket Missing",
            description: `The storage bucket "${STORAGE_CONFIG.BUCKET_NAME}" is not set up. Please create it in Supabase Dashboard → Storage before uploading images.`,
            variant: "destructive",
            duration: 10000, // Show for 10 seconds
          });
        }
      }
    };
    checkBucket();
  }, [user, toast]);

  const handleImageUpload = async (file: File): Promise<string> => {
    if (!user) throw new Error("User must be logged in");

    setUploadingImage(true);

    try {
      // Use the storage utility function which handles errors properly
      const publicUrl = await uploadToStorage(file, user.id);
      return publicUrl;
    } catch (error: any) {
      // Re-throw the error (it's already been formatted by handleStorageError)
      throw error;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPG, PNG, GIF, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size
    if (file.size > STORAGE_CONFIG.MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: `Image must be less than ${STORAGE_CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB`,
        variant: "destructive",
      });
      return;
    }

    setImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Clear URL input when file is selected
    setFormData({ ...formData, image: "" });
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const fetchProjects = async () => {
    try {
      // Using type assertion since the projects table was just created
      const { data, error } = await supabase
        .from("projects" as any)
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        // Check if table doesn't exist
        if (error.code === "PGRST205" || error.message?.includes("Could not find the table")) {
          toast({
            title: "Database Setup Required",
            description: "The projects table doesn't exist. Please run the database migration. Check SETUP_DATABASE.md for instructions.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
        return;
      }
      setProjects((data as unknown as Project[]) || []);
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: mapErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is logged in
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create projects.",
        variant: "destructive",
      });
      return;
    }

    setFormLoading(true);

    try {
      const technologiesArray = technologiesList;
      
      // Validate technologies
      if (technologiesArray.length === 0) {
        toast({
          title: "Validation Error",
          description: "Please add at least one technology.",
          variant: "destructive",
        });
        setFormLoading(false);
        return;
      }

      // Validate required fields
      if (!formData.title || !formData.description) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields (Title, Description).",
          variant: "destructive",
        });
        setFormLoading(false);
        return;
      }

      // Handle image: upload file if selected, otherwise use URL
      let imageUrl = formData.image;
      if (imageFile) {
        try {
          imageUrl = await handleImageUpload(imageFile);
        } catch (error: any) {
          const errorMessage = error?.message || "Failed to upload image. Please try again or use an image URL.";
          // Replace newlines with spaces for toast display, or split into multiple toasts
          const displayMessage = errorMessage.replace(/\n/g, ' ').trim();
          
          toast({
            title: "Image upload failed",
            description: displayMessage,
            variant: "destructive",
            duration: 10000, // Show longer for important errors
          });
          setFormLoading(false);
          return;
        }
      }

      if (!imageUrl) {
        toast({
          title: "Image required",
          description: "Please provide an image URL or upload an image file.",
          variant: "destructive",
        });
        setFormLoading(false);
        return;
      }

      const projectData = {
        title: formData.title,
        description: formData.description,
        image: imageUrl,
        image_position: formData.image_position,
        technologies: technologiesArray,
        live_url: formData.live_url || null,
        github_url: formData.github_url || null,
        featured: formData.featured,
        published: formData.published,
        user_id: user.id,
      };

      if (editingProject) {
        const { error } = await supabase
          .from("projects" as any)
          .update(projectData as any)
          .eq("id", editingProject.id);

        if (error) {
          throw error;
        }
        toast({
          title: "Success",
          description: "Project updated successfully!",
        });
      } else {
        const { error } = await supabase.from("projects" as any).insert([projectData as any]).select();

        if (error) {
          throw error;
        }
        toast({
          title: "Success",
          description: "Project created successfully!",
        });
      }

      setIsDialogOpen(false);
      resetForm();
      removeImage();
      fetchProjects();
    } catch (error: unknown) {
      toast({
        title: "Error Creating Project",
        description: mapErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const { error } = await supabase.from("projects" as any).delete().eq("id", id);

      if (error) throw error;
      toast({
        title: "Success",
        description: "Project deleted successfully!",
      });
      fetchProjects();
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: mapErrorMessage(error),
        variant: "destructive",
      });
    }
  };

  const handleTogglePublish = async (project: Project) => {
    try {
      const { error } = await supabase
        .from("projects" as any)
        .update({ published: !project.published } as any)
        .eq("id", project.id);

      if (error) throw error;
      toast({
        title: "Success",
        description: project.published
          ? "Project unpublished"
          : "Project published!",
      });
      fetchProjects();
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: mapErrorMessage(error),
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      image: "",
      image_position: "50% 50%",
      technologies: "",
      live_url: "",
      github_url: "",
      featured: false,
      published: false,
    });
    setEditingProject(null);
    setImageFile(null);
    setImagePreview("");
    setTechnologiesList([]);
    setTechnologyInput("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openEditDialog = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      image: project.image,
      image_position: project.image_position || "50% 50%",
      technologies: project.technologies.join(", "),
      live_url: project.live_url || "",
      github_url: project.github_url || "",
      featured: project.featured,
      published: project.published || false,
    });
    setTechnologiesList(project.technologies || []);
    setTechnologyInput("");
    setImageFile(null);
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  // Filter projects: show published for public, own projects + published for authenticated users
  const displayedProjects = user
    ? projects.filter((p) => p.published || p.user_id === user.id)
    : projects.filter((p) => p.published);

  if (loading) {
    return (
      <section className="page-section">
        <div className="container-custom">
          <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="page-section">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1"></div>
            <h1 className="section-title flex-1">
              My <span className="gradient-text">Projects</span>
            </h1>
            <div className="flex-1 flex justify-end">
              {user && (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="hero" onClick={openCreateDialog}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Project
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {editingProject ? "Edit Project" : "Create New Project"}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                          }
                          required
                          disabled={formLoading}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              description: e.target.value,
                            })
                          }
                          required
                          disabled={formLoading}
                          rows={4}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="image">Project Image *</Label>
                        <div className="space-y-3">
                          {/* File Upload Option */}
                          <div className="flex items-center gap-2">
                            <Input
                              ref={fileInputRef}
                              id="image-upload"
                              type="file"
                              accept="image/*"
                              onChange={handleFileSelect}
                              disabled={formLoading || uploadingImage}
                              className="hidden"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => fileInputRef.current?.click()}
                              disabled={formLoading || uploadingImage}
                              className="w-full"
                            >
                              {uploadingImage ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Uploading...
                                </>
                              ) : (
                                <>
                                  <Upload className="mr-2 h-4 w-4" />
                                  Upload Image from PC
                                </>
                              )}
                            </Button>
                          </div>

                          {/* Divider */}
                          <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                              <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                              <span className="bg-background px-2 text-muted-foreground">Or</span>
                            </div>
                          </div>

                          {/* URL Input Option */}
                          <Input
                            id="image"
                            type="url"
                            value={formData.image}
                            onChange={(e) => {
                              setFormData({ ...formData, image: e.target.value });
                              if (e.target.value) {
                                setImageFile(null);
                                setImagePreview("");
                                if (fileInputRef.current) {
                                  fileInputRef.current.value = "";
                                }
                              }
                            }}
                            disabled={formLoading || uploadingImage || !!imageFile}
                            placeholder="https://example.com/image.jpg"
                          />

                          {/* Image Preview */}
                          {(imagePreview || (formData.image && !imageFile)) && (
                            <div className="relative mt-2">
                              <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border">
                                <img
                                  src={imagePreview || formData.image}
                                  alt="Preview"
                                  className="w-full h-full object-cover"
                                />
                                {imageFile && (
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2"
                                    onClick={removeImage}
                                    disabled={formLoading || uploadingImage}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                              {imageFile && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  Selected: {imageFile.name} ({(imageFile.size / 1024 / 1024).toFixed(2)} MB)
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Upload an image file or provide an image URL. Max file size: 5MB
                        </p>
                      </div>

                      {/* Image Position Selector */}
                      {(imagePreview || formData.image) && (
                        <div className="space-y-2">
                          <ImagePositioner
                            imageUrl={imagePreview || formData.image}
                            initialPosition={formData.image_position}
                            onPositionChange={(pos) => setFormData({ ...formData, image_position: pos })}
                            disabled={formLoading || uploadingImage}
                          />
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="technologies">
                          Technologies *
                        </Label>
                        
                        {/* Technologies Tags Display */}
                        {technologiesList.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-2 p-3 rounded-lg border border-border/50 bg-secondary/30 min-h-[60px]">
                            {technologiesList.map((tech, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="px-3 py-1.5 text-sm flex items-center gap-2"
                              >
                                {tech}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setTechnologiesList(technologiesList.filter((_, i) => i !== index));
                                  }}
                                  className="ml-1 hover:text-destructive transition-colors rounded-full hover:bg-destructive/10 p-0.5"
                                  disabled={formLoading}
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}
                        
                        {/* Add Technology Input */}
                        <div className="flex gap-2">
                          <Input
                            id="technologies"
                            value={technologyInput}
                            onChange={(e) => setTechnologyInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && technologyInput.trim()) {
                                e.preventDefault();
                                const trimmedTech = technologyInput.trim();
                                if (!technologiesList.includes(trimmedTech)) {
                                  setTechnologiesList([...technologiesList, trimmedTech]);
                                  setTechnologyInput("");
                                } else {
                                  toast({
                                    title: "Duplicate Technology",
                                    description: "This technology is already added.",
                                    variant: "destructive",
                                  });
                                }
                              }
                            }}
                            placeholder="Type technology and press Enter"
                            disabled={formLoading}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              const trimmedTech = technologyInput.trim();
                              if (trimmedTech && !technologiesList.includes(trimmedTech)) {
                                setTechnologiesList([...technologiesList, trimmedTech]);
                                setTechnologyInput("");
                              } else if (technologiesList.includes(trimmedTech)) {
                                toast({
                                  title: "Duplicate Technology",
                                  description: "This technology is already added.",
                                  variant: "destructive",
                                });
                              }
                            }}
                            disabled={formLoading || !technologyInput.trim()}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Add technologies one by one. Press Enter or click + to add.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="live_url">Live URL</Label>
                          <Input
                            id="live_url"
                            type="url"
                            value={formData.live_url}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                live_url: e.target.value,
                              })
                            }
                            disabled={formLoading}
                            placeholder="https://example.com"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="github_url">GitHub URL</Label>
                          <Input
                            id="github_url"
                            type="url"
                            value={formData.github_url}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                github_url: e.target.value,
                              })
                            }
                            disabled={formLoading}
                            placeholder="https://github.com/user/repo"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id="featured"
                            checked={formData.featured}
                            onCheckedChange={(checked) =>
                              setFormData({
                                ...formData,
                                featured: checked as boolean,
                              })
                            }
                            disabled={formLoading}
                          />
                          <Label htmlFor="featured" className="cursor-pointer">Featured</Label>
                        </div>

                        <div className="flex items-center gap-2">
                          <Checkbox
                            id="published"
                            checked={formData.published}
                            onCheckedChange={(checked) =>
                              setFormData({
                                ...formData,
                                published: checked as boolean,
                              })
                            }
                            disabled={formLoading}
                          />
                          <Label htmlFor="published" className="cursor-pointer">Published</Label>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsDialogOpen(false);
                            resetForm();
                          }}
                          disabled={formLoading}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" variant="hero" disabled={formLoading}>
                          {formLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : editingProject ? (
                            "Update Project"
                          ) : (
                            "Create Project"
                          )}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
          <p className="section-subtitle max-w-2xl mx-auto">
            A showcase of my recent work. Each project represents a unique
            challenge and learning experience.
          </p>
        </motion.div>

        {displayedProjects.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              {user
                ? "No projects yet. Create your first project!"
                : "No published projects yet."}
            </p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {displayedProjects.map((project) => (
              <motion.article
                key={project.id}
                variants={itemVariants}
                whileHover={{ y: -12 }}
                className="group relative bg-background rounded-2xl overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 cursor-pointer"
              >
                <Link to={`/projects/${project.id}`} className="block">
                  {/* Image Container */}
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
                  
                  {/* Admin Actions - Top Right - Only for project owner */}
                  {user && project.user_id === user.id && (
                    <div 
                      className="absolute top-3 right-3 z-30 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      onClick={(e) => e.preventDefault()}
                    >
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8 rounded-lg shadow-lg bg-background/95 backdrop-blur-sm hover:bg-primary/10 border-0"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleTogglePublish(project);
                        }}
                        title={project.published ? "Unpublish" : "Publish"}
                      >
                        {project.published ? (
                          <Eye className="h-3.5 w-3.5" />
                        ) : (
                          <EyeOff className="h-3.5 w-3.5" />
                        )}
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8 rounded-lg shadow-lg bg-background/95 backdrop-blur-sm hover:bg-primary/10 border-0"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          openEditDialog(project);
                        }}
                        title="Edit"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        className="h-8 w-8 rounded-lg shadow-lg bg-background/95 backdrop-blur-sm border-0"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleDelete(project.id);
                        }}
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}

                  {/* Badges - Top Left */}
                  <div 
                    className="absolute top-3 left-3 z-20 flex flex-col gap-2 pointer-events-none"
                  >
                    {project.featured && (
                      <Badge className="gradient-bg border-0 shadow-md text-xs font-semibold px-2.5 py-1">
                        ⭐ Featured
                      </Badge>
                    )}
                    {user && !project.published && (
                      <Badge className="bg-yellow-500/90 text-yellow-50 border-0 shadow-md text-xs font-semibold px-2.5 py-1">
                        Draft
                      </Badge>
                    )}
                  </div>

                  {/* Action Buttons Overlay */}
                  {(project.live_url || project.github_url) && (
                    <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 z-20">
                      {project.live_url && (
                        <Button
                          size="default"
                          variant="default"
                          className="rounded-lg shadow-xl bg-primary text-primary-foreground hover:bg-primary/90"
                          asChild
                        >
                          <a
                            href={project.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="View live site"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Live
                          </a>
                        </Button>
                      )}
                      {project.github_url && (
                        <Button
                          size="default"
                          variant="secondary"
                          className="rounded-lg shadow-xl bg-background/95 backdrop-blur-sm"
                          asChild
                        >
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="View source code"
                          >
                            <Github className="h-4 w-4 mr-2" />
                            Code
                          </a>
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                  {/* Content Section */}
                  <div className="p-6 space-y-4">
                    {/* Title and Description */}
                    <div>
                      <h3 className="font-bold text-xl text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-1">
                        {project.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                        {project.description}
                      </p>
                    </div>

                    {/* Technologies */}
                    {project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2 border-t border-border/50">
                        {project.technologies.slice(0, 5).map((tech) => (
                          <Badge
                            key={tech}
                            variant="outline"
                            className="text-xs font-normal px-2.5 py-0.5 hover:bg-primary/10 hover:border-primary/50 hover:text-primary transition-colors"
                          >
                            {tech}
                          </Badge>
                        ))}
                        {project.technologies.length > 5 && (
                          <Badge
                            variant="outline"
                            className="text-xs font-normal px-2.5 py-0.5 text-muted-foreground"
                          >
                            +{project.technologies.length - 5}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </Link>
              </motion.article>
            ))}
          </motion.div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-muted-foreground mb-4">
            Interested in seeing more of my work?
          </p>
          <Button variant="outline" size="lg" asChild>
            <a
              href="https://github.com/kashif-hussain6"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="mr-2 h-4 w-4" />
              View GitHub Profile
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
