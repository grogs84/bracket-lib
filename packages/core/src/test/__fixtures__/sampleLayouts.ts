import type { BracketInput, Match } from '../../index.js';

// 4-round sample tournament (8 participants -> 4 -> 2 -> 1)
export const SAMPLE_4_ROUND_MATCHES: Match[] = [
  // Round 1 (8 -> 4)
  { id: 'r1m1', winnerNextMatchId: 'r2m1', left: { name: 'Team A', seed: 1 }, right: { name: 'Team H', seed: 8 } },
  { id: 'r1m2', winnerNextMatchId: 'r2m1', left: { name: 'Team D', seed: 4 }, right: { name: 'Team E', seed: 5 } },
  { id: 'r1m3', winnerNextMatchId: 'r2m2', left: { name: 'Team B', seed: 2 }, right: { name: 'Team G', seed: 7 } },
  { id: 'r1m4', winnerNextMatchId: 'r2m2', left: { name: 'Team C', seed: 3 }, right: { name: 'Team F', seed: 6 } },
  
  // Round 2 - Semifinals (4 -> 2)  
  { id: 'r2m1', winnerNextMatchId: 'r3m1', left: null, right: null },
  { id: 'r2m2', winnerNextMatchId: 'r3m1', left: null, right: null },
  
  // Round 3 - Finals (2 -> 1)
  { id: 'r3m1', winnerNextMatchId: null, left: null, right: null }
];

export const SAMPLE_4_ROUND_BRACKET: BracketInput = {
  matches: SAMPLE_4_ROUND_MATCHES
};
