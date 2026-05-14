import { useEffect, useRef } from 'react';

/**
 * Gouttes de peinture dorées flottant lentement sur toute la plateforme.
 * Inspiré du `.ambient-particles` de l'index.html (drift 18s up).
 */
export function PaintDrops({ count = 18 }) {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    root.innerHTML = '';

    for (let i = 0; i < count; i += 1) {
      const dot = document.createElement('span');
      const left = Math.random() * 100;
      const startTop = 90 + Math.random() * 20;
      const duration = 18 + Math.random() * 14;
      const delay = -Math.random() * duration;
      const size = 2 + Math.random() * 3;
      const driftX = (Math.random() - 0.5) * 80;
      const driftY = -180 - Math.random() * 200;

      dot.style.left = `${left}%`;
      dot.style.top = `${startTop}%`;
      dot.style.width = `${size}px`;
      dot.style.height = `${size}px`;
      dot.style.setProperty('--drift-x', `${driftX}px`);
      dot.style.setProperty('--drift-y', `${driftY}px`);
      dot.style.animationDuration = `${duration}s`;
      dot.style.animationDelay = `${delay}s`;
      root.appendChild(dot);
    }
  }, [count]);

  return <div ref={ref} className="paint-drops" aria-hidden="true" />;
}
