/**
 * Context retrieval scoring adapted from Ombre Brain's retrieval and bucket
 * scoring modules.
 *
 * Copyright (c) 2026 P0lar1zzZ
 * Licensed under the MIT License.
 * Source: https://github.com/P0luz/Ombre-Brain
 */

export type AffectCoordinates = {
  valence: number;
  arousal: number;
};

export type RetrievalFeatures = {
  semanticSimilarity?: number;
  lexicalSimilarity?: number;
  temporalProximity?: number;
  affectiveProximity?: number;
  unresolvedRelevance?: number;
  promiseRelevance?: number;
  graphNeighborRelevance?: number;
};

export type RetrievalWeights = {
  semantic: number;
  lexical: number;
  temporal: number;
  affective: number;
  unresolved: number;
  promise: number;
  graphNeighbor: number;
};

export type RetrievalGates = {
  accessibility?: number;
  dignity?: number;
  scarcity?: number;
  intent?: number;
};

export type RankedContext<T> = {
  item: T;
  candidateScore: number;
  surfaceScore: number;
};

const DEFAULT_WEIGHTS: RetrievalWeights = {
  semantic: 1,
  lexical: 1,
  temporal: 1,
  affective: 1,
  unresolved: 1,
  promise: 1,
  graphNeighbor: 1,
};

const EMOTION_MAX_DISTANCE = Math.sqrt(2);
const TIME_DECAY_LAMBDA = 0.02;
const TOUCH_NORMALIZE_CAP = 10;

function finiteNumber(value: number | undefined, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function clamp01(value: number | undefined, fallback = 0): number {
  return Math.max(0, Math.min(1, finiteNumber(value, fallback)));
}

export function scoreAffectiveProximity(
  query: AffectCoordinates | null,
  memory: AffectCoordinates,
): number {
  if (!query) return 0.5;

  const distance = Math.hypot(
    clamp01(query.valence, 0.5) - clamp01(memory.valence, 0.5),
    clamp01(query.arousal, 0.3) - clamp01(memory.arousal, 0.3),
  );
  return Math.max(0, 1 - distance / EMOTION_MAX_DISTANCE);
}

export function scoreTemporalProximity(daysSinceActive: number): number {
  return Math.exp(-TIME_DECAY_LAMBDA * Math.max(0, finiteNumber(daysSinceActive, 30)));
}

export function scoreTouchFrequency(activationCount: number): number {
  return Math.min(Math.max(0, finiteNumber(activationCount, 0)) / TOUCH_NORMALIZE_CAP, 1);
}

export function scoreRetrievalCandidate(
  features: RetrievalFeatures,
  weights: RetrievalWeights = DEFAULT_WEIGHTS,
  gates: RetrievalGates = {},
): { candidateScore: number; surfaceScore: number } {
  const candidateScore =
    clamp01(features.semanticSimilarity) * weights.semantic +
    clamp01(features.lexicalSimilarity) * weights.lexical +
    clamp01(features.temporalProximity) * weights.temporal +
    clamp01(features.affectiveProximity) * weights.affective +
    clamp01(features.unresolvedRelevance) * weights.unresolved +
    clamp01(features.promiseRelevance) * weights.promise +
    clamp01(features.graphNeighborRelevance) * weights.graphNeighbor;

  const gateProduct =
    clamp01(gates.accessibility, 1) *
    clamp01(gates.dignity, 1) *
    clamp01(gates.scarcity, 1) *
    clamp01(gates.intent, 1);

  return {
    candidateScore: Number(candidateScore.toFixed(6)),
    surfaceScore: Number((candidateScore * gateProduct).toFixed(6)),
  };
}

export function rankContexts<T>(
  candidates: Array<{ item: T; features: RetrievalFeatures; gates?: RetrievalGates }>,
): Array<RankedContext<T>> {
  return candidates
    .map(({ item, features, gates }) => ({ item, ...scoreRetrievalCandidate(features, DEFAULT_WEIGHTS, gates) }))
    .sort(
      (left, right) =>
        right.surfaceScore - left.surfaceScore || right.candidateScore - left.candidateScore,
    );
}
