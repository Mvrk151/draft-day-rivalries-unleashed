
import { Draft, FootballPlayer, DraftTeam } from "@/types";

// Mock football players
export const mockPlayers: FootballPlayer[] = [
  // Premier League - Man City
  { id: "p1", name: "Erling Haaland", position: "FWD", team: "Manchester City", league: "Premier League" },
  { id: "p2", name: "Phil Foden", position: "MID", team: "Manchester City", league: "Premier League" },
  { id: "p3", name: "Rodri", position: "MID", team: "Manchester City", league: "Premier League" },
  { id: "p4", name: "Ederson", position: "GK", team: "Manchester City", league: "Premier League" },
  
  // Premier League - Liverpool
  { id: "p5", name: "Mohamed Salah", position: "FWD", team: "Liverpool", league: "Premier League" },
  { id: "p6", name: "Virgil van Dijk", position: "DEF", team: "Liverpool", league: "Premier League" },
  { id: "p7", name: "Alisson", position: "GK", team: "Liverpool", league: "Premier League" },
  { id: "p8", name: "Trent Alexander-Arnold", position: "DEF", team: "Liverpool", league: "Premier League" },
  
  // Premier League - Arsenal
  { id: "p9", name: "Bukayo Saka", position: "FWD", team: "Arsenal", league: "Premier League" },
  { id: "p10", name: "Martin Ødegaard", position: "MID", team: "Arsenal", league: "Premier League" },
  { id: "p11", name: "William Saliba", position: "DEF", team: "Arsenal", league: "Premier League" },
  { id: "p12", name: "David Raya", position: "GK", team: "Arsenal", league: "Premier League" },
  
  // La Liga - Real Madrid
  { id: "p13", name: "Vinícius Júnior", position: "FWD", team: "Real Madrid", league: "La Liga" },
  { id: "p14", name: "Jude Bellingham", position: "MID", team: "Real Madrid", league: "La Liga" },
  { id: "p15", name: "Thibaut Courtois", position: "GK", team: "Real Madrid", league: "La Liga" },
  { id: "p16", name: "Antonio Rüdiger", position: "DEF", team: "Real Madrid", league: "La Liga" },
  
  // La Liga - Barcelona
  { id: "p17", name: "Robert Lewandowski", position: "FWD", team: "Barcelona", league: "La Liga" },
  { id: "p18", name: "Pedri", position: "MID", team: "Barcelona", league: "La Liga" },
  { id: "p19", name: "Ronald Araújo", position: "DEF", team: "Barcelona", league: "La Liga" },
  { id: "p20", name: "Marc-André ter Stegen", position: "GK", team: "Barcelona", league: "La Liga" },
  
  // Serie A - Inter
  { id: "p21", name: "Lautaro Martínez", position: "FWD", team: "Inter Milan", league: "Serie A" },
  { id: "p22", name: "Hakan Çalhanoğlu", position: "MID", team: "Inter Milan", league: "Serie A" },
  { id: "p23", name: "Alessandro Bastoni", position: "DEF", team: "Inter Milan", league: "Serie A" },
  
  // Serie A - Juventus
  { id: "p24", name: "Dušan Vlahović", position: "FWD", team: "Juventus", league: "Serie A" },
  { id: "p25", name: "Gleison Bremer", position: "DEF", team: "Juventus", league: "Serie A" },
  
  // Bundesliga - Bayern Munich
  { id: "p26", name: "Harry Kane", position: "FWD", team: "Bayern Munich", league: "Bundesliga" },
  { id: "p27", name: "Jamal Musiala", position: "MID", team: "Bayern Munich", league: "Bundesliga" },
  { id: "p28", name: "Manuel Neuer", position: "GK", team: "Bayern Munich", league: "Bundesliga" },
  
  // Bundesliga - Dortmund
  { id: "p29", name: "Karim Adeyemi", position: "FWD", team: "Borussia Dortmund", league: "Bundesliga" },
  { id: "p30", name: "Mats Hummels", position: "DEF", team: "Borussia Dortmund", league: "Bundesliga" },
  
  // Ligue 1 - PSG
  { id: "p31", name: "Kylian Mbappé", position: "FWD", team: "PSG", league: "Ligue 1" },
  { id: "p32", name: "Gianluigi Donnarumma", position: "GK", team: "PSG", league: "Ligue 1" },
  
  // Additional players to fill out positions
  { id: "p33", name: "Kevin De Bruyne", position: "MID", team: "Manchester City", league: "Premier League" },
  { id: "p34", name: "Bruno Fernandes", position: "MID", team: "Manchester United", league: "Premier League" },
  { id: "p35", name: "Son Heung-min", position: "FWD", team: "Tottenham", league: "Premier League" },
  { id: "p36", name: "Reece James", position: "DEF", team: "Chelsea", league: "Premier League" },
  { id: "p37", name: "Declan Rice", position: "MID", team: "Arsenal", league: "Premier League" },
  { id: "p38", name: "Thiago Silva", position: "DEF", team: "Chelsea", league: "Premier League" },
  { id: "p39", name: "Andy Robertson", position: "DEF", team: "Liverpool", league: "Premier League" },
  { id: "p40", name: "Diogo Jota", position: "FWD", team: "Liverpool", league: "Premier League" },
  { id: "p41", name: "Rúben Dias", position: "DEF", team: "Manchester City", league: "Premier League" },
  { id: "p42", name: "İlkay Gündoğan", position: "MID", team: "Barcelona", league: "La Liga" },
  { id: "p43", name: "Jules Koundé", position: "DEF", team: "Barcelona", league: "La Liga" },
  { id: "p44", name: "Ferran Torres", position: "FWD", team: "Barcelona", league: "La Liga" },
  { id: "p45", name: "Federico Valverde", position: "MID", team: "Real Madrid", league: "La Liga" },
  { id: "p46", name: "Rodrygo", position: "FWD", team: "Real Madrid", league: "La Liga" },
  { id: "p47", name: "David Alaba", position: "DEF", team: "Real Madrid", league: "La Liga" },
  { id: "p48", name: "Victor Osimhen", position: "FWD", team: "Napoli", league: "Serie A" },
  { id: "p49", name: "Rafael Leão", position: "FWD", team: "AC Milan", league: "Serie A" },
  { id: "p50", name: "Fikayo Tomori", position: "DEF", team: "AC Milan", league: "Serie A" },
];

