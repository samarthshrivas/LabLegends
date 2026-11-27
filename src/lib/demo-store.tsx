"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from "react";
import type {
  Attempt,
  DemoState,
  Evaluation,
  ExperimentRun,
  Role,
} from "@/types/domain";
import { createSeedState, SEED_ANCHOR } from "@/data/demo";
import { createId } from "@/lib/utils";

const STORAGE_KEY = "lablegends.demo.v1";

type Action =
  | { type: "hydrate"; state: DemoState }
  | { type: "sign-in"; role: Role; displayName?: string }
  | { type: "sign-out" }
  | { type: "upsert-attempt"; attempt: Attempt }
  | { type: "patch-attempt"; id: string; patch: Partial<Attempt> }
  | { type: "add-run"; attemptId: string; run: ExperimentRun }
  | { type: "reveal-hint"; attemptId: string; hintId: string }
  | { type: "complete"; attemptId: string; evaluation: Evaluation; xp: number; badgeIds: string[] }
  | { type: "reset"; state: DemoState };

function reducer(state: DemoState, action: Action): DemoState {
  switch (action.type) {
    case "hydrate":
      return action.state;
    case "sign-in":
      return {
        ...state,
        role: action.role,
        student: action.displayName
          ? { ...state.student, displayName: action.displayName }
          : state.student,
        lastVisitedAt: new Date().toISOString(),
      };
    case "sign-out":
      return { ...state, role: null };
    case "upsert-attempt": {
      const exists = state.attempts.some((attempt) => attempt.id === action.attempt.id);
      return {
        ...state,
        attempts: exists
          ? state.attempts.map((attempt) =>
              attempt.id === action.attempt.id ? action.attempt : attempt,
            )
          : [action.attempt, ...state.attempts],
      };
    }
    case "patch-attempt":
      return {
        ...state,
        attempts: state.attempts.map((attempt) =>
          attempt.id === action.id ? { ...attempt, ...action.patch } : attempt,
        ),
      };
    case "add-run":
      return {
        ...state,
        attempts: state.attempts.map((attempt) =>
          attempt.id === action.attemptId
            ? { ...attempt, runs: [...attempt.runs, action.run] }
            : attempt,
        ),
      };
    case "reveal-hint":
      return {
        ...state,
        attempts: state.attempts.map((attempt) => {
          if (attempt.id !== action.attemptId) return attempt;
          if (attempt.revealedHintIds.includes(action.hintId)) return attempt;
          return {
            ...attempt,
            revealedHintIds: [...attempt.revealedHintIds, action.hintId],
            hintsUsed: attempt.hintsUsed + 1,
          };
        }),
      };
    case "complete": {
      const attempt = state.attempts.find((item) => item.id === action.attemptId);
      const alreadyCounted = state.completedMissionIds.includes(attempt?.missionId ?? "");
      const newlyEarned = action.badgeIds.filter((id) => !state.student.badgeIds.includes(id));
      return {
        ...state,
        attempts: state.attempts.map((item) =>
          item.id === action.attemptId
            ? {
                ...item,
                status: action.evaluation.passed ? "completed" : "retry",
                evaluation: action.evaluation,
                xpAwarded: action.xp,
                completedAt: new Date().toISOString(),
              }
            : item,
        ),
        student: {
          ...state.student,
          xp: state.student.xp + action.xp,
          badgeIds: [...state.student.badgeIds, ...newlyEarned],
        },
        completedMissionIds:
          action.evaluation.passed && attempt && !alreadyCounted
            ? [...state.completedMissionIds, attempt.missionId]
            : state.completedMissionIds,
      };
    }
    case "reset":
      return action.state;
    default:
      return state;
  }
}

export interface DemoStore {
  state: DemoState;
  signIn: (role: Role, displayName?: string) => void;
  signOut: () => void;
  startAttempt: (missionId: string) => Attempt;
  restartAttempt: (missionId: string) => Attempt;
  patchAttempt: (id: string, patch: Partial<Attempt>) => void;
  addRun: (attemptId: string, run: ExperimentRun) => void;
  revealHint: (attemptId: string, hintId: string) => void;
  completeAttempt: (
    attemptId: string,
    evaluation: Evaluation,
    xp: number,
    badgeIds: string[],
  ) => void;
  resetDemo: () => void;
  getAttempt: (id: string) => Attempt | undefined;
  latestAttemptFor: (missionId: string) => Attempt | undefined;
}

