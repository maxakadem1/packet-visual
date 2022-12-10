import { atom, selector } from 'recoil';

const isPlaybackDone = atom({
  key: 'isPlaybackDone',
  default: false,
});

// Define a selector that derives its value from the state
const done = selector({
  key: 'done',
  get: ({ get }) => get(isPlaybackDone),
});

export { isPlaybackDone, done };