import { useEffect, useRef, useState } from 'react';

/**
 * Vidéo décorative qui ne coûte rien tant qu'elle n'approche pas du viewport :
 *  - `src` n'est posé qu'à ~300px de l'écran (le fichier n'est pas téléchargé avant) ;
 *  - lecture au moment où elle devient visible, pause dès qu'elle sort ;
 *  - si `prefers-reduced-motion`, on n'affiche que le poster (aucun téléchargement).
 *
 * Usage : <LazyVideo src="/V3.mp4" poster="/posters/v3.jpg" className="…" />
 */
export function LazyVideo({ src, poster, className = '', ...rest }) {
  const ref = useRef(null);
  const [loadedSrc, setLoadedSrc] = useState(null);
  const reduce = typeof window !== 'undefined'
    && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (reduce || !ref.current) return undefined;

    const el = ref.current;
    const loader = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setLoadedSrc(src);
          loader.disconnect();
        }
      },
      { rootMargin: '300px 0px' },
    );
    loader.observe(el);
    return () => loader.disconnect();
  }, [src, reduce]);

  useEffect(() => {
    if (!loadedSrc || !ref.current) return undefined;

    const el = ref.current;
    const player = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) el.play().catch(() => {});
          else el.pause();
        });
      },
      { threshold: 0.15 },
    );
    player.observe(el);
    return () => player.disconnect();
  }, [loadedSrc]);

  return (
    <video
      ref={ref}
      src={loadedSrc || undefined}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      className={className}
      {...rest}
    />
  );
}
