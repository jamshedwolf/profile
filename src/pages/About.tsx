import { motion } from "framer-motion";
import {
  Download,
  Users,
  Code,
  Briefcase,
  Award,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import developerAvatar from "@/assets/developer-avatar.jpg";
import {
  aboutSkills,
  education,
  experience,
  clientVideos,
} from "@/config/constants";
import { containerVariants, itemVariants } from "@/config/animations";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import { useState } from "react";

// Client Video Card Component
interface ClientVideoCardProps {
  videoUrl: string;
  clientName: string;
  clientRole: string;
  thumbnail?: string;
}

function ClientVideoCard({
  videoUrl,
  clientName,
  clientRole,
  thumbnail,
}: ClientVideoCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Extract video ID from YouTube or Vimeo URL
  const extractVideoId = (url: string): string | null => {
    if (!url) return null;

    // YouTube patterns
    const youtubeRegex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch) return youtubeMatch[1];

    // Vimeo pattern
    const vimeoRegex = /(?:vimeo\.com\/)(?:.*\/)?(\d+)/;
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch) return vimeoMatch[1];

    return null;
  };

  const getEmbedUrl = () => {
    const videoId = extractVideoId(videoUrl);
    if (!videoId) return null;

    if (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    }
    if (videoUrl.includes("vimeo.com")) {
      return `https://player.vimeo.com/video/${videoId}?autoplay=1`;
    }
    return null;
  };

  // Get YouTube thumbnail if video URL is YouTube
  const getYouTubeThumbnail = (url: string): string | null => {
    const id = extractVideoId(url);
    if (id && (url.includes("youtube.com") || url.includes("youtu.be"))) {
      return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
    }
    return null;
  };

  const youtubeThumbnail = videoUrl ? getYouTubeThumbnail(videoUrl) : null;
  const displayThumbnail = thumbnail || youtubeThumbnail;
  const isYouTube =
    videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be");
  const embedUrl = getEmbedUrl();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="relative w-full cursor-pointer group">
          {/* Large Thumbnail/Placeholder - Full Card */}
          <div className="relative aspect-[16/9] bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center overflow-hidden rounded-3xl">
            {displayThumbnail ? (
              <img
                src={displayThumbnail}
                alt="Client Testimonial"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5" />
            )}

            {/* Overlay with gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent group-hover:from-black/60 group-hover:via-black/20 transition-all duration-500" />

            {/* YouTube Icon Badge */}
            {isYouTube && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="absolute top-4 right-4 z-20"
              >
                <div className="w-16 h-16 rounded-xl bg-red-600/95 backdrop-blur-sm flex items-center justify-center shadow-2xl border-2 border-white/20 group-hover:scale-110 transition-transform">
                  <svg
                    className="w-10 h-10 text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </div>
              </motion.div>
            )}

            {/* Play Button - Large and Centered */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center z-10"
              whileHover={{ scale: 1.05 }}
            >
              <div className="relative">
                <motion.div
                  className="w-24 h-24 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-2xl border-4 border-white/30"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isYouTube ? (
                    <svg
                      className="w-14 h-14 text-red-600"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  ) : (
                    <svg
                      className="w-14 h-14 text-primary"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </motion.div>
                <motion.div
                  className="absolute inset-0 rounded-full bg-white/50"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </motion.div>

            {/* Click to play text */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-4 py-2 rounded-full bg-black/60 backdrop-blur-sm text-white text-sm font-medium"
              >
                Click to Watch
              </motion.div>
            </div>
          </div>
        </div>
      </DialogTrigger>

      {/* Video Modal */}
      <DialogContent className="max-w-5xl w-full p-0 bg-black border-none">
        <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
          {embedUrl ? (
            <iframe
              src={embedUrl}
              className="absolute top-0 left-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={`${clientName} - Testimonial`}
            />
          ) : videoUrl ? (
            <video
              src={videoUrl}
              controls
              autoPlay
              className="absolute top-0 left-0 w-full h-full"
            />
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function About() {
  const handleDownloadResume = async () => {
    try {
      // Fetch the DOCX file
      const response = await fetch("/KASHIF177.docx");
      if (!response.ok) {
        throw new Error("Failed to fetch resume");
      }
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Kashif-Hussain-Resume.docx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      // Error downloading resume - handle silently
      alert("Failed to download resume. Please try again.");
    }
  };

  return (
    <>
     

      {/* Client Introduction Video Section */}
      <section className="page-section bg-card relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-accent/10 to-primary/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6"
            >
              <Users className="h-10 w-10 text-primary" />
            </motion.div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Professor <span className="gradient-text">Recomendation</span>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground">
              Hear what my professor say about me
            </p>
          </motion.div>

          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {clientVideos.map((client, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-gradient-to-br from-card/90 via-background to-card/80 rounded-3xl overflow-hidden border-2 border-border/60 hover:border-primary/60 shadow-2xl hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] transition-all duration-500 hover:-translate-y-3"
              >
                <ClientVideoCard
                  videoUrl={client.videoUrl}
                  clientName={client.clientName}
                  clientRole={
                    client.clientRole +
                    (client.companyName ? `, ${client.companyName}` : "")
                  }
                  thumbnail={client.thumbnail}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

       {/* About Intro Section */}
      <section className="page-section relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-20 left-10 w-[500px] h-[500px] bg-gradient-to-br from-accent/10 to-primary/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4"
            >
              <Sparkles className="h-6 w-6 text-primary" />
            </motion.div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
              About <span className="gradient-text">Me</span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground">
              My introduction & journey
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-center">
            {/* Image Section - Redesigned */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="relative max-w-xs mx-auto lg:max-w-sm"
            >
              <div className="relative group">
                {/* Main Image Container */}
                <div className="relative rounded-xl overflow-hidden shadow-lg border-2 border-primary/20">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-primary/10 z-10" />
                  <img
                    src={developerAvatar}
                    alt="Kashif Hussain - Developer"
                    className="w-full h-auto object-cover relative z-0 grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent z-20" />
                </div>

                {/* Floating Cards - Smaller */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="absolute -bottom-4 -left-4 bg-card/90 backdrop-blur-xl rounded-xl p-3 shadow-lg border border-border/50 z-30"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Code className="h-4 w-4 text-primary" />
                    </div>
                    {/* <div>
                      <p className="text-lg font-bold gradient-text">50+</p>
                      <p className="text-[10px] text-muted-foreground">
                        Projects
                      </p>
                    </div> */}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="absolute -top-4 -right-4 bg-card/90 backdrop-blur-xl rounded-xl p-3 shadow-lg border border-border/50 z-30"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Award className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <p className="text-lg font-bold gradient-text">3+</p>
                      <p className="text-[10px] text-muted-foreground">Years</p>
                    </div>
                  </div>
                </motion.div>

                {/* Decorative elements - Smaller */}
                <div className="absolute -z-10 top-5 -left-5 w-20 h-20 bg-primary/10 rounded-2xl blur-xl" />
                <div className="absolute -z-10 bottom-5 -right-5 w-24 h-24 bg-accent/10 rounded-2xl blur-xl" />
              </div>
            </motion.div>

            {/* Content Section */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, type: "spring" }}
              className="space-y-6"
            >
              <div className="space-y-3">
                <p className="text-base md:text-lg text-foreground leading-relaxed">
                  I'm a motivated{" "}
                  <span className="font-semibold text-primary">
                    AI Developer & Researcher 
                  </span>
                   with a strong interest in building research-driven intelligent
                  systems. I enjoy exploring complex problems through
                  experimentation, data analysis, and thoughtful system design.
                </p>

                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  My journey into artificial intelligence began during my
                  academic studies, where I developed a deep curiosity for how
                  intelligent systems learn, adapt, and support real-world
                  decision-making. I value clean, maintainable code,
                  reproducible research practices, and continuous learning.
                </p>
              </div>

              {/* Enhanced Stats grid - Smaller */}
              

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <Button
                    variant="hero"
                    size="lg"
                   
                    className="w-full sm:w-auto"
                  >
                  <a  href="/Cv.pdf" download className="mr-2 h-4 w-">
                  Download Cv
                  </a>
                  
                    
                  </Button>
                </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      
    </>
  );
}
