interface UserParticipant {
    name: string;
    seed: number | null;
    school: string | null;
}
interface UserMatch {
    id: string;
    round: string;
    participants: UserParticipant[];
    winner: string | null;
    score: string | null;
    winner_next_match_id: string | null;
    winner_prev_match_id: string | null;
    loser_prev_match_id: string | null;
}
interface UserBracketInput {
    matches: UserMatch[];
}
declare function toBracketInput(user: UserBracketInput, opts?: {
    championshipOnly?: boolean;
}): BracketInput;
declare const USER_BRACKET_RAW: UserBracketInput;
declare const USER_BRACKET: BracketInput;

type MatchId = string;
interface ParticipantRef {
    name: string;
    seed?: number | null;
    school?: string | null;
}
interface Match {
    id: MatchId;
    winnerNextMatchId: MatchId | null;
    loserNextMatchId?: MatchId | null;
    left?: ParticipantRef | null;
    right?: ParticipantRef | null;
    roundHint?: string | null;
}
interface BracketInput {
    matches: Match[];
}
interface LayoutNode {
    id: MatchId;
    x: number;
    y: number;
    round: number;
}
interface LayoutEdge {
    from: MatchId;
    to: MatchId;
    kind: 'winner' | 'loser';
}
interface Layout {
    nodes: LayoutNode[];
    edges: LayoutEdge[];
    rounds: MatchId[][];
}
interface BuildLayoutOptions {
    hGap?: number;
    vGap?: number;
}
/**
 * buildLayout
 * Pure single-elim builder:
 * - Builds rooted tree via winnerNextMatchId edges.
 * - DFS to compute depths; rounds = maxDepth - depth for earliest→finals ordering.
 * - Vertical placement: leaves occupy rows; internal nodes are midpoint of their children.
 * Deterministic: children sorted by id.
 */
declare function buildLayout(input: BracketInput, opts?: BuildLayoutOptions): Layout;

export { type BracketInput, type BuildLayoutOptions, type Layout, type LayoutEdge, type LayoutNode, type Match, type MatchId, type ParticipantRef, USER_BRACKET, USER_BRACKET_RAW, buildLayout, toBracketInput };
