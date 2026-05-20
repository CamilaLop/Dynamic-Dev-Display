import { useState } from "react";
import { Preloader } from "./components/Preloader/Preloader";
import { HeroScrollReveal } from "./components/Hero/HeroScrollReveal";
import { SelectedWork } from "./components/Work/SelectedWork";
import { RioEditorial } from "./components/RioEditorial/RioEditorial";
import { ExperienceHover } from "./components/ExperienceHover/ExperienceHover";
import { AboutSection } from "./components/About/AboutSection";
import { useLenis } from "./hooks/useLenis";
import heroRio from "./assets/rio-paisagem.png";

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
          <RioEditorial />
        </main>
      )}
    </>
  );
}
