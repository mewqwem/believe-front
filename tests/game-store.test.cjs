const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const source = fs.readFileSync(require('node:path').join(__dirname, '../store/useGameStore.ts'), 'utf8');
function setup() {
  const handlers = {};
  const emitted = [];
  const socket = { connected: false, on: (name, fn) => { handlers[name] = fn; }, removeAllListeners() {}, connect() { this.connected = true; }, emit(name, data) { emitted.push({ name, data }); } };
  const storage = () => { const values = new Map(); return { getItem: key => values.get(key), setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) }; };
  const exports = {};
  const sessionStorage = storage();
  const localStorage = storage();
  localStorage.setItem('blefPlayerId', 'shared-old-id');
  vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, {
    exports, require: id => id === '@/lib/socket' ? { socket } : require(id), localStorage, sessionStorage,
    crypto: require('node:crypto').webcrypto, setTimeout, clearTimeout,
  });
  const store = exports.useGameStore;
  store.getState().connectSocket();
  return { store, handlers, sessionStorage, emitted };
}
test('guest identity is per tab and ignores legacy shared identity', () => {
  const a = setup(), b = setup();
  assert.notEqual(a.store.getState().playerId, 'shared-old-id');
  assert.notEqual(a.store.getState().playerId, b.store.getState().playerId);
  assert.equal(a.sessionStorage.getItem('blefPlayerId'), a.store.getState().playerId);
});
test('missing room clears stale destination to prevent redirect loop', () => {
  const { store, handlers } = setup();
  store.setState({ room: { ...store.getState().room, roomId: 'OLD123' } });
  handlers.ERROR({ message: 'Кімната не знайдена' });
  assert.equal(store.getState().room.roomId, null);
  assert.equal(store.getState().roomNotFound, true);
  assert.equal(store.getState().joinError, 'Кімната не знайдена');
});
test('join rejection ends pending state and exposes the error; late room updates are ignored', () => {
  const { store, handlers } = setup();
  store.getState().joinRoom('ABC123', 'Guest');
  assert.equal(store.getState().joining, true);
  handlers.ERROR({ message: 'Цей гравець уже в кімнаті' });
  assert.equal(store.getState().joining, false);
  assert.equal(store.getState().joinError, 'Цей гравець уже в кімнаті');
  handlers.ROOM_UPDATED({ roomId: 'OLD123', players: [{ id: 'someone-else' }] });
  assert.equal(store.getState().room.roomId, null);
});
test('createRoom sends custom maxPlayers and updates room state on ROOM_UPDATED', () => {
  const { store, handlers, emitted } = setup();
  assert.equal(store.getState().room.maxPlayers, 4);

  store.getState().createRoom('Host', null, 7);
  const createEvent = emitted.find((e) => e.name === 'CREATE_ROOM');
  assert.ok(createEvent);
  assert.equal(createEvent.data.maxPlayers, 7);

  handlers.ROOM_UPDATED({
    roomId: 'NEW123',
    maxPlayers: 7,
    players: [{ id: store.getState().playerId, name: 'Host' }],
  });
  assert.equal(store.getState().room.maxPlayers, 7);
});
test('server error codes map to translation keys with fallback for unknown codes', () => {
  const { store, handlers } = setup();
  handlers.ERROR({ code: 'ROOM_FULL', message: 'lobby.roomFull' });
  assert.equal(store.getState().joinError, 'lobby.roomFull');

  handlers.ERROR({ code: 'GAME_ALREADY_STARTED' });
  assert.equal(store.getState().joinError, 'lobby.gameAlreadyStarted');

  handlers.ERROR({ code: 'UNKNOWN_CODE' });
  assert.equal(store.getState().joinError, 'lobby.genericError');
});

