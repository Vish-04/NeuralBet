// Simple test to demonstrate the game abstraction layer
// Run with: node test-game-abstraction.js

const { connect4Engine } = require('./src/lib/games/connect4.js');

console.log('=== Game Abstraction Layer Test ===\n');

console.log('Initial state:');
console.log(connect4Engine.toString(connect4Engine.initialState));
console.log('\n');

// Test a few moves
let state = connect4Engine.initialState;

console.log('Player A plays column 3:');
const result1 = connect4Engine.reducer(state, { col: 3 }, 'a');
state = result1.state;
console.log(connect4Engine.toString(state));
console.log('\n');

console.log('Player B plays column 3:');
const result2 = connect4Engine.reducer(state, { col: 3 }, 'b');
state = result2.state;
console.log(connect4Engine.toString(state));
console.log('\n');

console.log('Player A plays column 4:');
const result3 = connect4Engine.reducer(state, { col: 4 }, 'a');
state = result3.state;
console.log(connect4Engine.toString(state));
console.log('\n');

console.log('=== Test Complete ===');