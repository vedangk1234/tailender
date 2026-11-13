import { useCallback, useEffect, useRef, useState } from "react";
import { resolveEntity } from "@/lib/recognition";
import { SECONDS_PER_QUESTION, type TierId } from "@/lib/scoring";
import {
  DAILY_QUESTIONS,
  ROSTER,
  type Question,
} from "@/data/mockDaily";

export type Phase = "start" | "playing" | "reveal" | "results";

export type Feedback =
  | { kind: "recognised_wrong"; display: string }
  | { kind: "unrecognised" };

export type GuessOutcome =
  | { kind: "scored"; tier: TierId; display: string }
  | Feedback;

function evaluateGuess(input: string, question: Question): GuessOutcome {
  const id = resolveEntity(input, ROSTER);
  if (!id) return { kind: "unrecognised" };
  const match = question.answers.find((a) => a.entityId === id);
  const display = ROSTER.find((e) => e.id === id)!.canonical;
  if (match) return { kind: "scored", tier: match.tier, display };
  return { kind: "recognised_wrong", display };
}

export interface GameState {
  phase: Phase;
  qIndex: number;
  question: Question;
  total: number;
  timeLeft: number;
  results: TierId[];
  displays: (string | null)[];
  feedback: Feedback | null;
  revealTier: TierId | null;
  lastScoredDisplay: string | null;
  start: () => void;
  submitGuess: (input: string) => GuessOutcome;
  continueNext: () => void;
  clearFeedback: () => void;
  skipQuestion: () => void;
  goHome: () => void;
}

export function useGame(): GameState {
  const [phase, setPhase] = useState<Phase>("start");
  const [qIndex, setQIndex] = useState(0);
  const [results, setResults] = useState<TierId[]>([]);
  const [displays, setDisplays] = useState<(string | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(SECONDS_PER_QUESTION);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [revealTier, setRevealTier] = useState<TierId | null>(null);
  const [lastScoredDisplay, setLastScoredDisplay] = useState<string | null>(null);

  const question = DAILY_QUESTIONS[qIndex];
  const total = DAILY_QUESTIONS.length;

  const lockTier = useCallback((tier: TierId, display: string | null) => {
    setResults((r) => [...r, tier]);
    setDisplays((d) => [...d, display]);
    setRevealTier(tier);
    setLastScoredDisplay(display);
    setFeedback(null);
    setPhase("reveal");
  }, []);

  // Per-question countdown.
  const tierRef = useRef(lockTier);
  tierRef.current = lockTier;
  useEffect(() => {
    if (phase !== "playing") return;
    if (timeLeft <= 0) {
      tierRef.current("duck", null); // timeout with no valid answer
      return;
    }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [phase, timeLeft]);

  const start = useCallback(() => {
    setPhase("playing");
    setQIndex(0);
    setResults([]);
    setDisplays([]);
    setTimeLeft(SECONDS_PER_QUESTION);
    setFeedback(null);
    setRevealTier(null);
    setLastScoredDisplay(null);
  }, []);

  const submitGuess = useCallback(
    (input: string): GuessOutcome => {
      const outcome = evaluateGuess(input, DAILY_QUESTIONS[qIndex]);
      if (outcome.kind === "scored") {
        lockTier(outcome.tier, outcome.display);
      } else {
        setFeedback(outcome);
      }
      return outcome;
    },
    [qIndex, lockTier]
  );

  const continueNext = useCallback(() => {
    setRevealTier(null);
    setLastScoredDisplay(null);
    if (qIndex + 1 < total) {
      setQIndex((i) => i + 1);
      setTimeLeft(SECONDS_PER_QUESTION);
      setPhase("playing");
    } else {
      setPhase("results");
    }
  }, [qIndex, total]);

  const clearFeedback = useCallback(() => setFeedback(null), []);

  // Skip the current question — scores a Duck (0) and moves on.
  const skipQuestion = useCallback(() => {
    if (phase !== "playing") return;
    lockTier("duck", null);
  }, [phase, lockTier]);

  const goHome = useCallback(() => {
    setPhase("start");
    setQIndex(0);
    setResults([]);
    setDisplays([]);
    setTimeLeft(SECONDS_PER_QUESTION);
    setFeedback(null);
    setRevealTier(null);
    setLastScoredDisplay(null);
  }, []);

  return {
    phase,
    qIndex,
    question,
    total,
    timeLeft,
    results,
    displays,
    feedback,
    revealTier,
    lastScoredDisplay,
    start,
    submitGuess,
    continueNext,
    clearFeedback,
    skipQuestion,
    goHome,
  };
}
