"use client";

import { useEffect, useState } from "react";

interface TypewriterTextProps {
  words: string[];
  className?: string;
  speed?: number;
  deleteSpeed?: number;
  delay?: number;
}

export function TypewriterText({
  words,
  className = "",
  speed = 150,
  deleteSpeed = 100,
  delay = 2000,
}: TypewriterTextProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[currentWordIndex];
    
    const handleTyping = () => {
      if (isDeleting) {
        // Deleting text
        setCurrentText((prev) => prev.substring(0, prev.length - 1));
      } else {
        // Typing text
        setCurrentText((prev) => currentWord.substring(0, prev.length + 1));
      }

      // Check for word completion
      if (!isDeleting && currentText === currentWord) {
        setTimeout(() => setIsDeleting(true), delay);
      } else if (isDeleting && currentText === "") {
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
      }
    };

    const timer = setTimeout(
      handleTyping,
      isDeleting ? deleteSpeed : speed
    );

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, words, currentWordIndex, delay, speed, deleteSpeed]);

  return (
    <span className={className}>
      {currentText}
    </span>
  );
}
