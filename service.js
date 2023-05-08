// service.js
import TrackPlayer, {
  Event,
  Capability,
  RepeatMode,
  AppKilledPlaybackBehavior,
} from 'react-native-track-player';
import MusicFiles from '@yajanarao/react-native-get-music-files';
import {DeviceEventEmitter} from 'react-native';

console.log('\n\ni run once!!!! >>>>>>', MusicFiles);
const randomId = () => Math.floor(Math.random() * 1000000);

DeviceEventEmitter.addListener('onBatchReceived', async params => {
  console.log('\n\nBatch Received:', params.batch, params?.batch?.length);
  params.batch.forEach(async (item, index) => {
    await TrackPlayer.add({
      id: item.id,
      url: `${item.path}`,
      title: item.fileName ? item.fileName : 'Audio File',
      artist: item.artist ? item.artist : 'Unknown Artist',
      artwork: item.cover ? item.cover : require('./assets/girl.jpg'),
      album: item.album ? item.album : 'Unknown Albumn',
      genre: item.genre ? item.genre : 'Unknown Genre',
      duration: item.duration,
    });
  });
});

export async function playbackService() {
  TrackPlayer.addEventListener(Event.RemotePause, () => {
    console.log('Event.RemotePause');
    TrackPlayer.pause();
  });

  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    console.log('Event.RemotePlay');
    TrackPlayer.play();
  });

  TrackPlayer.addEventListener(Event.RemoteStop, () => {
    console.log('Event.RemoteStop');
    TrackPlayer.destroy();
  });

  TrackPlayer.addEventListener(Event.RemoteNext, () => {
    console.log('Event.RemoteNext');
    TrackPlayer.skipToNext();
  });

  TrackPlayer.addEventListener(Event.RemotePrevious, () => {
    console.log('Event.RemotePreviouse');
    TrackPlayer.skipToPrevious();
  });

  TrackPlayer.addEventListener(Event.RemoteDuck, async event => {
    let currentVolume = TrackPlayer.getVolume();
    if (event?.paused) {
      TrackPlayer.setVolume(0.3);
    } else {
      TrackPlayer.setVolume(1);
    }
    console.log('Event.RemoteDuck', event);
  });
}

export async function setupPlayer() {
  let isSetup = false;
  try {
    await TrackPlayer.getCurrentTrack();
    isSetup = true;
  } catch {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.updateOptions({
      android: {
        appKilledPlaybackBehavior:
          //   AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
          AppKilledPlaybackBehavior.ContinuePlayback,
      },
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.SeekTo,
        Capability.Stop,
      ],
      compactCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
      ],
      progressUpdateEventInterval: 2,
      alwaysPauseOnInterruption: true,
      // icon: require('./android/app/src/main/res/mipmap-hdpi/ic_launcher.png'),
    });

    isSetup = true;
  } finally {
    return isSetup;
  }
}

export async function addTracks() {
  TrackPlayer.reset();
  MusicFiles.getAll({
    blured: true,
    artist: true,
    duration: true,
    cover: true,
    genre: true,
    title: true,
    batchNumber: 100,
    minimumSongDuration: 1,
    fields: ['title', 'albumTitle', 'gemre', 'lyrics', 'artwork', 'duration'],
  })
    .then(tracks => {
      // tracks.forEach(async (item, index) => {
      //   await TrackPlayer.add({
      //     id: index,
      //     url: `${item.path}`,
      //     title: item.fileName ? item.fileName : 'Audio File',
      //     artist: item.artist ? item.artist : 'Unknown Artist',
      //     artwork: item.cover ? item.cover : require('./assets/girl.jpg'),
      //     blur: item.blur ? item.blur : require('./assets/girl.jpg'),
      //     album: item.album ? item.album : 'Unknown Albumn',
      //     genre: item.genre ? item.genre : 'Unknown Genre',
      //     duration: item.duration,
      //   });
      // });
    })
    .catch(error => {
      console.log('error, cant add music:', error);
    });

  await TrackPlayer.setRepeatMode(RepeatMode.Queue);
}

// module.exports = async function () {
//   // This service needs to be registered for the module to work
//   // but it will be used later in the "Receiving Events" section
// };