// Mock drafts (empty initially)
export const mockDrafts: Draft[] = [];

// Function to filter players by league mode
export const getPlayersByMode = (mode: string): FootballPlayer[] => {
  switch (mode) {
    case 'premier_league':
      return mockPlayers.filter(player => player.league === 'Premier League');
    case 'champions_league':
      // For this demo, we'll consider certain teams as being in the Champions League
      const championsLeagueTeams = [
        'Manchester City', 'Liverpool', 'Real Madrid', 'Barcelona', 
        'Bayern Munich', 'Inter Milan', 'PSG', 'Borussia Dortmund'
      ];
      return mockPlayers.filter(player => championsLeagueTeams.includes(player.team));
    case 'top_5_leagues':
      return mockPlayers; // All players are from top 5 leagues in our mock data
    default:
      return mockPlayers;
  }
};

// Function to create a new draft
export const createDraft = (
  name: string,
  mode: Draft['mode'],
  numberOfTeams: number,
  userId: string,
  username: string
): Draft => {
  const draft: Draft = {
    id: Math.random().toString(36).substr(2, 9),
    name,
    mode,
    teams: Array(numberOfTeams).fill(null).map((_, i) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: i === 0 ? `${username}'s Team` : `Team ${i + 1}`,
      owner: i === 0 ? { id: userId, username, email: '' } : { id: `user-${i}`, username: `Player ${i}`, email: '' },
      players: []
    })),
    status: 'setup',
    currentTeamIndex: 0,
    createdAt: new Date(),
  };
  
  mockDrafts.push(draft);
  return draft;
};

// Function to select a player in the draft
export const selectPlayer = (
  draftId: string, 
  playerId: string, 
  teamId: string, 
  specificPosition?: string
): Draft | null => {
  const draftIndex = mockDrafts.findIndex(d => d.id === draftId);
  if (draftIndex === -1) return null;
  
  const draft = {...mockDrafts[draftIndex]};
  const playerIndex = mockPlayers.findIndex(p => p.id === playerId);
  if (playerIndex === -1) return null;
  
  const player = {...mockPlayers[playerIndex]};
  const teamIndex = draft.teams.findIndex(t => t.id === teamId);
  if (teamIndex === -1) return null;
  
  // Check if team already has max players from this real team
  const sameTeamCount = draft.teams[teamIndex].players.filter(p => p.team === player.team).length;
  if (sameTeamCount >= 2) {
    throw new Error('Maximum 2 players from the same team allowed');
  }
  
  // Set specific position if provided
  if (specificPosition) {
    player.specificPosition = specificPosition as any;
  }
  
  // Check if position is valid for this player's general position
  const positionMap: Record<string, string[]> = {
    'GK': ['GK'],
    'DEF': ['LB', 'LCB', 'RCB', 'RB'],
    'MID': ['LCM', 'CAM', 'RCM'],
    'FWD': ['LW', 'ST', 'RW']
  };
  
  if (specificPosition && !positionMap[player.position].includes(specificPosition)) {
    throw new Error(`This player cannot play as ${specificPosition}`);
  }
  
  // Check if team already has enough players of this position
  const positionCount = draft.teams[teamIndex].players.filter(p => p.position === player.position).length;
  const maxPositionCounts = {
    GK: 1,
    DEF: 4,
    MID: 3,
    FWD: 3
  };
  
  if (positionCount >= maxPositionCounts[player.position]) {
    throw new Error(`Maximum ${maxPositionCounts[player.position]} ${player.position} players allowed`);
  }
  
  // Check if specific position is already taken by this team
  if (specificPosition && draft.teams[teamIndex].players.some(p => p.specificPosition === specificPosition)) {
    throw new Error(`Position ${specificPosition} is already filled`);
  }
  
  // Add player to team
  draft.teams[teamIndex].players.push(player);
  
  // Move to next team's turn
  draft.currentTeamIndex = (draft.currentTeamIndex + 1) % draft.teams.length;
  
  // Check if draft is complete
  const isComplete = draft.teams.every(team => {
    const specificPositions = [
      'GK', 'LB', 'LCB', 'RCB', 'RB', 
      'LCM', 'CAM', 'RCM', 
      'LW', 'ST', 'RW'
    ];
    
    return specificPositions.every(pos => 
      team.players.some(p => p.specificPosition === pos)
    );
  });
  
  if (isComplete) {
    draft.status = 'completed';
  } else if (draft.status === 'setup') {
    draft.status = 'in_progress';
  }
  
  mockDrafts[draftIndex] = draft;
  return draft;
};
