import { atom, selector } from 'recoil';

// isFileLoaded: Check if file load is successful
const isFileLoaded = atom({
  key: 'isFileLoaded',
  default: false,
});
const loaded = selector({
  key: 'loaded',
  get: ({ get }) => get(isFileLoaded),
});

// setPacketDataFile: Return the URL of the JSON parsed data from the .pcapng file
const setPacketDataFile = atom({
  key: 'setPacketDataFile',
  default: '/data/UM_Center_Capture.json', // Stub data file
});
const pData = selector({
  key: 'pData',
  get: ({ get }) => get(setPacketDataFile),
});


// isPlaybackDone: Check if Playback is finished
const isPlaybackDone = atom({
  key: 'isPlaybackDone',
  default: false,
});
const done = selector({
  key: 'done',
  get: ({ get }) => get(isPlaybackDone),
});


// sendPacket: Watch for new packet data
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
    setPacketDataFile, pData,
    isPlaybackDone, done,
    sendPacket, incomingPacket
};