import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useGame } from "@/game/useGame";
import { useAuth } from "@/auth/useAuth";
import { api, loadHome, type HomeData } from "@/lib/api";
import { puzzleNumber as puzzleFor } from "@/lib/time";
import { Loader } from "@/components/Loader";
import { StartScreen } from "@/components/StartScreen";
import { HowToPlay } from "@/components/HowToPlay";
import { PlayScreen } from "@/components/PlayScreen";
import { ResultsScreen } from "@/components/ResultsScreen";
import { MascotsModal } from "@/components/MascotsModal";
import { ScorecardModal } from "@/components/ScorecardModal";
import { LeaderboardModal } from "@/components/LeaderboardModal";
import { TopControls } from "@/components/TopControls";

export default function App() {
  const [booted, setBooted] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showMascots, setShowMascots] = useState(false);
  const [showScorecard, setShowScorecard] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [home, setHome] = useState<HomeData | null>(null);

  const game = useGame();
  const auth = useAuth();

  const refreshHome = useCallback(async () => {
    if (!auth.user) return;
    try {
      setHome(await loadHome(auth.user.id));
    } catch (e) {
      console.error("loadHome", e);
    }
  }, [auth.user]);

  // Initial + on-auth-ready load.
  useEffect(() => {
    if (auth.ready && auth.user) refreshHome();
  }, [auth.ready, auth.user, refreshHome]);

  // Refresh home once a game is finalized (updates played/stats/mascots/streak).
  useEffect(() => {
    if (game.finishResult) refreshHome();
  }, [game.finishResult, refreshHome]);

  async function startGame() {
    setShowTutorial(false);
    localStorage.setItem("tailender.seenTutorial", "1");
    await game.start();
  }

  function handlePlay() {
    if (localStorage.getItem("tailender.seenTutorial")) startGame();
    else setShowTutorial(true);
  }

  async function equipMascot(id: string) {
    try {
      await api.equip(id);
      await refreshHome();
    } catch (e) {
      console.error("equip", e);
    }
  }

  const atStart = game.phase === "start";
  const puzzleNumber = puzzleFor();
  const loadingReady = booted && auth.ready && home;

  return (
    <div className="grain relative min-h-dvh">
      {loadingReady && <TopControls onOpenLeaderboard={() => setShowLeaderboard(true)} />}

      <AnimatePresence mode="wait">
        {!loadingReady && <Loader key="loader" onDone={() => setBooted(true)} />}

        {loadingReady && atStart && (
          <StartScreen
            key="start"
            onStart={handlePlay}
            isGuest={auth.isGuest}
            onSignIn={auth.signInWithGoogle}
            selectedId={home.equippedMascot}
            onOpenMascots={() => setShowMascots(true)}
            onOpenLeaderboard={() => setShowLeaderboard(true)}
            streak={home.streak}
            playsToday={home.playsToday}
            topToday={home.topToday}
            puzzleNumber={puzzleNumber}
            playedToday={!!home.scorecard}
            dayScore={home.scorecard?.total ?? 0}
            onViewScorecard={() => setShowScorecard(true)}
          />
        )}

        {loadingReady && game.phase === "loading" && <GameLoading key="gload" />}

        {loadingReady && (game.phase === "playing" || game.phase === "reveal") && (
          <PlayScreen key="play" game={game} />
        )}

        {loadingReady && game.phase === "results" && (
          <ResultsScreen
            key="results"
            items={game.finishResult?.items ?? []}
            total={game.finishResult?.total ?? 0}
            puzzleNumber={game.puzzleNumber}
            onHome={game.goHome}
          />
        )}
      </AnimatePresence>

      {/* How-to-play */}
      <AnimatePresence>
        {loadingReady && atStart && showTutorial && (
          <HowToPlay key="howto" onDone={startGame} onSkip={startGame} />
        )}
      </AnimatePresence>

      {/* Mascots collection */}
      <AnimatePresence>
        {showMascots && home && (
          <MascotsModal
            key="mascots"
            selectedId={home.equippedMascot}
            unlocked={home.unlocked}
            onSelect={equipMascot}
            onClose={() => setShowMascots(false)}
          />
        )}
      </AnimatePresence>

      {/* Today's scorecard */}
      <AnimatePresence>
        {showScorecard && home?.scorecard && (
          <ScorecardModal
            key="scorecard"
            items={home.scorecard.items}
            total={home.scorecard.total}
            puzzleNumber={puzzleNumber}
            selectedId={home.equippedMascot}
            onClose={() => setShowScorecard(false)}
          />
        )}
      </AnimatePresence>

      {/* Leaderboard */}
      <AnimatePresence>
        {showLeaderboard && (
          <LeaderboardModal
            key="leaderboard"
            nickname={home?.nickname ?? null}
            onNicknameSet={refreshHome}
            onClose={() => setShowLeaderboard(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function GameLoading() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex min-h-dvh items-center justify-center px-6"
    >
      <div className="brut ground-card rounded-2xl px-8 py-6 text-center">
        <p className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-pitch-deep">
          Rolling the 22 yards…
        </p>
      </div>
    </motion.div>
  );
}
