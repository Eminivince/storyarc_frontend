import { useCallback, useEffect, useRef, useState } from "react";
import { useAccount } from "../context/AccountContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import RewardWheel from "./RewardWheel";

const inflightAutoCheckInKeys = new Set();

function localDateKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function storageKeyFor(userId) {
  return `talestead:dailyLoginAutoClaim:${userId}:${localDateKey()}`;
}

/**
 * On first app load of the day (after engagement overview loads), claims daily check-in
 * if not yet claimed and shows the reward wheel — same flow as tapping Check in on Rewards.
 */
export default function DailyLoginRewardWheel() {
  const { user } = useAuth();
  const {
    claimDailyCheckIn,
    claimedMissionIds,
    isAccountLoading,
    setLastWheelResult,
  } = useAccount();
  const { showToast } = useToast();
  const [showWheel, setShowWheel] = useState(false);
  const [wheelResult, setWheelResult] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const claimDailyCheckInRef = useRef(claimDailyCheckIn);
  claimDailyCheckInRef.current = claimDailyCheckIn;

  const checkedInToday = claimedMissionIds.includes("daily-check-in");

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    if (isAccountLoading) {
      return;
    }

    if (checkedInToday) {
      return;
    }

    const runKey = `${user.id}:${localDateKey()}`;
    if (inflightAutoCheckInKeys.has(runKey)) {
      return;
    }

    const ssKey = storageKeyFor(user.id);
    if (globalThis.sessionStorage?.getItem(ssKey)) {
      return;
    }

    inflightAutoCheckInKeys.add(runKey);

    (async () => {
      try {
        const result = await claimDailyCheckInRef.current();

        globalThis.sessionStorage?.setItem(ssKey, "1");

        if (
          result &&
          typeof result === "object" &&
          result.wheelIndex !== undefined
        ) {
          setWheelResult(result);
          setShowWheel(true);
          setIsSpinning(true);
        }
      } catch {
        globalThis.sessionStorage?.removeItem(ssKey);
      } finally {
        inflightAutoCheckInKeys.delete(runKey);
      }
    })();
  }, [user?.id, isAccountLoading, checkedInToday]);

  const handleWheelComplete = useCallback(
    (result) => {
      showToast(`You earned ${result.finalPoints} Arc Points!`, {
        tone: "success",
      });

      globalThis.setTimeout(() => {
        setShowWheel(false);
        setIsSpinning(false);
        setWheelResult(null);
        setLastWheelResult(null);
      }, 500);
    },
    [setLastWheelResult, showToast],
  );

  if (!showWheel || !wheelResult) {
    return null;
  }

  return (
    <RewardWheel
      isSpinning={isSpinning}
      onComplete={handleWheelComplete}
      wheelResult={wheelResult}
    />
  );
}
