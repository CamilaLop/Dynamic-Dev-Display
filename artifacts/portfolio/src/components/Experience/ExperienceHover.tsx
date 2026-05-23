import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import group78 from "@assets/Group_78_1779425127041.svg";

gsap.registerPlugin(ScrollTrigger);

type ExperienceItem = {
  id: string;
  title: string;
  side: string;
  image: string;
};

const items: ExperienceItem[] = [
  {
    id: "exp1",
    title: "Landing Pages",
    side: "Conversion Design",
    image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=2070&auto=format&fit=crop&q=80",
  },
  {
    id: "exp2",
    title: "Data Dashboards",
    side: "Product UI",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=2070&auto=format&fit=crop&q=80",
  },
  {
    id: "exp3",
    title: "Commerce Flow",
    side: "E-commerce",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=2070&auto=format&fit=crop&q=80",
  },
  {
    id: "exp4",
    title: "Brand Motion",
    side: "Identity + Web",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=2070&auto=format&fit=crop&q=80",
  },
  {
    id: "exp5",
    title: "Editorial Systems",
    side: "Motion UI",
    image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=2070&auto=format&fit=crop&q=80",
  },
];

export function ExperienceHover() {
  const sectionRef = useRef<HTMLElement>(null);
  const webglRef = useRef<HTMLDivElement>(null);
  const viewButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.set(".experience-side-svg", { autoAlpha: 0, yPercent: 6 });

      gsap.to(".experience-side-svg", {
        autoAlpha: 1,
        yPercent: 0,
        duration: 0.55,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: "center 50%",
          scrub: 1.1,
        },
      });

      gsap.to(".experience-side-svg--left", {
        yPercent: -6,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.45,
        },
      });

      gsap.to(".experience-side-svg--right", {
        yPercent: 6,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.45,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const container = webglRef.current;
    const viewButton = viewButtonRef.current;

    if (!section || !container || !viewButton) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let isVisible = true;
    let frameId = 0;

    const mouse = new THREE.Vector2();
    const previousMousePosition = new THREE.Vector2();
    const scene = new THREE.Scene();

    const fov = 45;
    const camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, 1000);
    camera.position.z = 10;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false,
      });
    } catch {
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(width < 768 ? 1 : Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(3.5, 2, 320, 120);

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uCurrentTexture: { value: null as THREE.Texture | null },
        uNextTexture: { value: null as THREE.Texture | null },
        uProgress: { value: 0.0 },
        uOffset: { value: new THREE.Vector2(0.0, 0.0) },
        uAlpha: { value: 0.0 },
        uTime: { value: 0 },
        uIntensity: { value: 0.0 },
      },
      vertexShader: `
        uniform vec2 uOffset;
        uniform float uTime;
        uniform float uIntensity;
        varying vec2 vUv;

        void main() {
          vUv = uv;
          vec3 pos = position;

          float wave = sin(uv.y * 5.0 + uTime) * uIntensity;
          float wave2 = sin(uv.x * 5.0 - uTime * 0.5) * uIntensity;

          pos.x += sin(uv.y * 2.0) * uOffset.x * (0.5 + wave);
          pos.y += sin(uv.x * 4.0) * uOffset.y * (0.5 + wave2);
          pos.z += sin(uv.x * 2.0 + uv.y * 2.0) * uIntensity * 0.1;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uCurrentTexture;
        uniform sampler2D uNextTexture;
        uniform float uProgress;
        uniform float uAlpha;
        varying vec2 vUv;

        void main() {
          vec2 uv = vUv;

          vec4 currentTex = texture2D(uCurrentTexture, uv);
          vec4 nextTex = texture2D(uNextTexture, uv);

          vec4 finalColor = mix(currentTex, nextTex, uProgress);

          gl_FragColor = vec4(finalColor.rgb, finalColor.a * uAlpha);
        }
      `,
      transparent: true,
    });

    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin("anonymous");

    const textures: Record<string, THREE.Texture> = {};
    items.forEach((item) => {
      const texture = textureLoader.load(item.image);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      textures[item.id] = texture;
    });

    const mouseToScene = (mouseX: number, mouseY: number) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const x = ((mouseX - rect.left) / rect.width) * 2 - 1;
      const y = -((mouseY - rect.top) / rect.height) * 2 + 1;

      const vector = new THREE.Vector3(x, y, 0);
      vector.unproject(camera);
      const dir = vector.sub(camera.position).normalize();
      const distance = -camera.position.z / dir.z;

      return camera.position.clone().add(dir.multiplyScalar(distance));
    };

    const showImage = (texture: THREE.Texture) => {
      if (material.uniforms.uCurrentTexture.value === null) {
        material.uniforms.uCurrentTexture.value = texture;
        material.uniforms.uNextTexture.value = texture;
      } else {
        material.uniforms.uCurrentTexture.value = material.uniforms.uNextTexture.value;
        material.uniforms.uNextTexture.value = texture;

        gsap.to(material.uniforms.uProgress, {
          value: 1,
          duration: 0.5,
          ease: "power2.inOut",
          onComplete: () => {
            material.uniforms.uProgress.value = 0;
            material.uniforms.uCurrentTexture.value = texture;
          },
        });
      }

      gsap.to(material.uniforms.uAlpha, { value: 1, duration: 0.3 });
      gsap.to(material.uniforms.uIntensity, { value: 0.5, duration: 0.3 });

      viewButton.style.opacity = "1";
      viewButton.style.transform = `translate(${mouse.x - 20}px, ${mouse.y - 20}px) scale(1)`;
    };

    const hideImage = () => {
      gsap.to(material.uniforms.uAlpha, { value: 0, duration: 0.3 });
      gsap.to(material.uniforms.uIntensity, { value: 0, duration: 0.3 });

      viewButton.style.opacity = "0";
      viewButton.style.transform = `translate(${mouse.x - 40}px, ${mouse.y - 40}px) scale(0)`;
    };

    const updateMousePosition = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      const pos = mouseToScene(e.clientX, e.clientY);

      gsap.to(plane.position, {
        x: pos.x,
        y: pos.y,
        duration: 0.3,
        ease: "power2.out",
      });

      viewButton.style.transform = `translate(${e.clientX - 40}px, ${e.clientY - 40}px) scale(${
        viewButton.style.opacity === "0" ? "0" : "1"
      })`;
      viewButton.style.left = "0";
      viewButton.style.top = "0";

      const velocity = {
        x: (e.clientX - previousMousePosition.x + 0.02) * 0.06,
        y: (e.clientY - previousMousePosition.y + 0.02) * 0.05,
      };

      gsap.to(material.uniforms.uOffset.value, {
        x: velocity.x,
        y: velocity.y,
        duration: 0.1,
      });

      previousMousePosition.x = e.clientX;
      previousMousePosition.y = e.clientY;
    };

    const itemElements = section.querySelectorAll<HTMLElement>(".experience-item");

    itemElements.forEach((item) => {
      const experienceId = item.dataset.experience;

      item.addEventListener("mouseenter", () => {
        if (experienceId && textures[experienceId]) {
          showImage(textures[experienceId]);
        }
      });

      item.addEventListener("mouseleave", hideImage);
    });

    const onResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(width < 768 ? 1 : Math.min(window.devicePixelRatio, 2));
    };

    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? false;

        if (!isVisible) {
          gsap.to(material.uniforms.uAlpha, { value: 0, duration: 0.2 });
          gsap.to(material.uniforms.uIntensity, { value: 0, duration: 0.2 });
          viewButton.style.opacity = "0";
          viewButton.style.transform = `translate(${mouse.x - 40}px, ${mouse.y - 40}px) scale(0)`;
        }
      },
      { threshold: 0.0 }
    );

    const onSectionLeave = () => hideImage();

    observer.observe(section);
    section.addEventListener("mouseleave", onSectionLeave);
    document.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("resize", onResize);

    const animate = () => {
      frameId = requestAnimationFrame(animate);

      if (!isVisible) return;

      material.uniforms.uTime.value += 0.08;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
      section.removeEventListener("mouseleave", onSectionLeave);
      document.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("resize", onResize);

      itemElements.forEach((item) => {
        item.replaceWith(item.cloneNode(true));
      });

      gsap.killTweensOf([
        material.uniforms.uAlpha,
        material.uniforms.uIntensity,
        material.uniforms.uProgress,
        material.uniforms.uOffset.value,
        plane.position,
      ]);

      Object.values(textures).forEach((texture) => texture.dispose());
      geometry.dispose();
      material.dispose();
      renderer.dispose();

      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="experience-section">

      <div className="experience-side-svg experience-side-svg--left">
        <img src={group78} alt="" aria-hidden="true" />
      </div>
      <div className="experience-side-svg experience-side-svg--right">
        <img src={group78} alt="" aria-hidden="true" />
      </div>

      <div ref={webglRef} className="hover-effect-container" />

      <div ref={viewButtonRef} id="view-button">
        <span>Learn More</span>
      </div>

      <div className="experience-container">
        <div className="experience-list">
          {items.map((item) => (
            <div key={item.id} className="experience-item" data-experience={item.id}>
              {item.title}
              <span className="rightsidetext">{item.side}</span>
            </div>
          ))}
        </div>

        <div className="experience-preview" />

        <div className="hidden-images">
          {items.map((item) => (
            <img key={item.id} src={item.image} alt={item.title} id={`${item.id}-img`} />
          ))}
        </div>
      </div>
    </section>
  );
}
