import { motion } from "framer-motion";

// Internship images (reuse in all sections)
import intern1 from "@/assets/experience/intern1.jpg";
import intern2 from "@/assets/experience/intern2.jpg";
import intern3 from "@/assets/experience/intern3.jpg";
import intern4 from "@/assets/experience/intern4.jpg";

export default function Contact() {
  // Learning points
  const researchLearningPoints = [
    "Gained skills in structuring research papers and academic writing.",
    "Learned how to perform literature reviews effectively.",
    "Developed attention to detail and critical thinking skills.",
  ];

  const internshipLearningPoints = [
    "Completed a 6-month internship at Lincoln Corners, attending 20+ workshops and events focused on communication, research, and leadership.",
    "Collaborated with 10+ team members on 8+ presentations and projects, strengthening teamwork and problem-solving skills.",
    "Supported AI research activities through data collection, documentation, and structured analysis during my bachelor’s studies.",
  ];

  const aiLearningPoints = [
    "Learned Machine Learning, Deep Learning, and AI fundamentals.",
    "Practiced building AI models and running hands-on exercises.",
    "Enhanced problem-solving and analytical thinking in AI projects.",
  ];

  // Images for each section
  const researchImages = [
    { src: intern1, span: "col-span-1 row-span-1" } // Only one image
  ];

  const internshipImages = [
    { src: intern1, span: "col-span-2 row-span-1" },
    { src: intern2, span: "col-span-2 row-span-1" },
    { src: intern3, span: "col-span-2 row-span-1" },
    { src: intern4, span: "col-span-2 row-span-1" },
 
  ];

  const aiLearningImages = [
    { src: intern1, span: "col-span-2 row-span-1" },
    { src: intern2, span: "col-span-2 row-span-1" },
    { src: intern3, span: "col-span-2 row-span-1" },
    { src: intern4, span: "col-span-2 row-span-1" },
  ];

  // Render simple grid (Research)
  const renderSimpleGrid = (images: { src: string; span: string }[]) => (
    <div className="grid grid-cols-1 gap-6">
      {images.map((img, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05, rotate: 1 }}
          transition={{ duration: 0.3 }}
          className={`overflow-hidden rounded-xl shadow-lg ${img.span}`}
        >
          <img src={img.src} alt="Research work" className="w-full h-full object-cover" />
        </motion.div>
      ))}
    </div>
  );

  // Render complex grid (Internship & AI)
  const renderComplexGrid = (images: { src: string; span: string }[]) => (
    <div className="grid grid-cols-4 grid-rows-2 gap-4 auto-rows-fr">
      {images.map((img, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05, rotate: 1 }}
          transition={{ duration: 0.3, delay: idx * 0.05 }}
          className={`overflow-hidden rounded-xl shadow-lg ${img.span}`}
        >
          <img src={img.src} alt="Experience" className="w-full h-full object-cover" />
        </motion.div>
      ))}
    </div>
  );

  // Render learning points
  const renderLearningPoints = (points: string[]) => (
    <ul className="mt-6 list-disc list-inside text-muted-foreground space-y-2">
      {points.map((point, idx) => (
        <li key={idx} className="text-lg">{point}</li>
      ))}
    </ul>
  );

  return (
    <section className="page-section relative overflow-hidden py-20">
      <div className="container-custom relative z-10 space-y-16">

        {/* Scientific Research Writing */}
        <div>
          <h2 className="section-title mb-6">
            Scientific Research <span className="gradient-text-accent">Writing</span>
          </h2>
          <p className="text-muted-foreground mb-6">
            I completed a course on scientific research writing, gaining skills in structuring
            research papers, literature review, and academic writing.
          </p>
          {renderSimpleGrid(researchImages)}
          {renderLearningPoints(researchLearningPoints)}
        </div>

        {/* Lincoln Corners Internship */}
        <div>
          <h2 className="section-title mb-6">
            Lincoln Corners <span className="gradient-text-accent">Internship</span>
          </h2>
          <p className="text-muted-foreground mb-6">
            Intern | Lincoln Corner Gilgit | American Spaces | US Embassy Project | March 2022 – April 2024
          </p>
          {renderComplexGrid(internshipImages)}
          {renderLearningPoints(internshipLearningPoints)}
        </div>

        {/* Campus X AI Learning */}
        <div>
          <h2 className="section-title mb-6">
            Campus X <span className="gradient-text-accent">AI Learning</span>
          </h2>
          <p className="text-muted-foreground mb-6">
            Learned AI concepts, Machine Learning, Deep Learning, and Mathematics used in AI
            through Campus X courses and hands-on exercises.
          </p>
          {renderComplexGrid(aiLearningImages)}
          {renderLearningPoints(aiLearningPoints)}
        </div>

      </div>
    </section>
  );
}
