import { useEffect, useRef, useState } from 'react';

/**
 * Vidéo qui balaye de gauche à droite au moment où la section entre dans le viewport.
 * Inspiré du `.section-wipe` de l'index.html.
 *
 * Utilisation : <SectionWipe video="/V1.mp4">…contenu de section…</SectionWipe>
 */
export function SectionWipe({ video, height = 'auto', children, className = '' }) {
  const hostRef = useRef(null);
  const wipeRef = useRef(null);
  const videoRef = useRef(null);
  const [active, setActive] = useState(false);
  // La vidéo n'est téléchargée qu'à l'approche de la section (perf mobile) :
  // src reste vide tant que l'observer "loader" n'a pas déclenché.
  const [videoSrc, setVideoSrc] = useState(null);

  useEffect(() => {
    if (!hostRef.current || !wipeRef.current) return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return; // Respecter les préférences accessibilité

    const host = hostRef.current;

    // 1) Précharge la vidéo un écran avant d'arriver dessus.
    const loader = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVideoSrc(video);
          loader.disconnect();
        }
      },
      { rootMargin: '100% 0px' },
    );
    loader.observe(host);

    // 2) Joue le wipe quand la section entre réellement dans le viewport.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !active) {
            setActive(true);
            videoRef.current?.play().catch(() => {});
            wipeRef.current.classList.add('is-open');

            // Refermer après 1.6s pour révéler la section
            setTimeout(() => {
              wipeRef.current?.classList.remove('is-open');
            }, 1600);
          }
        });
      },
      { threshold: 0.25, rootMargin: '0px 0px -10% 0px' },
    );
    observer.observe(host);

    return () => {
      loader.disconnect();
      observer.disconnect();
    };
  }, [active, video]);

  return (
    <div ref={hostRef} className={`section-wipe-host ${className}`} style={{ minHeight: height }}>
      {video && (
        <div ref={wipeRef} className="section-wipe" aria-hidden="true">
          <video ref={videoRef} src={videoSrc || undefined} muted playsInline preload="none" />
        </div>
      )}
      {children}
    </div>
  );
}
