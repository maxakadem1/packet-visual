import { atom, selector } from 'recoil';


// Check if file load is successful
const isFileLoaded = atom({
  key: 'isFileLoaded',
  default: false,
});
const loaded = selector({
  key: 'loaded',
  get: ({ get }) => get(isFileLoaded),
});


// Check if Playback is finished
const isPlaybackDone = atom({
  key: 'isPlaybackDone',
  default: false,
});
const done = selector({
  key: 'done',
  get: ({ get }) => get(isPlaybackDone),
});


// Watch for new packet data
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
    isFileLoaded, loaded,
    isPlaybackDone, done,
    sendPacket, incomingPacket
};