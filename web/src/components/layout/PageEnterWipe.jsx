import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Wipe vidéo plein écran déclenché à chaque changement de route.
 * L'intro 3D du logo LARTISKA traverse de gauche à droite, puis se referme
 * pour révéler la nouvelle page — comme une transition cinéma.
 *
 * Respecte prefers-reduced-motion.
 */
export function PageEnterWipe() {
  const { pathname } = useLocation();
  const wipeRef = useRef(null);
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const wipe = wipeRef.current;
    if (!wipe) return;

    // Reset puis ouvre
    wipe.classList.remove('is-open', 'is-closing');
    void wipe.offsetWidth; // force reflow pour relancer la transition
    setPlaying(true);
    videoRef.current?.play().catch(() => {});
    wipe.classList.add('is-open');

    // Refermer après 1.8s (révèle la page)
    const t1 = setTimeout(() => {
      wipe.classList.remove('is-open');
      wipe.classList.add('is-closing');
    }, 1800);

    // Nettoyer la state après la transition de fermeture
    const t2 = setTimeout(() => {
      setPlaying(false);
      videoRef.current?.pause();
    }, 3000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [pathname]);

  return (
    <div
      ref={wipeRef}
      className="page-enter-wipe"
      aria-hidden="true"
      style={{ pointerEvents: playing ? 'auto' : 'none' }}
    >
      <video
        ref={videoRef}
        src="/lartiska-intro.mp4"
        muted
        playsInline
        preload="auto"
      />
    </div>
  );
}
