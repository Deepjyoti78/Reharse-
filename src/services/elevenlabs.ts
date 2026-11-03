/**
 * ElevenLabs Voice Service for Rehearse AI Interviewer
 * Provides ultra-realistic, low-latency text-to-speech with caching and fallback.
 */

// In-memory cache for audio object URLs to prevent redundant network calls and save credits
const audioCache = new Map<string, string>();

let activeAudio: HTMLAudioElement | null = null;
let activeAbortController: AbortController | null = null;

export interface ElevenLabsSpeechOptions {
  text: string;
  voiceId?: string;
  speakingRate?: number; // 0.8 to 1.2
  voiceGender?: 'male' | 'female';
  onStart?: () => void;
  onEnded?: () => void;
  onError?: (error: unknown) => void;
}

// Fallback voice IDs if none specified
export const DEFAULT_VOICES = {
  male: 'JBFqnCBsd6RMkjVDRZzb',   // George (warm, conversational)
  female: 'Xb7hH8MSUJpSbSDYk0k2', // Alice (articulate, professional)
};

/**
 * Returns whether an ElevenLabs API key is configured
 */
export function isElevenLabsConfigured(): boolean {
  const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
  return Boolean(apiKey && apiKey.trim().length > 0);
}

/**
 * Stops any currently playing ElevenLabs audio or browser speech
 */
export function stopElevenLabsSpeech(): void {
  if (activeAbortController) {
    activeAbortController.abort();
    activeAbortController = null;
  }

  if (activeAudio) {
    activeAudio.pause();
    activeAudio.currentTime = 0;
    activeAudio.removeAttribute('src');
    activeAudio.load();
    activeAudio = null;
  }

  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Browser SpeechSynthesis fallback in case of network or API failure
 */
export function playBrowserFallbackSpeech({
  text,
  speakingRate = 1.0,
  voiceGender = 'female',
  onStart,
  onEnded,
  onError,
}: ElevenLabsSpeechOptions): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    onEnded?.();
    return;
  }

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speakingRate;
    utterance.pitch = voiceGender === 'female' ? 1.15 : 0.95;

    utterance.onstart = () => onStart?.();
    utterance.onend = () => onEnded?.();
    utterance.onerror = (e) => {
      console.warn('Browser SpeechSynthesis error:', e);
      onError?.(e);
      onEnded?.();
    };

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.error('SpeechSynthesis failed:', err);
    onError?.(err);
    onEnded?.();
  }
}

/**
 * Synthesizes and plays text via ElevenLabs Text-to-Speech API
 */
export async function playElevenLabsSpeech(options: ElevenLabsSpeechOptions): Promise<HTMLAudioElement | null> {
  const {
    text,
    voiceId,
    speakingRate = 1.0,
    voiceGender = 'male',
    onStart,
    onEnded,
    onError,
  } = options;

  // Immediately cancel any previous audio
  stopElevenLabsSpeech();

  const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;

  if (!apiKey) {
    console.warn('ElevenLabs API key not found; falling back to browser speech synthesis.');
    playBrowserFallbackSpeech(options);
    return null;
  }

  const cleanText = text.trim();
  if (!cleanText) {
    onEnded?.();
    return null;
  }

  const defaultVoice = voiceGender === 'female' ? DEFAULT_VOICES.female : DEFAULT_VOICES.male;
  const activeVoiceId = voiceId || defaultVoice;
  const cacheKey = `${activeVoiceId}:${cleanText}`;

  try {
    let audioUrl = audioCache.get(cacheKey);

    if (!audioUrl) {
      activeAbortController = new AbortController();

      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${activeVoiceId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text: cleanText,
          model_id: 'eleven_turbo_v2_5', // Fastest response and crystal-clear pronunciation
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.8,
            style: 0.1,
            use_speaker_boost: true,
          },
        }),
        signal: activeAbortController.signal,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`ElevenLabs HTTP ${response.status}: ${errorText}`);
      }

      const blob = await response.blob();
      audioUrl = URL.createObjectURL(blob);
      audioCache.set(cacheKey, audioUrl);
    }

    const audio = new Audio(audioUrl);
    activeAudio = audio;

    // Apply playback speed
    if (speakingRate && speakingRate >= 0.5 && speakingRate <= 2.0) {
      audio.playbackRate = speakingRate;
    }

    let hasStarted = false;

    audio.onplay = () => {
      hasStarted = true;
      onStart?.();
    };

    audio.onended = () => {
      if (activeAudio === audio) {
        activeAudio = null;
      }
      onEnded?.();
    };

    audio.onerror = (e) => {
      console.warn('ElevenLabs audio playback error; attempting browser fallback', e);
      if (activeAudio === audio) {
        activeAudio = null;
      }
      onError?.(e);
      playBrowserFallbackSpeech(options);
    };

    await audio.play();

    if (!hasStarted) {
      onStart?.();
    }

    return audio;
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      // Clean cancellation, do not trigger fallback or error
      return null;
    }

    console.warn('ElevenLabs request failed; using browser fallback:', err);
    onError?.(err);
    playBrowserFallbackSpeech(options);
    return null;
  }
}

/**
 * Transcribes recorded speech using ElevenLabs Scribe API.
 * Provides high-accuracy transcription for candidate audio blobs.
 */
export async function transcribeSpeechWithElevenLabs(
  audioBlob: Blob,
  languageCode: string = 'en'
): Promise<string> {
  const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
  if (!apiKey) {
    throw new Error('ElevenLabs API key is missing.');
  }

  if (!audioBlob || audioBlob.size < 500) {
    return '';
  }

  const formData = new FormData();
  // Ensure a recognizable audio filename for the API
  const filename = audioBlob.type.includes('mp4') ? 'speech.mp4' : 'speech.webm';
  formData.append('file', audioBlob, filename);
  formData.append('model_id', 'scribe_v1');
  if (languageCode) {
    formData.append('language_code', languageCode === 'hi' ? 'hi' : 'en');
  }

  const response = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`ElevenLabs STT error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const transcriptText = (data.text || data.transcript || '').trim();
  return transcriptText;
}
