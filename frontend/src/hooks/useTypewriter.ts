import { useEffect, useRef, useState } from "react";

const DELETE_SPEED_MS = 15;
const TYPE_SPEED_MS = 30;

export function useTypewriter(targetText: string) {
  const [displayText, setDisplayText] = useState(targetText);
  const previousText = useRef(targetText);

  useEffect(() => {
    if (previousText.current === targetText) return;

    let cancelled = false;
    let current = previousText.current;

    function deleteStep() {
      if (cancelled) return;

      if (current.length > 0) {
        current = current.slice(0, -1);
        setDisplayText(current);
        setTimeout(deleteStep, DELETE_SPEED_MS);
      } else {
        typeStep();
      }
    }

    function typeStep() {
      if (cancelled) return;

      if (current.length < targetText.length) {
        current = targetText.slice(0, current.length + 1);
        setDisplayText(current);
        setTimeout(typeStep, TYPE_SPEED_MS);
      } else {
        previousText.current = targetText;
      }
    }

    deleteStep();

    return () => {
      cancelled = true;
      previousText.current = targetText;
    };
  }, [targetText]);

  return displayText;
}