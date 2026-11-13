import { useEffect, useState } from "react";
import { AnimatePresence } from "motion/react";
import { istDateKey } from "@/lib/time";
import { tierPoints } from "@/lib/scoring";
import {
  loadTodayScorecard,
  saveScorecard,
  type Scorecard,
} from "@/lib/scorecard";
import { DAILY_QUESTIONS } from "@/data/mockDaily";
import { useGame } from "@/game/useGame";
import { useAuth } from "@/auth/useAuth";
import { useMascots } from "@/mascots/useMascots";
import { Loader } from "@/components/Loader";
import { StartScreen } from "@/components/StartScreen";
import { HowToPlay } from "@/components/HowToPlay";
import { PlayScreen } from "@/components/PlayScreen";
import { ResultsScreen } from "@/components/ResultsScreen";
import { MascotsModal } from "@/components/MascotsModal";
import { ScorecardModal } from "@/components/ScorecardModal";
import { TopControls } from "@/components/TopControls";

export default function App() {
  const [booted, setBooted] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showMascots, setShowMascots] = useState(false);
  const [showScorecard, setShowScorecard] = useState(false);
  const game = useGame();
  const auth = useAuth();
  const mascots = useMascots();
  const [playedToday, setPlayedToday] = useState(
    () => localStorage.getItem("tailender.lastPlayed") === istDateKey()
  );
  const [scorecard, setScorecard] = useState<Scorecard | null>(() =>
    loadTodayScorecard()
  );

  // On completion: save today's scorecard and mark the day played.
  useEffect(() => {
    if (game.phase === "results") {
      const items = DAILY_QUESTIONS.map((q, i) => ({
        prompt: q.prompt,
        tier: game.results[i],
        display: game.displays[i] ?? null,
      }));
      const total = game.results.reduce((s, t) => s + tierPoints(t), 0);
      const sc: Scorecard = { date: istDateKey(), total, items };
      saveScorecard(sc);
      localStorage.setItem("tailender.lastPlayed", istDateKey());
      setScorecard(sc);
      setPlayedToday(true);
    }
  }, [game.phase, game.results, game.displays]);

  function startGame() {
    setShowTutorial(false);
    if (auth.user) auth.bumpStreak();
    game.start();
  }

  function handlePlay() {
    // Signed-out players get the how-to-play cards first.
    if (auth.user) startGame();
    else setShowTutorial(true);
  }

  const atStart = game.phase === "start";

  return (
    <div className="grain relative min-h-dvh">
      {booted && <TopControls />}

      <AnimatePresence mode="wait">
        {!booted && <Loader key="loader" onDone={() => setBooted(true)} />}

        {booted && atStart && (
          <StartScreen
            key="start"
            onStart={handlePlay}
            user={auth.user}
            streak={auth.streak}
            onSignIn={auth.signInWithGoogle}
            selectedId={mascots.selectedId}
            onOpenMascots={() => setShowMascots(true)}
            playedToday={playedToday}
            dayScore={scorecard?.total ?? 0}
            onViewScorecard={() => setShowScorecard(true)}
          />
        )}

        {booted && (game.phase === "playing" || game.phase === "reveal") && (
          <PlayScreen key="play" game={game} />
        )}

        {booted && game.phase === "results" && (
          <ResultsScreen key="results" results={game.results} onHome={game.goHome} />
        )}
      </AnimatePresence>

      {/* How-to-play pops up over the start screen for signed-out players */}
      <AnimatePresence>
        {booted && atStart && showTutorial && (
          <HowToPlay key="howto" onDone={startGame} onSkip={startGame} />
        )}
      </AnimatePresence>

      {/* Mascots collection */}
      <AnimatePresence>
        {showMascots && (
          <MascotsModal
            key="mascots"
            selectedId={mascots.selectedId}
            onSelect={mascots.select}
            onClose={() => setShowMascots(false)}
          />
        )}
      </AnimatePresence>

      {/* Today's scorecard */}
      <AnimatePresence>
        {showScorecard && scorecard && (
          <ScorecardModal
            key="scorecard"
            scorecard={scorecard}
            selectedId={mascots.selectedId}
            onClose={() => setShowScorecard(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
