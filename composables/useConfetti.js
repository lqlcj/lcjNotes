/**
 * 五彩纸屑特效 Composable
 * 基于 canvas-confetti 库封装，提供多种预设效果
 */
import confetti from "canvas-confetti";

export function useConfetti() {
  const victory = (options = {}) => {
    const count = 200;
    const defaults = {
      particleCount: count,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ["#ffd700", "#ff6b6b", "#4ecdc4", "#45b7d1", "#f9ca24"],
    };
    confetti({ ...defaults, ...options });
    confetti({ ...defaults, angle: 120, ...options });
  };

  const birthday = (options = {}) => {
    const defaults = {
      particleCount: 150,
      spread: 60,
      origin: { y: 0.5 },
      shapes: ["star", "circle"],
      colors: [
        "#ff6b6b",
        "#4ecdc4",
        "#45b7d1",
        "#f9ca24",
        "#6c5ce7",
        "#a29bfe",
        "#fd79a8",
      ],
    };
    confetti({ ...defaults, ...options });
  };

  const festive = (duration = 3000, options = {}) => {
    const end = Date.now() + duration;
    const defaults = {
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ["#ff0000", "#00ff00", "#0000ff", "#ffff00"],
    };

    const interval = setInterval(() => {
      if (Date.now() > end) {
        clearInterval(interval);
        return;
      }
      confetti({ ...defaults, ...options });
    }, 200);
  };

  const fromPosition = (origin, options = {}) => {
    const defaults = {
      particleCount: 100,
      spread: 70,
      origin,
      colors: ["#ff6b6b", "#4ecdc4", "#45b7d1", "#f9ca24"],
    };
    confetti({ ...defaults, ...options });
  };

  const custom = (options = {}) => {
    confetti(options);
  };

  const reset = () => {
    if (process.dev) {
      console.log("Confetti effects will automatically clean up");
    }
  };

  return {
    victory,
    birthday,
    festive,
    fromPosition,
    custom,
    reset,
  };
}

