const DemoContext = createContext<DemoStore | null>(null);

function readStoredState(): DemoState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DemoState;
    if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.attempts)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, SEED_ANCHOR, createSeedState);
  const hydratedRef = useRef(false);

  useEffect(() => {
    const stored = readStoredState();
    dispatch({ type: "hydrate", state: stored ?? createSeedState(Date.now()) });
    hydratedRef.current = true;
  }, []);

  useEffect(() => {
    if (!hydratedRef.current) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage can be unavailable (private mode / quota). Demo still works in memory.
    }
  }, [state]);

  const signIn = useCallback((role: Role, displayName?: string) => {
    dispatch({ type: "sign-in", role, displayName });
  }, []);

  const signOut = useCallback(() => dispatch({ type: "sign-out" }), []);

  const startAttempt = useCallback((missionId: string) => {
    const resumable = state.attempts.find(
      (attempt) => attempt.missionId === missionId && attempt.status !== "completed",
    );
    if (resumable) return resumable;

    const now = new Date().toISOString();
    const attempt: Attempt = {
      id: createId("attempt"),
      missionId,
      missionVersion: 1,
      status: "in_progress",
      prediction: "",
      justification: "",
      conclusion: "",
      runs: [],
      hintsUsed: 0,
      revealedHintIds: [],
      evaluation: null,
      xpAwarded: 0,
      startedAt: now,
      completedAt: null,
    };
    dispatch({ type: "upsert-attempt", attempt });
    return attempt;
  }, [state.attempts]);

  const restartAttempt = useCallback((missionId: string): Attempt => {
    const now = new Date().toISOString();
    const attempt: Attempt = {
      id: createId("attempt"),
      missionId,
      missionVersion: 1,
      status: "in_progress",
      prediction: "",
      justification: "",
      conclusion: "",
      runs: [],
      hintsUsed: 0,
      revealedHintIds: [],
      evaluation: null,
      xpAwarded: 0,
      startedAt: now,
      completedAt: null,
    };
    dispatch({ type: "upsert-attempt", attempt });
    return attempt;
  }, []);

  const patchAttempt = useCallback((id: string, patch: Partial<Attempt>) => {
    dispatch({ type: "patch-attempt", id, patch });
  }, []);

  const addRun = useCallback((attemptId: string, run: ExperimentRun) => {
    dispatch({ type: "add-run", attemptId, run });
  }, []);

  const revealHint = useCallback((attemptId: string, hintId: string) => {
    dispatch({ type: "reveal-hint", attemptId, hintId });
  }, []);

  const completeAttempt = useCallback(
    (attemptId: string, evaluation: Evaluation, xp: number, badgeIds: string[]) => {
      dispatch({ type: "complete", attemptId, evaluation, xp, badgeIds });
    },
    [],
  );

  const resetDemo = useCallback(() => {
    dispatch({ type: "reset", state: createSeedState(Date.now()) });
  }, []);

  const getAttempt = useCallback(
    (id: string) => state.attempts.find((attempt) => attempt.id === id),
    [state.attempts],
  );

  const latestAttemptFor = useCallback(
    (missionId: string) => state.attempts.find((attempt) => attempt.missionId === missionId),
    [state.attempts],
  );

  const value = useMemo<DemoStore>(
    () => ({
      state,
      signIn,
      signOut,
      startAttempt,
      restartAttempt,
      patchAttempt,
      addRun,
      revealHint,
      completeAttempt,
      resetDemo,
      getAttempt,
      latestAttemptFor,
    }),
    [
      state,
      signIn,
      signOut,
      startAttempt,
      restartAttempt,
      patchAttempt,
      addRun,
      revealHint,
      completeAttempt,
      resetDemo,
      getAttempt,
      latestAttemptFor,
    ],
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemoStore(): DemoStore {
  const store = useContext(DemoContext);
  if (!store) {
    throw new Error("useDemoStore must be used inside <DemoProvider>.");
  }
  return store;
}
