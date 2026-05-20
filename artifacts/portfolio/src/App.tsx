import { useState } from "react";
import { Preloader } from "./components/Preloader/Preloader";
import { HeroScrollReveal } from "./components/Hero/HeroScrollReveal";
import { SelectedWork } from "./components/Work/SelectedWork";
import { RioEditorial } from "./components/Editorial/RioEditorial";
import { ExperienceHover } from "./components/Experience/ExperienceHover";
import { AboutSection } from "./components/About/AboutSection";
import { TimelineSection } from "./components/About/TimelineSection";
import { Footer } from "./components/Footer/Footer";
import { useLenis } from "./hooks/useLenis";
import heroRio from "@assets/rio-paisagem_1779253459430.png";

export default function App() {
  const [loaderDone, setLoaderDone] = useState(false);
  const [introDone, setIntroDone] = useState(false);

  useLenis(introDone);

  return (
    <>
      {!loaderDone && <Preloader onDone={() => setLoaderDone(true)} />}

      {loaderDone && (
        <main>
          <HeroScrollReveal
            heroImage={heroRio}
            introActive={true}
            onIntroComplete={() => setIntroDone(true)}
          />

          <SelectedWork />
          <ExperienceHover />
          <AboutSection />
          <TimelineSection />
          <RioEditorial />
          <Footer />
        </main>
      )}
    </>
  );
}
