import type { BracketInput, Match } from '../index';

// User data shapes (as pasted)
export interface UserParticipant {
  name: string;
  seed: number | null;
  school: string | null;
}
export interface UserMatch {
  id: string;
  round: string; // e.g., "champ 32", "champ 4", "1st", "consi 16 #1", etc.
  participants: UserParticipant[];
  winner: string | null;
  score: string | null;
  winner_next_match_id: string | null;
  winner_prev_match_id: string | null;
  loser_prev_match_id: string | null;
}
export interface UserBracketInput {
  matches: UserMatch[];
}

// Converter: maps user data → core BracketInput, optionally filtering to championship-only
export function toBracketInput(
  user: UserBracketInput,
  opts: { championshipOnly?: boolean } = { championshipOnly: true }
): BracketInput {
  const useChampOnly = opts.championshipOnly !== false;
  const champRounds = new Set([
    'champ 64',
    'champ 32',
    'champ 16',
    'champ 8',
    'champ 4',
    '1st' // finals
  ]);

  const filtered = useChampOnly
    ? user.matches.filter(m => champRounds.has(m.round))
    : user.matches;

  const roundMap = (r: string | null | undefined): string | null => {
    if (!r) return null;
    if (r === '1st') return 'F';
    if (r.startsWith('champ ')) {
      const n = r.split(' ')[1];
      if (n === '4') return 'SF';
      if (n === '8') return 'QF';
      return `R${n}`; // R16, R32, R64
    }
    return r;
  };

  const toRef = (p: UserParticipant | undefined) =>
    p ? { name: p.name, seed: p.seed, school: p.school } : undefined;

  const mapped: Match[] = filtered.map(m => ({
    id: m.id,
    winnerNextMatchId: m.winner_next_match_id,
    left: toRef(m.participants?.[0]),
    right: toRef(m.participants?.[1]),
    roundHint: roundMap(m.round)
  }));

  return { matches: mapped };
}

