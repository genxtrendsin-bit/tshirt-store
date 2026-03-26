import Particles from "react-tsparticles";

export default function ParticleBackground() {
  return (
    <Particles
      options={{
        fullScreen: {
          enable: true,
          zIndex: -1
        },
        particles: {
          number: { value: 60 },
          size: { value: 2 },
          move: { speed: 0.6 },
          opacity: { value: 0.4 },
          links: {
            enable: true,
            distance: 120,
            opacity: 0.3
          }
        }
      }}
    />
  );
}