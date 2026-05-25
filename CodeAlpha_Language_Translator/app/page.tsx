"use client";

import { useState, useEffect } from "react";

export default function Home() {
  // State management for the translator
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLang, setSourceLang] = useState("English");
  const [targetLang, setTargetLang] = useState("Spanish");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessingSpeech, setIsProcessingSpeech] = useState(false);

  // Available languages for translation
  const languages = [
    "English",
    "Hindi",
    "Spanish",
    "French",
    "German",
    "Italian",
    "Portuguese",
    "Russian",
    "Japanese",
    "Chinese",
    "Korean",
    "Urdu",
    "Arabic",
  ];

  // Language code mapping for Text-to-Speech
  const languageCodes: { [key: string]: string } = {
    English: "en-US",
    Hindi: "hi-IN",
    Urdu: "ur-PK",
    Spanish: "es-ES",
    French: "fr-FR",
    German: "de-DE",
    Italian: "it-IT",
    Portuguese: "pt-PT",
    Russian: "ru-RU",
    Japanese: "ja-JP",
    Chinese: "zh-CN",
    Korean: "ko-KR",
    Arabic: "ar-SA",
  };

  // Initialize dark mode from system preference
  useEffect(() => {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    }

    // Preload voices for Edge compatibility
    if (window.speechSynthesis) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  // Handle translation
  const handleTranslate = async () => {
    // Validation
    if (!sourceText.trim()) {
      setError("Please enter text to translate");
      return;
    }

    if (sourceLang === targetLang) {
      setError("Source and target languages must be different");
      return;
    }

    setIsLoading(true);
    setError("");
    setTranslatedText("");

    try {
      // Call our secure API route (not exposing API key)
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: sourceText,
          sourceLang,
          targetLang,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Translation failed");
      }

      setTranslatedText(data.translatedText);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Swap languages
  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  // Copy translated text to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(translatedText);
      setIsCopied(true);
      // Reset the copied state after 2 seconds
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  // Text-to-Speech function (browser Web Speech API only)
  const speakText = () => {
    // Prevent multiple simultaneous speech attempts
    if (isProcessingSpeech) {
      return;
    }

    // Check if browser supports speech synthesis
    if (!window.speechSynthesis) {
      console.error("Speech synthesis not supported");
      return;
    }

    // Validate text
    if (!translatedText || !translatedText.trim()) {
      setIsSpeaking(false);
      return;
    }

    // Set processing flag
    setIsProcessingSpeech(true);

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Edge needs significant delay after cancel before starting new speech
    setTimeout(() => {
      try {
        // Get available voices
        const voices = window.speechSynthesis.getVoices();
        const targetLangCode = languageCodes[targetLang] || "en-US";

        // Check if a voice exists for the target language
        const langPrefix = targetLangCode.split('-')[0]; // e.g., "ar" from "ar-SA"
        const hasVoiceForLanguage = voices.some(voice =>
          voice.lang.startsWith(langPrefix) || voice.lang === targetLangCode
        );

        if (!hasVoiceForLanguage) {
          console.warn(`No TTS voice available for ${targetLang} (${targetLangCode}). Available voices:`, voices.map(v => v.lang));
          alert(`Text-to-Speech is not available for ${targetLang} on your system. Please install ${targetLang} language pack in your operating system settings.`);
          setIsProcessingSpeech(false);
          return;
        }

        // Create speech utterance
        const utterance = new SpeechSynthesisUtterance(translatedText);

        // Set language - let browser auto-select voice (more reliable in Edge)
        utterance.lang = targetLangCode;
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;

        // Set speaking state
        utterance.onstart = () => {
          setIsSpeaking(true);
          setIsProcessingSpeech(false);
        };

        utterance.onend = () => {
          setIsSpeaking(false);
          setIsProcessingSpeech(false);
        };

        utterance.onerror = (event) => {
          // Only log if it's not a cancelled event
          if (event.error !== 'canceled' && event.error !== 'interrupted') {
            console.error("Speech synthesis error:", event.error);
          }
          setIsSpeaking(false);
          setIsProcessingSpeech(false);
        };

        // Speak the text
        window.speechSynthesis.speak(utterance);
      } catch (error) {
        console.error("Failed to speak text:", error);
        setIsSpeaking(false);
        setIsProcessingSpeech(false);
      }
    }, 250); // Increased delay for Edge compatibility
  };

  // Stop speech
  const stopSpeaking = () => {
    try {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    } catch (error) {
      console.error("Failed to stop speech:", error);
    } finally {
      setIsSpeaking(false);
      setIsProcessingSpeech(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl">
        {/* Header with dark mode toggle */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold">CodeAlpha Language Translator</h1>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? "🌞" : "🌙"}
          </button>
        </div>

        {/* Main translator card */}
        <div
          className="rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
          style={{
            backgroundColor: "var(--card-bg)",
            border: "1px solid var(--card-border)",
          }}
        >
          {/* Language selectors */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">From</label>
              <select
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value)}
                className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{
                  backgroundColor: "var(--input-bg)",
                  borderColor: "var(--input-border)",
                }}
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            {/* Swap button */}
            <button
              onClick={swapLanguages}
              className="self-end sm:self-center p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              aria-label="Swap languages"
            >
              ⇄
            </button>

            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">To</label>
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{
                  backgroundColor: "var(--input-bg)",
                  borderColor: "var(--input-border)",
                }}
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Text input area */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Text to translate</label>
            <textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="Enter text here..."
              rows={6}
              className="w-full p-4 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              style={{
                backgroundColor: "var(--input-bg)",
                borderColor: "var(--input-border)",
              }}
            />
          </div>

          {/* Translate button */}
          <button
            onClick={handleTranslate}
            disabled={isLoading}
            className="w-full py-3 px-6 rounded-lg font-medium text-white hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            style={{
              backgroundColor: isLoading ? "var(--button-bg)" : "var(--button-bg)",
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = "var(--button-hover)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--button-bg)";
            }}
          >
            {isLoading ? "Translating..." : "Translate"}
          </button>

          {/* Error message */}
          {error && (
            <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg">
              {error}
            </div>
          )}

          {/* Translation result */}
          {translatedText && (
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium">Translation</label>
                <div className="flex gap-2">
                  {/* Speaker button */}
                  <button
                    onClick={() => isSpeaking ? stopSpeaking() : speakText()}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                    aria-label={isSpeaking ? "Stop speaking" : "Speak translation"}
                  >
                    {isSpeaking ? (
                      <>
                        <span>🔇</span>
                        <span>Stop</span>
                      </>
                    ) : (
                      <>
                        <span>🔊</span>
                        <span>Speak</span>
                      </>
                    )}
                  </button>
                  {/* Copy button */}
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                    aria-label="Copy translation"
                  >
                    {isCopied ? (
                      <>
                        <span>✓</span>
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <span>📋</span>
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
              <div
                className="p-4 rounded-lg border"
                style={{
                  backgroundColor: "var(--input-bg)",
                  borderColor: "var(--input-border)",
                }}
              >
                <p className="whitespace-pre-wrap">{translatedText}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center mt-6 text-sm opacity-60">
          Powered by Google Gemini AI
        </p>
      </div>
    </div>
  );
}
