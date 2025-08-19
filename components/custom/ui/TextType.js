"use client";

import { useEffect, useRef, useState, createElement } from "react";

const TextType = ({
  text,
  as: Component = "div",
  typingSpeed = 50,
  deletingSpeed = 30,
  initialDelay = 0,
  pauseDuration = 2000,
  loop = true,
  className = "",
  showCursor = true,
  hideCursorWhileTyping = false,
  cursorCharacter = "|",
  cursorClassName = "",
  cursorBlinkDuration = 0.7,
  textColors = ["var(--secondary)"],
  variableSpeed,
  onSentenceComplete,
  startOnVisible = false,
  reverseMode = false,
  ...props
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(!startOnVisible);

  const containerRef = useRef(null);

  const textArray = Array.isArray(text) ? text : [text];

  const getRandomSpeed = () => {
    if (!variableSpeed) return typingSpeed;
    const { min, max } = variableSpeed;
    return Math.random() * (max - min) + min;
  };

  const getCurrentTextColor = () => textColors[currentTextIndex % textColors.length];

  // Intersection observer to start animation on visibility
  useEffect(() => {
    if (!startOnVisible || !containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [startOnVisible]);

  // Typing logic
  useEffect(() => {
    if (!isVisible) return;
    let timeout;
    const currentText = textArray[currentTextIndex];
    const processedText = reverseMode ? currentText.split("").reverse().join("") : currentText;

    const type = () => {
      if (isDeleting) {
        if (displayedText === "") {
          setIsDeleting(false);
          const nextIndex = (currentTextIndex + 1) % textArray.length;
          setCurrentTextIndex(nextIndex);
          setCurrentCharIndex(0);
          if (onSentenceComplete) onSentenceComplete(currentText, currentTextIndex);
          if (!loop && nextIndex === 0) return;
          timeout = setTimeout(() => {}, pauseDuration);
        } else {
          timeout = setTimeout(() => setDisplayedText((prev) => prev.slice(0, -1)), deletingSpeed);
        }
      } else {
        if (currentCharIndex < processedText.length) {
          timeout = setTimeout(() => {
            setDisplayedText((prev) => prev + processedText[currentCharIndex]);
            setCurrentCharIndex((prev) => prev + 1);
          }, variableSpeed ? getRandomSpeed() : typingSpeed);
        } else {
          timeout = setTimeout(() => setIsDeleting(true), pauseDuration);
        }
      }
    };

    timeout = setTimeout(type, initialDelay);
    return () => clearTimeout(timeout);
  }, [
    currentCharIndex,
    displayedText,
    isDeleting,
    currentTextIndex,
    textArray,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
    initialDelay,
    loop,
    isVisible,
    variableSpeed,
    reverseMode,
    onSentenceComplete,
  ]);

  const shouldHideCursor =
    hideCursorWhileTyping && (currentCharIndex < textArray[currentTextIndex].length || isDeleting);

  return createElement(
    Component,
    {
      ref: containerRef,
      className: `relative inline-block ${className}`,
      ...props,
    },
    <>
      <span
        className="transition-colors duration-300"
        style={{ color: getCurrentTextColor() }}
      >
        {displayedText}
      </span>
      {showCursor && (
        <span
          className={`ml-1 animate-blink ${cursorClassName} ${shouldHideCursor ? "opacity-0" : ""}`}
          style={{ color: "var(--accent)" }}
        >
          {cursorCharacter}
        </span>
      )}
      <style jsx>{`
        @keyframes blink {
          0%, 50%, 100% { opacity: 1; }
          25%, 75% { opacity: 0; }
        }
        .animate-blink {
          animation: blink ${cursorBlinkDuration}s infinite;
        }
      `}</style>
    </>
  );
};

export default TextType;
