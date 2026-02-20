import ProfileSection from "@/components/ProfileSection";
import SocialLinks from "@/components/SocialLinks";
import ExperienceSection from "@/components/ExperienceSection";
import EducationSection from "@/components/EducationSection";
import AboutMe from "@/components/AboutMe";
import Divider from "@/components/Divider";
import ProjectsSection from "@/components/ProjectSection";
import Blogs from "@/components/BlogSection";
import ReachOut from "@/components/ReachOut";


export default function Home() {
  return (
    <main className="px-6 md:px-8 max-w-3xl mx-auto pt-20 pb-20 scroll-smooth">
      <ProfileSection />
      <SocialLinks />
      <AboutMe />
      <Divider />
      <ExperienceSection />
      <Divider />
      <EducationSection />
      <Divider />
      <ProjectsSection />
      <Divider />
      <Blogs />
      <ReachOut />
    </main>
  );
}
