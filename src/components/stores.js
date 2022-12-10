import { atom, selector } from 'recoil';

const isPlaybackDone = atom({
  key: 'isPlaybackDone',
  default: false,
});
const done = selector({
  key: 'done',
  get: ({ get }) => get(isPlaybackDone),
});

const sendPacket = atom({
  key: 'sendPacket',
  default: { 
    time: 0
  },
});
const incomingPacket = selector({
  key: 'incomingPacket',
  get: ({ get }) => get(sendPacket),
});

export { 
    isPlaybackDone, done,
    sendPacket, incomingPacket
};