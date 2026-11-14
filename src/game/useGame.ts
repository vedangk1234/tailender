import { useCallback, useEffect, useRef, useState } from "react";
import { SECONDS_PER_QUESTION, type TierId } from "@/lib/scoring";
import { puzzleNumber as puzzleFor } from "@/lib/time";
import {
  api,
  type DailyQuestion,
  type GuessResult,
  type FinishResponse,
} from "@/lib/api";

export type Phase = "start" | "loading" | "playing" | "reveal" | "results";
export type Feedback =
  | { kind: "recognised_wrong"; display: string }
  | { kind: "unrecognised" };

export interface GameState {
  phase: Phase;
  qIndex: number;
  question: DailyQuestion | undefined;
  total: number;
  puzzleNumber: number;
  timeLeft: number;
  results: TierId[];
  displays: (string | null)[];
  feedback: Feedback | null;
  revealTier: TierId | null;
  lastScoredDisplay: string | null;
  pending: boolean;
  finishResult: FinishResponse | null;
  start: () => Promise<void>;
  submitGuess: (input: string) => Promise<GuessResult | null>;
  skipQuestion: () => void;
  continueNext: () => Promise<void>;
  clearFeedback: () => void;
  goHome: () => void;
}

export function useGame(): GameState {
  const [phase, setPhase] = useState<Phase>("start");
  const [questions, setQuestions] = useState<DailyQuestion[]>([]);
  const [puzzleNumber, setPuzzleNumber] = useState(() => puzzleFor());
  const [qIndex, setQIndex] = useState(0);
  const [results, setResults] = useState<TierId[]>([]);
  const [displays, setDisplays] = useState<(string | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(SECONDS_PER_QUESTION);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [revealTier, setRevealTier] = useState<TierId | null>(null);
  const [lastScoredDisplay, setLastScoredDisplay] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [finishResult, setFinishResult] = useState<FinishResponse | null>(null);
  const qStart = useRef(0);
  const gameStart = useRef(0);

  const total = questions.length || 5;
  const question = questions[qIndex];

  const lockTier = useCallback((tier: TierId, display: string | null) => {
    setResults((r) => [...r, tier]);
    setDisplays((d) => [...d, display]);
    setRevealTier(tier);
    setLastScoredDisplay(display);
    setFeedback(null);
    setPhase("reveal");
  }, []);

  // Per-question countdown.
  const lockRef = useRef(lockTier);
  lockRef.current = lockTier;
  useEffect(() => {
    if (phase !== "playing") return;
    if (timeLeft <= 0) {
      lockRef.current("duck", null);
      return;
    }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [phase, timeLeft]);

  const start = useCallback(async () => {
    setPhase("loading");
    setResults([]);
    setDisplays([]);
    setFeedback(null);
    setRevealTier(null);
    setLastScoredDisplay(null);
    setFinishResult(null);
    try {
      const d = await api.daily();
      setQuestions(d.questions);
      setPuzzleNumber(d.puzzleNumber);
      setQIndex(0);
      setTimeLeft(SECONDS_PER_QUESTION);
      qStart.current = Date.now();
      gameStart.current = Date.now();
      setPhase("playing");
    } catch (e) {
      console.error("daily failed", e);
      setPhase("start");
    }
  }, []);

  const submitGuess = useCallback(
    async (input: string): Promise<GuessResult | null> => {
      if (phase !== "playing" || pending) return null;
      setPending(true);
      try {
        const ms = Date.now() - qStart.current;
        const out = await api.guess(qIndex, input, ms);
        if (out.kind === "scored") lockTier(out.tier as TierId, out.display);
        else setFeedback(out);
        return out;
      } catch (e) {
        console.error("guess failed", e);
        return null;
      } finally {
        setPending(false);
      }
    },
    [phase, pending, qIndex, lockTier]
  );

  const skipQuestion = useCallback(() => {
    if (phase === "playing") lockTier("duck", null);
  }, [phase, lockTier]);

  const continueNext = useCallback(async () => {
    setRevealTier(null);
    setLastScoredDisplay(null);
    if (qIndex + 1 < total) {
      setQIndex((i) => i + 1);
      setTimeLeft(SECONDS_PER_QUESTION);
      qStart.current = Date.now();
      setPhase("playing");
    } else {
      setPhase("loading");
      try {
        const r = await api.finish(Date.now() - gameStart.current);
        setFinishResult(r);
      } catch (e) {
        console.error("finish failed", e);
      }
      setPhase("results");
    }
  }, [qIndex, total]);

  const clearFeedback = useCallback(() => setFeedback(null), []);

  const goHome = useCallback(() => {
    setPhase("start");
    setQIndex(0);
    setResults([]);
    setDisplays([]);
    setFeedback(null);
    setRevealTier(null);
    setLastScoredDisplay(null);
  }, []);

  return {
    phase,
    qIndex,
    question,
    total,
    puzzleNumber,
    timeLeft,
    results,
    displays,
    feedback,
    revealTier,
    lastScoredDisplay,
    pending,
    finishResult,
    start,
    submitGuess,
    skipQuestion,
    continueNext,
    clearFeedback,
    goHome,
  };
}
