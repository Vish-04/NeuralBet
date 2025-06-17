export type User = {
  id: string;
  email: string;
  name: string;
  credits: number;
  created_at: string;
  updated_at: string;
};

export type Game = {
  id: string;
  type: 'connect-four' | 'battleship' | 'treasure-hunt';
  win: boolean;
  user: string; // user id
  game_state: ConnectFourGameState | BattleshipGameState;
  created_at: string;
};

export type ConnectFourGameState = {
  board: string[][];
  current_turn: string;
  game_over: boolean;
};

export type BattleshipGameState = {
  board: string[][];
  current_turn: string;
  game_over: boolean;
  ships: {
    name: string;
    length: number;
    hits: number;
  }[];
  hits: {
    [key: string]: {
      x: number;
      y: number;
    };
  }[];
  misses: {
    [key: string]: {
      x: number;
      y: number;
    };
  }[];
};