// Raw pasted data
export const USER_BRACKET_RAW: UserBracketInput = {
  matches: [
  {
    "id": "464a0d76-fdfc-427e-961c-d46b819f31c4",
    "round": "champ 64",
    "participants": [
      {
        "name": "shane gentry",
        "seed": null,
        "school": "maryland"
      },
      {
        "name": "jarrod patterson",
        "seed": 7,
        "school": "oklahoma"
      }
    ],
    "winner": "jarrod patterson",
    "score": "9-0",
    "winner_next_match_id": "2191c780-1992-4210-82b3-68cc750de59c",
    "winner_prev_match_id": null,
    "loser_prev_match_id": null
  },
  {
    "id": "9691a9d4-5118-4086-8709-1a23934fb748",
    "round": "champ 32",
    "participants": [
      {
        "name": "pat rollins",
        "seed": null,
        "school": "oregon state"
      },
      {
        "name": "alan waters",
        "seed": 3,
        "school": "missouri"
      }
    ],
    "winner": "alan waters",
    "score": "15-0",
    "winner_next_match_id": "f92b8bf4-cab0-457b-86ea-e442c2bb35f4",
    "winner_prev_match_id": null,
    "loser_prev_match_id": null
  },
  {
    "id": "fff64350-d462-446f-b554-30e415b8d9db",
    "round": "champ 32",
    "participants": [
      {
        "name": "levi mele",
        "seed": 9,
        "school": "northwestern (il)"
      },
      {
        "name": "garrett frey",
        "seed": null,
        "school": "princeton (nj)"
      }
    ],
    "winner": "levi mele",
    "score": "Fall 02:38",
    "winner_next_match_id": "d3796f63-044c-45a6-bf38-3d60a7c47006",
    "winner_prev_match_id": null,
    "loser_prev_match_id": null
  },
  {
    "id": "079601b4-a548-4f59-84b1-7767cd956466",
    "round": "champ 32",
    "participants": [
      {
        "name": "tyler iwamura",
        "seed": null,
        "school": "california-bakersfield"
      },
      {
        "name": "steve bonanno",
        "seed": 12,
        "school": "hofstra (ny)"
      }
    ],
    "winner": "steve bonanno",
    "score": "6-3",
    "winner_next_match_id": "4e121cf8-ec55-48b8-b468-5b62d9e098eb",
    "winner_prev_match_id": null,
    "loser_prev_match_id": null
  },
  {
    "id": "fe2a75e2-5844-4181-9afa-1e76b394a2b8",
    "round": "champ 32",
    "participants": [
      {
        "name": "coltin fought",
        "seed": null,
        "school": "north carolina state"
      },
      {
        "name": "anthony zanetta",
        "seed": null,
        "school": "pittsburgh (pa)"
      }
    ],
    "winner": "anthony zanetta",
    "score": "14-4",
    "winner_next_match_id": "f92b8bf4-cab0-457b-86ea-e442c2bb35f4",
    "winner_prev_match_id": null,
    "loser_prev_match_id": null
  },
  {
    "id": "ebe2b011-3d30-4f5b-8944-0fcbc241a893",
    "round": "champ 32",
    "participants": [
      {
        "name": "shane young",
        "seed": null,
        "school": "west virginia"
      },
      {
        "name": "ryan mango",
        "seed": 8,
        "school": "stanford (ca)"
      }
    ],
    "winner": "ryan mango",
    "score": "10-8",
    "winner_next_match_id": "d3796f63-044c-45a6-bf38-3d60a7c47006",
    "winner_prev_match_id": null,
    "loser_prev_match_id": null
  },
  {
    "id": "e5afcfc6-0eed-4b5f-bcd4-bb60b3d031fc",
    "round": "champ 32",
    "participants": [
      {
        "name": "jerome robinson",
        "seed": null,
        "school": "old dominion (va)"
      },
      {
        "name": "jesse delgado",
        "seed": 4,
        "school": "illinois"
      }
    ],
    "winner": "jesse delgado",
    "score": "6-1",
    "winner_next_match_id": "0bce4087-5623-49ad-89bf-d27ff9f55f5f",
    "winner_prev_match_id": null,
    "loser_prev_match_id": null
  },
  {
    "id": "2191c780-1992-4210-82b3-68cc750de59c",
    "round": "champ 32",
    "participants": [
      {
        "name": "max soria",
        "seed": null,
        "school": "buffalo (ny)"
      },
      {
        "name": "jarrod patterson",
        "seed": 7,
        "school": "oklahoma"
      }
    ],
    "winner": "jarrod patterson",
    "score": "6-1",
    "winner_next_match_id": "d3ea7979-e3a9-4f63-ba93-a7547970e2c8",
    "winner_prev_match_id": "464a0d76-fdfc-427e-961c-d46b819f31c4",
    "loser_prev_match_id": null
  },
  {
    "id": "c31bdf8f-b270-42f4-b171-ce887007262b",
    "round": "champ 32",
    "participants": [
      {
        "name": "matt mcdonough",
        "seed": 1,
        "school": "iowa"
      },
      {
        "name": "jared germaine",
        "seed": null,
        "school": "eastern michigan"
      }
    ],
    "winner": "matt mcdonough",
    "score": "Fall 03:24",
    "winner_next_match_id": "f38f3e5a-3ac8-4f89-aca7-f16830136bdd",
    "winner_prev_match_id": null,
    "loser_prev_match_id": null
  },
  {
    "id": "be06dd74-90a9-43a7-9e3f-506ce9100773",
    "round": "champ 32",
    "participants": [
      {
        "name": "johnni dijulius",
        "seed": null,
        "school": "ohio state"
      },
      {
        "name": "matthew snyder",
        "seed": 11,
        "school": "virginia"
      }
    ],
    "winner": "matthew snyder",
    "score": "3-2",
    "winner_next_match_id": "850b0793-422a-4907-bedf-cd01b36a7df3",
    "winner_prev_match_id": null,
    "loser_prev_match_id": null
  },
  {
    "id": "bde45158-b10c-4795-9c58-ef66d45e7be0",
    "round": "champ 32",
    "participants": [
      {
        "name": "nicholas 'nico' megaludis",
        "seed": 10,
        "school": "pennsylvania state"
      },
      {
        "name": "michael martinez",
        "seed": null,
        "school": "wyoming"
      }
    ],
    "winner": "nicholas 'nico' megaludis",
    "score": "13-5",
    "winner_next_match_id": "d3ea7979-e3a9-4f63-ba93-a7547970e2c8",
    "winner_prev_match_id": null,
    "loser_prev_match_id": null
  },
  {
    "id": "bd6ff82f-6d25-4c21-bcb6-0cc1e2fac001",
    "round": "champ 32",
    "participants": [
      {
        "name": "nic bedelyon",
        "seed": 5,
        "school": "kent state (oh)"
      },
      {
        "name": "cory 'ryak' finch",
        "seed": null,
        "school": "iowa state"
      }
    ],
    "winner": "nic bedelyon",
    "score": "13-2",
    "winner_next_match_id": "4e121cf8-ec55-48b8-b468-5b62d9e098eb",
    "winner_prev_match_id": null,
    "loser_prev_match_id": null
  },
  {
    "id": "aff767b7-0264-4934-b2db-4cf35b0296d2",
    "round": "champ 32",
    "participants": [
      {
        "name": "trent sprenkle",
        "seed": null,
        "school": "north dakota state"
      },
      {
        "name": "vince rodriguez",
        "seed": null,
        "school": "george mason (va)"
      }
    ],
    "winner": "trent sprenkle",
    "score": "Fall 02:23",
    "winner_next_match_id": "f38f3e5a-3ac8-4f89-aca7-f16830136bdd",
    "winner_prev_match_id": null,
    "loser_prev_match_id": null
  },
  {
    "id": "3f320708-9610-4f11-82e1-2ad59be853e7",
    "round": "champ 32",
    "participants": [
      {
        "name": "jon morrison",
        "seed": null,
        "school": "oklahoma state"
      },
      {
        "name": "antonio 'tony' gravely",
        "seed": null,
        "school": "appalachian state (nc)"
      }
    ],
    "winner": "jon morrison",
    "score": "16-0",
    "winner_next_match_id": "7fe1fb6f-84c4-4bbd-a349-7dd8d7763351",
    "winner_prev_match_id": null,
    "loser_prev_match_id": null
  },
  {
    "id": "af7b0d7b-1a2b-4502-bdab-cb4c6c49622a",
    "round": "champ 32",
    "participants": [
      {
        "name": "austin miller",
        "seed": null,
        "school": "bucknell (pa)"
      },
      {
        "name": "zach sanders",
        "seed": 2,
        "school": "minnesota"
      }
    ],
    "winner": "zach sanders",
    "score": "Fall 06:00",
    "winner_next_match_id": "7fe1fb6f-84c4-4bbd-a349-7dd8d7763351",
    "winner_prev_match_id": null,
    "loser_prev_match_id": null
  },
  {
    "id": "4aae9a36-0069-4bf0-b606-6db76bffbfb7",
    "round": "champ 32",
    "participants": [
      {
        "name": "erik spjut",
        "seed": null,
        "school": "virginia tech"
      },
      {
        "name": "frank perrelli",
        "seed": 6,
        "school": "cornell (ny)"
      }
    ],
    "winner": "frank perrelli",
    "score": "4-2",
    "winner_next_match_id": "850b0793-422a-4907-bedf-cd01b36a7df3",
    "winner_prev_match_id": null,
    "loser_prev_match_id": null
  },
  {
    "id": "af461551-c6aa-4754-8003-7c5c3e3b74be",
    "round": "champ 32",
    "participants": [
      {
        "name": "camden eppert",
        "seed": null,
        "school": "purdue (in)"
      },
      {
        "name": "joe roth",
        "seed": null,
        "school": "central michigan"
      }
    ],
    "winner": "camden eppert",
    "score": "4-3",
    "winner_next_match_id": "0bce4087-5623-49ad-89bf-d27ff9f55f5f",
    "winner_prev_match_id": null,
    "loser_prev_match_id": null
  },
  {
    "id": "d3796f63-044c-45a6-bf38-3d60a7c47006",
    "round": "champ 16",
    "participants": [
      {
        "name": "levi mele",
        "seed": 9,
        "school": "northwestern (il)"
      },
      {
        "name": "ryan mango",
        "seed": 8,
        "school": "stanford (ca)"
      }
    ],
    "winner": "ryan mango",
    "score": "15-6",
    "winner_next_match_id": "f178651e-ea2a-4786-b319-103dfb7c9931",
    "winner_prev_match_id": "ebe2b011-3d30-4f5b-8944-0fcbc241a893",
    "loser_prev_match_id": "fff64350-d462-446f-b554-30e415b8d9db"
  },
  {
    "id": "0bce4087-5623-49ad-89bf-d27ff9f55f5f",
    "round": "champ 16",
    "participants": [
      {
        "name": "camden eppert",
        "seed": null,
        "school": "purdue (in)"
      },
      {
        "name": "jesse delgado",
        "seed": 4,
        "school": "illinois"
      }
    ],
    "winner": "jesse delgado",
    "score": "Fall 05:12",
    "winner_next_match_id": "328c6836-8b2a-4475-a95f-6a2c7e192710",
    "winner_prev_match_id": "e5afcfc6-0eed-4b5f-bcd4-bb60b3d031fc",
    "loser_prev_match_id": "af461551-c6aa-4754-8003-7c5c3e3b74be"
  },
  {
    "id": "4e121cf8-ec55-48b8-b468-5b62d9e098eb",
    "round": "champ 16",
    "participants": [
      {
        "name": "nic bedelyon",
        "seed": 5,
        "school": "kent state (oh)"
      },
      {
        "name": "steve bonanno",
        "seed": 12,
        "school": "hofstra (ny)"
      }
    ],
    "winner": "nic bedelyon",
    "score": "10-7",
    "winner_next_match_id": "328c6836-8b2a-4475-a95f-6a2c7e192710",
    "winner_prev_match_id": "bd6ff82f-6d25-4c21-bcb6-0cc1e2fac001",
    "loser_prev_match_id": "079601b4-a548-4f59-84b1-7767cd956466"
  },
  {
    "id": "7fe1fb6f-84c4-4bbd-a349-7dd8d7763351",
    "round": "champ 16",
    "participants": [
      {
        "name": "jon morrison",
        "seed": null,
        "school": "oklahoma state"
      },
      {
        "name": "zach sanders",
        "seed": 2,
        "school": "minnesota"
      }
    ],
    "winner": "zach sanders",
    "score": "2-0",
    "winner_next_match_id": "09198a1d-4962-42ee-91af-ac0e6bcccff2",
    "winner_prev_match_id": "af7b0d7b-1a2b-4502-bdab-cb4c6c49622a",
    "loser_prev_match_id": "3f320708-9610-4f11-82e1-2ad59be853e7"
  },
  {
    "id": "850b0793-422a-4907-bedf-cd01b36a7df3",
    "round": "champ 16",
    "participants": [
      {
        "name": "frank perrelli",
        "seed": 6,
        "school": "cornell (ny)"
      },
      {
        "name": "matthew snyder",
        "seed": 11,
        "school": "virginia"
      }
    ],
    "winner": "frank perrelli",
    "score": "4-3",
    "winner_next_match_id": "ea5e0cb2-2a9f-4deb-87c3-e233a727d3e0",
    "winner_prev_match_id": "4aae9a36-0069-4bf0-b606-6db76bffbfb7",
    "loser_prev_match_id": "be06dd74-90a9-43a7-9e3f-506ce9100773"
  },
  {
    "id": "d3ea7979-e3a9-4f63-ba93-a7547970e2c8",
    "round": "champ 16",
    "participants": [
      {
        "name": "jarrod patterson",
        "seed": 7,
        "school": "oklahoma"
      },
      {
        "name": "nicholas 'nico' megaludis",
        "seed": 10,
        "school": "pennsylvania state"
      }
    ],
    "winner": "nicholas 'nico' megaludis",
    "score": "7-3",
    "winner_next_match_id": "09198a1d-4962-42ee-91af-ac0e6bcccff2",
    "winner_prev_match_id": "bde45158-b10c-4795-9c58-ef66d45e7be0",
    "loser_prev_match_id": "2191c780-1992-4210-82b3-68cc750de59c"
  },
  {
    "id": "f38f3e5a-3ac8-4f89-aca7-f16830136bdd",
    "round": "champ 16",
    "participants": [
      {
        "name": "matt mcdonough",
        "seed": 1,
        "school": "iowa"
      },
      {
        "name": "trent sprenkle",
        "seed": null,
        "school": "north dakota state"
      }
    ],
    "winner": "matt mcdonough",
    "score": "Fall 02:56",
    "winner_next_match_id": "f178651e-ea2a-4786-b319-103dfb7c9931",
    "winner_prev_match_id": "c31bdf8f-b270-42f4-b171-ce887007262b",
    "loser_prev_match_id": "aff767b7-0264-4934-b2db-4cf35b0296d2"
  },
  {
    "id": "f92b8bf4-cab0-457b-86ea-e442c2bb35f4",
    "round": "champ 16",
    "participants": [
      {
        "name": "alan waters",
        "seed": 3,
        "school": "missouri"
      },
      {
        "name": "anthony zanetta",
        "seed": null,
        "school": "pittsburgh (pa)"
      }
    ],
    "winner": "anthony zanetta",
    "score": "4-2",
    "winner_next_match_id": "ea5e0cb2-2a9f-4deb-87c3-e233a727d3e0",
    "winner_prev_match_id": "fe2a75e2-5844-4181-9afa-1e76b394a2b8",
    "loser_prev_match_id": "9691a9d4-5118-4086-8709-1a23934fb748"
  },
  {
    "id": "f178651e-ea2a-4786-b319-103dfb7c9931",
    "round": "champ 8",
    "participants": [
      {
        "name": "matt mcdonough",
        "seed": 1,
        "school": "iowa"
      },
      {
        "name": "ryan mango",
        "seed": 8,
        "school": "stanford (ca)"
      }
    ],
    "winner": "matt mcdonough",
    "score": "13-3",
    "winner_next_match_id": "ecc03357-62d3-48ce-a067-6f2a692ff0bf",
    "winner_prev_match_id": "f38f3e5a-3ac8-4f89-aca7-f16830136bdd",
    "loser_prev_match_id": "d3796f63-044c-45a6-bf38-3d60a7c47006"
  },
  {
    "id": "ea5e0cb2-2a9f-4deb-87c3-e233a727d3e0",
    "round": "champ 8",
    "participants": [
      {
        "name": "anthony zanetta",
        "seed": null,
        "school": "pittsburgh (pa)"
      },
      {
        "name": "frank perrelli",
        "seed": 6,
        "school": "cornell (ny)"
      }
    ],
    "winner": "frank perrelli",
    "score": "6-3",
    "winner_next_match_id": "01cb0dba-6dd2-4d68-b1f1-c3d4a43b5174",
    "winner_prev_match_id": "850b0793-422a-4907-bedf-cd01b36a7df3",
    "loser_prev_match_id": "f92b8bf4-cab0-457b-86ea-e442c2bb35f4"
  },
  {
    "id": "09198a1d-4962-42ee-91af-ac0e6bcccff2",
    "round": "champ 8",
    "participants": [
      {
        "name": "nicholas 'nico' megaludis",
        "seed": 10,
        "school": "pennsylvania state"
      },
      {
        "name": "zach sanders",
        "seed": 2,
        "school": "minnesota"
      }
    ],
    "winner": "nicholas 'nico' megaludis",
    "score": "7-4",
    "winner_next_match_id": "01cb0dba-6dd2-4d68-b1f1-c3d4a43b5174",
    "winner_prev_match_id": "d3ea7979-e3a9-4f63-ba93-a7547970e2c8",
    "loser_prev_match_id": "7fe1fb6f-84c4-4bbd-a349-7dd8d7763351"
  },
  {
    "id": "328c6836-8b2a-4475-a95f-6a2c7e192710",
    "round": "champ 8",
    "participants": [
      {
        "name": "nic bedelyon",
        "seed": 5,
        "school": "kent state (oh)"
      },
      {
        "name": "jesse delgado",
        "seed": 4,
        "school": "illinois"
      }
    ],
    "winner": "nic bedelyon",
    "score": "8-5",
    "winner_next_match_id": "ecc03357-62d3-48ce-a067-6f2a692ff0bf",
    "winner_prev_match_id": "4e121cf8-ec55-48b8-b468-5b62d9e098eb",
    "loser_prev_match_id": "0bce4087-5623-49ad-89bf-d27ff9f55f5f"
  },
  {
    "id": "ecc03357-62d3-48ce-a067-6f2a692ff0bf",
    "round": "champ 4",
    "participants": [
      {
        "name": "nic bedelyon",
        "seed": 5,
        "school": "kent state (oh)"
      },
      {
        "name": "matt mcdonough",
        "seed": 1,
        "school": "iowa"
      }
    ],
    "winner": "matt mcdonough",
    "score": "15-7",
    "winner_next_match_id": "284eef04-d45f-4bf8-b7e3-015ae7e40c53",
    "winner_prev_match_id": "f178651e-ea2a-4786-b319-103dfb7c9931",
    "loser_prev_match_id": "328c6836-8b2a-4475-a95f-6a2c7e192710"
  },
  {
    "id": "01cb0dba-6dd2-4d68-b1f1-c3d4a43b5174",
    "round": "champ 4",
    "participants": [
      {
        "name": "frank perrelli",
        "seed": 6,
        "school": "cornell (ny)"
      },
      {
        "name": "nicholas 'nico' megaludis",
        "seed": 10,
        "school": "pennsylvania state"
      }
    ],
    "winner": "nicholas 'nico' megaludis",
    "score": "3-2",
    "winner_next_match_id": "284eef04-d45f-4bf8-b7e3-015ae7e40c53",
    "winner_prev_match_id": "09198a1d-4962-42ee-91af-ac0e6bcccff2",
    "loser_prev_match_id": "ea5e0cb2-2a9f-4deb-87c3-e233a727d3e0"
  },
  {
    "id": "284eef04-d45f-4bf8-b7e3-015ae7e40c53",
    "round": "1st",
    "participants": [
      {
        "name": "matt mcdonough",
        "seed": 1,
        "school": "iowa"
      },
      {
        "name": "nicholas 'nico' megaludis",
        "seed": 10,
        "school": "pennsylvania state"
      }
    ],
    "winner": "matt mcdonough",
    "score": "4-1",
    "winner_next_match_id": null,
    "winner_prev_match_id": "ecc03357-62d3-48ce-a067-6f2a692ff0bf",
    "loser_prev_match_id": "01cb0dba-6dd2-4d68-b1f1-c3d4a43b5174"
  },
  {
    "id": "c91050e1-80f0-4518-bf31-22d1ca3c140e",
    "round": "consi 32 #2",
    "participants": [
      {
        "name": "shane gentry",
        "seed": null,
        "school": "maryland"
      },
      {
        "name": "shane young",
        "seed": null,
        "school": "west virginia"
      }
    ],
    "winner": "shane young",
    "score": "7-5",
    "winner_next_match_id": "139dd5b5-e306-42bf-94e1-998c02ff5218",
    "winner_prev_match_id": null,
    "loser_prev_match_id": null
  },
  {
    "id": "57a16ec4-870d-4cab-a0fe-0d74df3aad37",
    "round": "consi 16 #1",
    "participants": [
      {
        "name": "erik spjut",
        "seed": null,
        "school": "virginia tech"
      },
      {
        "name": "johnni dijulius",
        "seed": null,
        "school": "ohio state"
      }
    ],
    "winner": "erik spjut",
    "score": "10-4",
    "winner_next_match_id": "2448ac93-8153-42e0-a041-86c64277316f",
    "winner_prev_match_id": null,
    "loser_prev_match_id": null
  },
  {
    "id": "d8859906-d871-471c-9448-75664be49a26",
    "round": "consi 16 #1",
    "participants": [
      {
        "name": "jerome robinson",
        "seed": null,
        "school": "old dominion (va)"
      },
      {
        "name": "joe roth",
        "seed": null,
        "school": "central michigan"
      }
    ],
    "winner": "joe roth",
    "score": "12-3",
    "winner_next_match_id": "ff8e7e30-1ab4-4300-a55b-a091e982fc18",
    "winner_prev_match_id": null,
    "loser_prev_match_id": null
  },
  {
    "id": "57757693-ff31-40f3-890e-e1a3ffa4cd27",
    "round": "consi 16 #1",
    "participants": [
      {
        "name": "austin miller",
        "seed": null,
        "school": "bucknell (pa)"
      },
      {
        "name": "antonio 'tony' gravely",
        "seed": null,
        "school": "appalachian state (nc)"
      }
    ],
    "winner": "antonio 'tony' gravely",
    "score": "13-10",
    "winner_next_match_id": "de8f0834-8335-43ac-b416-f8b6807e02a8",
    "winner_prev_match_id": null,
    "loser_prev_match_id": null
  },
  {
    "id": "cf8257d9-f799-49ee-a233-d8a8020a03ec",
    "round": "consi 16 #1",
    "participants": [
      {
        "name": "max soria",
        "seed": null,
        "school": "buffalo (ny)"
      },
      {
        "name": "michael martinez",
        "seed": null,
        "school": "wyoming"
      }
    ],
    "winner": "michael martinez",
    "score": "7-2",
    "winner_next_match_id": "8e00f8f3-2303-4380-ba4b-9da06313f099",
    "winner_prev_match_id": null,
    "loser_prev_match_id": null
  },
  {
    "id": "139dd5b5-e306-42bf-94e1-998c02ff5218",
    "round": "consi 16 #1",
    "participants": [
      {
        "name": "garrett frey",
        "seed": null,
        "school": "princeton (nj)"
      },
      {
        "name": "shane young",
        "seed": null,
        "school": "west virginia"
      }
    ],
    "winner": "garrett frey",
    "score": "8-2",
    "winner_next_match_id": "49496e8f-0302-4b4e-990f-d383517acff6",
    "winner_prev_match_id": null,
    "loser_prev_match_id": "c91050e1-80f0-4518-bf31-22d1ca3c140e"
  },
  {
    "id": "4d308f8a-cc5a-4a6c-90ff-c2488d96053a",
    "round": "consi 16 #1",
    "participants": [
      {
        "name": "coltin fought",
        "seed": null,
        "school": "north carolina state"
      },
      {
        "name": "pat rollins",
        "seed": null,
        "school": "oregon state"
      }
    ],
    "winner": "pat rollins",
    "score": "3-2",
    "winner_next_match_id": "c0070d62-3e39-4e37-9fb9-f43534ebd65b",
    "winner_prev_match_id": null,
    "loser_prev_match_id": null
  },
  {
    "id": "414245c4-8b3d-4445-b2e9-7d664b75c08a",
    "round": "consi 16 #1",
    "participants": [
      {
        "name": "vince rodriguez",
        "seed": null,
        "school": "george mason (va)"
      },
      {
        "name": "jared germaine",
        "seed": null,
        "school": "eastern michigan"
      }
    ],
    "winner": "jared germaine",
    "score": "4-1",
    "winner_next_match_id": "5afce0bb-8aa3-47e0-af2e-1e922525136e",
    "winner_prev_match_id": null,
    "loser_prev_match_id": null
  },
  {
    "id": "82a241a1-8ad4-4e76-b914-a3e9365b8a71",
    "round": "consi 16 #1",
    "participants": [
      {
        "name": "tyler iwamura",
        "seed": null,
        "school": "california-bakersfield"
      },
      {
        "name": "cory 'ryak' finch",
        "seed": null,
        "school": "iowa state"
      }
    ],
    "winner": "cory 'ryak' finch",
    "score": "Fall 00:52",
    "winner_next_match_id": "cb1373e5-0ac2-41a6-a90a-06d12db5e21e",
    "winner_prev_match_id": null,
    "loser_prev_match_id": null
  },
  {
    "id": "5afce0bb-8aa3-47e0-af2e-1e922525136e",
    "round": "consi 16 #2",
    "participants": [
      {
        "name": "jared germaine",
        "seed": null,
        "school": "eastern michigan"
      },
      {
        "name": "matthew snyder",
        "seed": 11,
        "school": "virginia"
      }
    ],
    "winner": "matthew snyder",
    "score": "Fall 05:24",
    "winner_next_match_id": "1ef6c190-2784-4bc6-8995-c080c0e261f2",
    "winner_prev_match_id": null,
    "loser_prev_match_id": "414245c4-8b3d-4445-b2e9-7d664b75c08a"
  },
  {
    "id": "ff8e7e30-1ab4-4300-a55b-a091e982fc18",
    "round": "consi 16 #2",
    "participants": [
      {
        "name": "joe roth",
        "seed": null,
        "school": "central michigan"
      },
      {
        "name": "jarrod patterson",
        "seed": 7,
        "school": "oklahoma"
      }
    ],
    "winner": "jarrod patterson",
    "score": "6-3",
    "winner_next_match_id": "1c55a966-a9b2-4fc0-bfb2-7c3ed74c34f1",
    "winner_prev_match_id": null,
    "loser_prev_match_id": "d8859906-d871-471c-9448-75664be49a26"
  },
  {
    "id": "8e00f8f3-2303-4380-ba4b-9da06313f099",
    "round": "consi 16 #2",
    "participants": [
      {
        "name": "camden eppert",
        "seed": null,
        "school": "purdue (in)"
      },
      {
        "name": "michael martinez",
        "seed": null,
        "school": "wyoming"
      }
    ],
    "winner": "camden eppert",
    "score": "6-3",
    "winner_next_match_id": "b39c0664-b695-436f-a99f-35472302ef1b",
    "winner_prev_match_id": null,
    "loser_prev_match_id": "cf8257d9-f799-49ee-a233-d8a8020a03ec"
  },
  {
    "id": "49496e8f-0302-4b4e-990f-d383517acff6",
    "round": "consi 16 #2",
    "participants": [
      {
        "name": "garrett frey",
        "seed": null,
        "school": "princeton (nj)"
      },
      {
        "name": "alan waters",
        "seed": 3,
        "school": "missouri"
      }
    ],
    "winner": "alan waters",
    "score": "15-0",
    "winner_next_match_id": "1ef6c190-2784-4bc6-8995-c080c0e261f2",
    "winner_prev_match_id": null,
    "loser_prev_match_id": "139dd5b5-e306-42bf-94e1-998c02ff5218"
  },
  {
    "id": "2448ac93-8153-42e0-a041-86c64277316f",
    "round": "consi 16 #2",
    "participants": [
      {
        "name": "trent sprenkle",
        "seed": null,
        "school": "north dakota state"
      },
      {
        "name": "erik spjut",
        "seed": null,
        "school": "virginia tech"
      }
    ],
    "winner": "trent sprenkle",
    "score": "2-1",
    "winner_next_match_id": "e441ceb6-544e-442d-9d51-e75a934150b4",
    "winner_prev_match_id": null,
    "loser_prev_match_id": "57a16ec4-870d-4cab-a0fe-0d74df3aad37"
  },
  {
    "id": "c0070d62-3e39-4e37-9fb9-f43534ebd65b",
    "round": "consi 16 #2",
    "participants": [
      {
        "name": "pat rollins",
        "seed": null,
        "school": "oregon state"
      },
      {
        "name": "levi mele",
        "seed": 9,
        "school": "northwestern (il)"
      }
    ],
    "winner": "pat rollins",
    "score": "6-4",
    "winner_next_match_id": "e441ceb6-544e-442d-9d51-e75a934150b4",
    "winner_prev_match_id": "4d308f8a-cc5a-4a6c-90ff-c2488d96053a",
    "loser_prev_match_id": null
  },
  {
    "id": "cb1373e5-0ac2-41a6-a90a-06d12db5e21e",
    "round": "consi 16 #2",
    "participants": [
      {
        "name": "cory 'ryak' finch",
        "seed": null,
        "school": "iowa state"
      },
      {
        "name": "jon morrison",
        "seed": null,
        "school": "oklahoma state"
      }
    ],
    "winner": "jon morrison",
    "score": "4-0",
    "winner_next_match_id": "1c55a966-a9b2-4fc0-bfb2-7c3ed74c34f1",
    "winner_prev_match_id": null,
    "loser_prev_match_id": "82a241a1-8ad4-4e76-b914-a3e9365b8a71"
  },
  {
    "id": "de8f0834-8335-43ac-b416-f8b6807e02a8",
    "round": "consi 16 #2",
    "participants": [
      {
        "name": "steve bonanno",
        "seed": 12,
        "school": "hofstra (ny)"
      },
      {
        "name": "antonio 'tony' gravely",
        "seed": null,
        "school": "appalachian state (nc)"
      }
    ],
    "winner": "steve bonanno",
    "score": "15-2",
    "winner_next_match_id": "b39c0664-b695-436f-a99f-35472302ef1b",
    "winner_prev_match_id": null,
    "loser_prev_match_id": "57757693-ff31-40f3-890e-e1a3ffa4cd27"
  },
  {
    "id": "1c55a966-a9b2-4fc0-bfb2-7c3ed74c34f1",
    "round": "consi 8 #1",
    "participants": [
      {
        "name": "jon morrison",
        "seed": null,
        "school": "oklahoma state"
      },
      {
        "name": "jarrod patterson",
        "seed": 7,
        "school": "oklahoma"
      }
    ],
    "winner": "jarrod patterson",
    "score": "3-2",
    "winner_next_match_id": "e9d57a03-1f26-4d90-ae2b-601e7fb90670",
    "winner_prev_match_id": "ff8e7e30-1ab4-4300-a55b-a091e982fc18",
    "loser_prev_match_id": "cb1373e5-0ac2-41a6-a90a-06d12db5e21e"
  },
  {
    "id": "e441ceb6-544e-442d-9d51-e75a934150b4",
    "round": "consi 8 #1",
    "participants": [
      {
        "name": "pat rollins",
        "seed": null,
        "school": "oregon state"
      },
      {
        "name": "trent sprenkle",
        "seed": null,
        "school": "north dakota state"
      }
    ],
    "winner": "trent sprenkle",
    "score": "9-1",
    "winner_next_match_id": "4bffd246-2ba4-4e1d-b131-cae6a6b2d7d4",
    "winner_prev_match_id": "2448ac93-8153-42e0-a041-86c64277316f",
    "loser_prev_match_id": "c0070d62-3e39-4e37-9fb9-f43534ebd65b"
  },
  {
    "id": "1ef6c190-2784-4bc6-8995-c080c0e261f2",
    "round": "consi 8 #1",
    "participants": [
      {
        "name": "alan waters",
        "seed": 3,
        "school": "missouri"
      },
      {
        "name": "matthew snyder",
        "seed": 11,
        "school": "virginia"
      }
    ],
    "winner": "alan waters",
    "score": "4-1",
    "winner_next_match_id": "4f67ecc9-9093-430b-94c5-dc64460807e6",
    "winner_prev_match_id": "49496e8f-0302-4b4e-990f-d383517acff6",
    "loser_prev_match_id": "5afce0bb-8aa3-47e0-af2e-1e922525136e"
  },
  {
    "id": "b39c0664-b695-436f-a99f-35472302ef1b",
    "round": "consi 8 #1",
    "participants": [
      {
        "name": "steve bonanno",
        "seed": 12,
        "school": "hofstra (ny)"
      },
      {
        "name": "camden eppert",
        "seed": null,
        "school": "purdue (in)"
      }
    ],
    "winner": "steve bonanno",
    "score": "11-4",
    "winner_next_match_id": "708f75e7-b0ca-414e-8948-6e564599893e",
    "winner_prev_match_id": "de8f0834-8335-43ac-b416-f8b6807e02a8",
    "loser_prev_match_id": "8e00f8f3-2303-4380-ba4b-9da06313f099"
  },
  {
    "id": "4bffd246-2ba4-4e1d-b131-cae6a6b2d7d4",
    "round": "consi 8 #2",
    "participants": [
      {
        "name": "trent sprenkle",
        "seed": null,
        "school": "north dakota state"
      },
      {
        "name": "zach sanders",
        "seed": 2,
        "school": "minnesota"
      }
    ],
    "winner": "zach sanders",
    "score": "5-4",
    "winner_next_match_id": "d0c60f0c-d7fc-4b2f-971f-5cfdc0fde7a4",
    "winner_prev_match_id": null,
    "loser_prev_match_id": "e441ceb6-544e-442d-9d51-e75a934150b4"
  },
  {
    "id": "4f67ecc9-9093-430b-94c5-dc64460807e6",
    "round": "consi 8 #2",
    "participants": [
      {
        "name": "alan waters",
        "seed": 3,
        "school": "missouri"
      },
      {
        "name": "jesse delgado",
        "seed": 4,
        "school": "illinois"
      }
    ],
    "winner": "jesse delgado",
    "score": "5-2",
    "winner_next_match_id": "d592b580-398b-40bb-a468-0ad7641f1a38",
    "winner_prev_match_id": null,
    "loser_prev_match_id": "1ef6c190-2784-4bc6-8995-c080c0e261f2"
  },
  {
    "id": "708f75e7-b0ca-414e-8948-6e564599893e",
    "round": "consi 8 #2",
    "participants": [
      {
        "name": "steve bonanno",
        "seed": 12,
        "school": "hofstra (ny)"
      },
      {
        "name": "anthony zanetta",
        "seed": null,
        "school": "pittsburgh (pa)"
      }
    ],
    "winner": "steve bonanno",
    "score": "10-4",
    "winner_next_match_id": "d0c60f0c-d7fc-4b2f-971f-5cfdc0fde7a4",
    "winner_prev_match_id": "b39c0664-b695-436f-a99f-35472302ef1b",
    "loser_prev_match_id": null
  },
  {
    "id": "e9d57a03-1f26-4d90-ae2b-601e7fb90670",
    "round": "consi 8 #2",
    "participants": [
      {
        "name": "ryan mango",
        "seed": 8,
        "school": "stanford (ca)"
      },
      {
        "name": "jarrod patterson",
        "seed": 7,
        "school": "oklahoma"
      }
    ],
    "winner": "ryan mango",
    "score": "12-4",
    "winner_next_match_id": "d592b580-398b-40bb-a468-0ad7641f1a38",
    "winner_prev_match_id": null,
    "loser_prev_match_id": "1c55a966-a9b2-4fc0-bfb2-7c3ed74c34f1"
  },
  {
    "id": "d0c60f0c-d7fc-4b2f-971f-5cfdc0fde7a4",
    "round": "consi 4 #1",
    "participants": [
      {
        "name": "steve bonanno",
        "seed": 12,
        "school": "hofstra (ny)"
      },
      {
        "name": "zach sanders",
        "seed": 2,
        "school": "minnesota"
      }
    ],
    "winner": "zach sanders",
    "score": "9-4",
    "winner_next_match_id": "8d63c463-fc50-4243-b550-0601444d4e18",
    "winner_prev_match_id": "4bffd246-2ba4-4e1d-b131-cae6a6b2d7d4",
    "loser_prev_match_id": "708f75e7-b0ca-414e-8948-6e564599893e"
  },
  {
    "id": "d592b580-398b-40bb-a468-0ad7641f1a38",
    "round": "consi 4 #1",
    "participants": [
      {
        "name": "ryan mango",
        "seed": 8,
        "school": "stanford (ca)"
      },
      {
        "name": "jesse delgado",
        "seed": 4,
        "school": "illinois"
      }
    ],
    "winner": "ryan mango",
    "score": "4-3",
    "winner_next_match_id": "28eb5a70-036f-4176-a28d-b8d04a278c28",
    "winner_prev_match_id": "e9d57a03-1f26-4d90-ae2b-601e7fb90670",
    "loser_prev_match_id": "4f67ecc9-9093-430b-94c5-dc64460807e6"
  },
  {
    "id": "28eb5a70-036f-4176-a28d-b8d04a278c28",
    "round": "consi 4 #2",
    "participants": [
      {
        "name": "ryan mango",
        "seed": 8,
        "school": "stanford (ca)"
      },
      {
        "name": "frank perrelli",
        "seed": 6,
        "school": "cornell (ny)"
      }
    ],
    "winner": "frank perrelli",
    "score": "10-3",
    "winner_next_match_id": "224d7ea2-4a1a-43fc-895c-a1bf513a986d",
    "winner_prev_match_id": null,
    "loser_prev_match_id": "d592b580-398b-40bb-a468-0ad7641f1a38"
  },
  {
    "id": "8d63c463-fc50-4243-b550-0601444d4e18",
    "round": "consi 4 #2",
    "participants": [
      {
        "name": "nic bedelyon",
        "seed": 5,
        "school": "kent state (oh)"
      },
      {
        "name": "zach sanders",
        "seed": 2,
        "school": "minnesota"
      }
    ],
    "winner": "zach sanders",
    "score": "9-4",
    "winner_next_match_id": "224d7ea2-4a1a-43fc-895c-a1bf513a986d",
    "winner_prev_match_id": "d0c60f0c-d7fc-4b2f-971f-5cfdc0fde7a4",
    "loser_prev_match_id": null
  },
  {
    "id": "224d7ea2-4a1a-43fc-895c-a1bf513a986d",
    "round": "3rd",
    "participants": [
      {
        "name": "frank perrelli",
        "seed": 6,
        "school": "cornell (ny)"
      },
      {
        "name": "zach sanders",
        "seed": 2,
        "school": "minnesota"
      }
    ],
    "winner": "zach sanders",
    "score": "6-4",
    "winner_next_match_id": null,
    "winner_prev_match_id": "8d63c463-fc50-4243-b550-0601444d4e18",
    "loser_prev_match_id": "28eb5a70-036f-4176-a28d-b8d04a278c28"
  },
  {
    "id": "8ec1d409-b176-49dc-96d5-9f323b299f20",
    "round": "5th",
    "participants": [
      {
        "name": "nic bedelyon",
        "seed": 5,
        "school": "kent state (oh)"
      },
      {
        "name": "ryan mango",
        "seed": 8,
        "school": "stanford (ca)"
      }
    ],
    "winner": "ryan mango",
    "score": "6-4",
    "winner_next_match_id": null,
    "winner_prev_match_id": null,
    "loser_prev_match_id": null
  },
  {
    "id": "aacaa324-52b7-4121-a8b6-2b0e546950b2",
    "round": "7th",
    "participants": [
      {
        "name": "steve bonanno",
        "seed": 12,
        "school": "hofstra (ny)"
      },
      {
        "name": "jesse delgado",
        "seed": 4,
        "school": "illinois"
      }
    ],
    "winner": "jesse delgado",
    "score": "3-1",
    "winner_next_match_id": null,
    "winner_prev_match_id": null,
    "loser_prev_match_id": null
  }
  ]
};

// Canonical core input (championship-only by default)
export const USER_BRACKET: BracketInput = toBracketInput(USER_BRACKET_RAW, { championshipOnly: true });