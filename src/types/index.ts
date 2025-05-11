
export interface User {
  id: string;
  username: string;
  email: string;
}

export interface FootballPlayer {
  id: string;
  name: string;
  position: 'GK' | 'DEF' | 'MID' | 'FWD';
  specificPosition?: 'GK' | 'LB' | 'LCB' | 'RCB' | 'RB' | 'LCM' | 'CM' | 'RCM' | 'LW' | 'ST' | 'RW';
  team: string;
  league: string;
  image?: string;
}

export interface DraftTeam {
  id: string;
  name: string;
  owner: User;
  players: FootballPlayer[];
}

export interface Draft {
  id: string;
  name: string;
  mode: 'champions_league' | 'premier_league' | 'top_5_leagues';
  teams: DraftTeam[];
  status: 'setup' | 'in_progress' | 'completed';
  currentTeamIndex: number;
  currentPositionDrafting?: 'GK' | 'LB' | 'LCB' | 'RCB' | 'RB' | 'LCM' | 'CM' | 'RCM' | 'LW' | 'ST' | 'RW';
  createdAt: Date;
}
