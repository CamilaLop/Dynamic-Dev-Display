import { useState } from "react";
import { Preloader } from "./components/Preloader/Preloader";
import { HeroScrollReveal } from "./components/Hero/HeroScrollReveal";
import { SelectedWork } from "./components/Work/SelectedWork";
import { RioEditorial } from "./components/Editorial/RioEditorial";
import { ExperienceHover } from "./components/Experience/ExperienceHover";
import { AboutSection } from "./components/About/AboutSection";
import { TimelineSection } from "./components/About/TimelineSection";
import { Footer } from "./components/Footer/Footer";
import { MarqueeBand } from "./components/Marquee/MarqueeBand";
import { ScrollProgress } from "./components/Nav/ScrollProgress";
import { CustomCursor } from "./components/Cursor/CustomCursor";
import { useLenis } from "./hooks/useLenis";
import { useThemeTransition } from "./hooks/useThemeTransition";
import heroRio from "@assets/rio-paisagem_1779253459430.png";

export default function App() {
  const [loaderDone, setLoaderDone] = useState(false);
  const [introDone, setIntroDone] = useState(false);

  useLenis(introDone);
  useThemeTransition(introDone);

  return (
    <>
      <CustomCursor />
      {introDone && <ScrollProgress />}

      {!loaderDone && <Preloader onDone={() => setLoaderDone(true)} />}

      {loaderDone && (
        <main>
          <HeroScrollReveal
            heroImage={heroRio}
            introActive={true}
            onIntroComplete={() => setIntroDone(true)}
          />

          <SelectedWork />
          <MarqueeBand theme="dark" speed={32} />
          <ExperienceHover />
          <AboutSection />
          <MarqueeBand theme="dark" speed={26} />
          <TimelineSection />
          <RioEditorial />
          <Footer />
        </main>
      )}
    </>
  );
}
