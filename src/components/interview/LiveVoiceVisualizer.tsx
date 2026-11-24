import React, { useRef, useEffect } from 'react';

export interface LiveVoiceVisualizerProps {
  analyser: AnalyserNode | null;
  isAiSpeaking?: boolean;
  isUserRecording?: boolean;
  isMuted?: boolean;
  barCount?: number;
  barWidth?: number;
  barGap?: number;
  maxHeight?: number;
  className?: string;
}

/**
 * High-performance 60 FPS Canvas Voice Visualizer
 * Replaces slow 1-second interval animation with instant, real-time frequency-reactive bars.
 * Features ultra-sleek narrow bars, tight spacing, and organic vocal waveforms.
 */
export const LiveVoiceVisualizer: React.FC<LiveVoiceVisualizerProps> = ({
  analyser,
  isAiSpeaking = false,
  isUserRecording = false,
  isMuted = false,
  barCount = 36,
  barWidth = 2.5,
  barGap = 2,
  maxHeight = 28,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const smoothedHeightsRef = useRef<number[]>(new Array(barCount).fill(3.5));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;
    const bufferLength = analyser ? analyser.frequencyBinCount : 32;
    const freqData = new Uint8Array(bufferLength);

    const render = (time: number) => {
      if (!isRunning) return;

      const dpr = window.devicePixelRatio || 1;
      const width = (barWidth + barGap) * barCount;
      const height = maxHeight + 4;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const isUserActive = isUserRecording && !isMuted && analyser !== null;
      let hasUserAudio = false;

      if (isUserActive && analyser) {
        analyser.getByteFrequencyData(freqData);
        // Check if there is actual vocal input
        let sum = 0;
        for (let j = 0; j < freqData.length; j++) {
          sum += freqData[j];
        }
        hasUserAudio = (sum / freqData.length) > 6;
      }

      const centerY = height / 2;

      for (let i = 0; i < barCount; i++) {
        let targetHeight = 3.5;
        let barColor = 'rgba(58, 35, 24, 0.22)';

        if (isAiSpeaking) {
          // Dynamic organic speech wave at 60fps (time in ms)
          const wave1 = Math.sin((time * 0.007) + (i * 0.38));
          const wave2 = Math.cos((time * 0.005) + (i * 0.22));
          const combined = (wave1 * 0.5 + 0.5) * (wave2 * 0.5 + 0.5);
          targetHeight = 4 + (combined * (maxHeight - 6));
          barColor = '#b4532a';
        } else if (isUserActive) {
          if (hasUserAudio) {
            // Map bar index to frequency bins with slight bell curve weighting for vocals
            const binIndex = Math.min(
              freqData.length - 1,
              Math.floor((i / barCount) * (freqData.length * 0.85))
            );
            const freqVal = freqData[binIndex] || 0; // 0 to 255
            const normalized = freqVal / 255;
            // Vocal frequency curve
            const curve = 1 - Math.abs(i - barCount / 2) / (barCount / 1.7);
            targetHeight = 4 + Math.max(0, normalized * (maxHeight - 5) * Math.max(0.4, curve));
            barColor = '#b4532a'; // Warm terracotta active speaking
          } else {
            // Subtle ambient breathing when recording but silent
            const breath = Math.sin((time * 0.003) + (i * 0.25)) * 0.5 + 0.5;
            targetHeight = 3.5 + breath * 3;
            barColor = 'rgba(180, 83, 42, 0.45)';
          }
        } else {
          // Idle gentle baseline
          const breath = Math.sin((time * 0.002) + (i * 0.2)) * 0.5 + 0.5;
          targetHeight = 3 + breath * 2;
          barColor = 'rgba(58, 35, 24, 0.20)';
        }

        // Smooth transition (lerp) for fluid natural physics
        const prev = smoothedHeightsRef.current[i] || 3.5;
        const smoothed = prev + (targetHeight - prev) * 0.32;
        smoothedHeightsRef.current[i] = smoothed;

        const x = i * (barWidth + barGap);
        const y = centerY - (smoothed / 2);

        // Draw rounded capsule bar
        ctx.fillStyle = barColor;
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(x, y, barWidth, smoothed, barWidth / 2);
        } else {
          ctx.rect(x, y, barWidth, smoothed);
        }
        ctx.fill();
      }

      ctx.restore();
      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [analyser, isAiSpeaking, isUserRecording, isMuted, barCount, barWidth, barGap, maxHeight]);

  const totalWidth = (barWidth + barGap) * barCount;

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <canvas
        ref={canvasRef}
        style={{
          width: `${totalWidth}px`,
          height: `${maxHeight + 4}px`,
          display: 'block',
        }}
      />
    </div>
  );
};
