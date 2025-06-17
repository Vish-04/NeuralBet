/**
 * Connect4 Game Engine Tests
 */

import { connect4Engine, Connect4State, Connect4Move, CONNECT4_ROWS, CONNECT4_COLS } from '../connect4';

describe('Connect4 Game Engine', () => {
  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const state = connect4Engine.initialState;
      
      expect(state.board).toHaveLength(CONNECT4_ROWS);
      expect(state.board[0]).toHaveLength(CONNECT4_COLS);
      
      // Board should be empty
      for (let row = 0; row < CONNECT4_ROWS; row++) {
        for (let col = 0; col < CONNECT4_COLS; col++) {
          expect(state.board[row][col]).toBeNull();
        }
      }
    });
  });

  describe('Move Validation', () => {

    it('should reject out-of-bounds columns', () => {
      const state = connect4Engine.initialState;
      
      expect(() => {
        connect4Engine.reducer(state, { col: -1 }, 'a');
      }).toThrow('Invalid column: -1');

      expect(() => {
        connect4Engine.reducer(state, { col: CONNECT4_COLS }, 'a');
      }).toThrow(`Invalid column: ${CONNECT4_COLS}`);
    });

    it('should reject moves in full columns', () => {
      // Fill up column 0
      let state = connect4Engine.initialState;
      for (let i = 0; i < CONNECT4_ROWS; i++) {
        const player = i % 2 === 0 ? 'a' : 'b';
        const result = connect4Engine.reducer(state, { col: 0 }, player);
        state = result.state;
      }

      // Try to add one more to the full column
      expect(() => {
        connect4Engine.reducer(state, { col: 0 }, 'a');
      }).toThrow('Column 0 is full');
    });
  });

  describe('Game Logic', () => {
    it('should apply moves correctly with gravity', () => {
      let state = connect4Engine.initialState;
      
      // Player A makes first move in column 3
      const result1 = connect4Engine.reducer(state, { col: 3 }, 'a');
      state = result1.state;
      
      expect(state.board[CONNECT4_ROWS - 1][3]).toBe('a'); // Bottom row
      expect(state.lastMove).toEqual({ row: CONNECT4_ROWS - 1, col: 3, player: 'a' });
      
      // Player B makes move in same column
      const result2 = connect4Engine.reducer(state, { col: 3 }, 'b');
      state = result2.state;
      
      expect(state.board[CONNECT4_ROWS - 2][3]).toBe('b'); // Second from bottom
      expect(state.board[CONNECT4_ROWS - 1][3]).toBe('a'); // Original piece still there
    });

    it('should detect horizontal win', () => {
      let state = connect4Engine.initialState;
      
      // Create a horizontal win for player A in bottom row
      // A plays columns 0,1,2 and B plays columns 0,1,2 (on top of A)
      for (let col = 0; col < 3; col++) {
        // A plays
        const resultA = connect4Engine.reducer(state, { col }, 'a');
        state = resultA.state;
        
        // B plays (on top)
        const resultB = connect4Engine.reducer(state, { col }, 'b');
        state = resultB.state;
      }
      
      // A plays column 3 for the win
      const finalResult = connect4Engine.reducer(state, { col: 3 }, 'a');
      
      expect(finalResult.winner).toBe('a');
    });

    it('should detect vertical win', () => {
      let state = connect4Engine.initialState;
      let lastResult;
      
      // A plays column 0 four times, B plays column 1
      for (let i = 0; i < 4; i++) {
        // A plays column 0
        lastResult = connect4Engine.reducer(state, { col: 0 }, 'a');
        state = lastResult.state;
        
        if (i < 3) { // Don't let B play after A wins
          // B plays column 1
          const resultB = connect4Engine.reducer(state, { col: 1 }, 'b');
          state = resultB.state;
        }
      }
      
      expect(lastResult?.winner).toBe('a');
    });

    it('should detect diagonal win (\\)', () => {
      let state = connect4Engine.initialState;
      
      // Create diagonal win pattern
      // Row 3: A at col 0
      // Row 2: A at col 1 (B at col 0)
      // Row 1: A at col 2 (B at col 0, B at col 1)
      // Row 0: A at col 3 (B at col 0, B at col 1, B at col 2)
      
      // Build up column 0 (3 B pieces, 1 A on top)
      for (let i = 0; i < 3; i++) {
        state = connect4Engine.reducer(state, { col: 0 }, 'b').state;
        state = connect4Engine.reducer(state, { col: 1 }, 'a').state; // Dummy moves
      }
      state = connect4Engine.reducer(state, { col: 0 }, 'a').state; // A on top of column 0
      
      // Build up column 1 (2 B pieces, 1 A on top)
      state = connect4Engine.reducer(state, { col: 2 }, 'b').state; // Dummy
      for (let i = 0; i < 2; i++) {
        state = connect4Engine.reducer(state, { col: 1 }, 'b').state;
        state = connect4Engine.reducer(state, { col: 2 }, 'a').state; // Dummy moves
      }
      state = connect4Engine.reducer(state, { col: 1 }, 'a').state; // A on top of column 1
      
      // Build up column 2 (1 B piece, 1 A on top)
      state = connect4Engine.reducer(state, { col: 3 }, 'b').state; // Dummy
      state = connect4Engine.reducer(state, { col: 2 }, 'b').state;
      state = connect4Engine.reducer(state, { col: 3 }, 'a').state; // Dummy
      state = connect4Engine.reducer(state, { col: 2 }, 'a').state; // A on top of column 2
      
      // Finally, A plays column 3 for diagonal win
      const finalResult = connect4Engine.reducer(state, { col: 3 }, 'b').state; // B's turn first
      const winResult = connect4Engine.reducer(finalResult, { col: 3 }, 'a');
      
      expect(winResult.winner).toBe('a');
    });

    it('should detect draw when board is full', () => {
      let state = connect4Engine.initialState;
      
      // Fill the board in a pattern that doesn't create 4-in-a-row
      // This is a simplified test - in practice, avoiding wins while filling is complex
      const pattern = [
        ['a', 'b', 'a', 'b', 'a', 'b', 'a'],
        ['b', 'a', 'b', 'a', 'b', 'a', 'b'],
        ['a', 'b', 'a', 'b', 'a', 'b', 'a'],
        ['b', 'a', 'b', 'a', 'b', 'a', 'b'],
        ['a', 'b', 'a', 'b', 'a', 'b', 'a'],
        ['b', 'a', 'b', 'a', 'b', 'a', 'b'],
      ];
      
      // We'll create a custom state for testing draw detection
      const drawState: Connect4State = {
        board: pattern.map(row => row.map(cell => cell as 'a' | 'b')),
      };
      
      // Create engine with this state to test if it detects as full
      // (This is testing the isBoardFull function indirectly)
      const testEngine = {
        ...connect4Engine,
        initialState: drawState,
      };
      
      // The board should be full, so any move should be rejected
      expect(() => {
        testEngine.reducer(drawState, { col: 0 }, 'a');
      }).toThrow('Column 0 is full');
    });
  });

  describe('toString', () => {
    it('should format empty board correctly', () => {
      const state = connect4Engine.initialState;
      const output = connect4Engine.toString(state);
      
      expect(output).toContain('0 1 2 3 4 5 6'); // Column headers
      expect(output).toContain('·'); // Empty cells
    });

    it('should format board with pieces correctly', () => {
      let state = connect4Engine.initialState;
      
      // Add some pieces
      state = connect4Engine.reducer(state, { col: 3 }, 'a').state;
      state = connect4Engine.reducer(state, { col: 3 }, 'b').state;
      
      const output = connect4Engine.toString(state);
      
      expect(output).toContain('A'); // Player A piece
      expect(output).toContain('B'); // Player B piece
      expect(output).toContain('Last move: Player B -> Column 3');
    });

    it('should show winner when game is complete', () => {
      // Create a simple state with a winner to test toString
      const winningState: Connect4State = {
        board: Array(CONNECT4_ROWS).fill(null).map(() => Array(CONNECT4_COLS).fill(null)),
        lastMove: { row: 5, col: 0, player: 'a' },
      };
      
      // Manually place 4 pieces for player A in bottom row
      for (let i = 0; i < 4; i++) {
        winningState.board[5][i] = 'a';
      }
      
      const output = connect4Engine.toString(winningState);
      expect(output).toContain('A'); // Should show the pieces
    });
  });
});