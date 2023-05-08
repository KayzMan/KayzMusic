import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Dimensions,
  DeviceEventEmitter,
} from 'react-native';
import TrackPlayer, {
  useTrackPlayerEvents,
  Event,
} from 'react-native-track-player';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MaterialCommIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Button} from 'react-native-paper';
import {useRef, useState, useEffect} from 'react';
import MusicFiles from '@yajanarao/react-native-get-music-files';
import {addTracks} from '../service';

// 👇 helper components
import TrackItem from '../components/TrackItem';
import {COLORS, SIZES} from '../constants';

export default function Tracks({
  isDarkMode,
  tracks,
  handleShuffle,
  sortByName,
  loadQueue,
}) {
  const [canShuffle, setCanShuffle] = useState(false);
  const trackListRef = useRef(null);
  // const [tracks, setTracks] = useState([]);

  // 👇 common icon size
  // const iconSize = 25;

  // 👇 component did mount.
  useEffect(() => {
    DeviceEventEmitter.addListener('onLastBatchReceived', () => {
      loadQueue();
      console.log('\n\nlast batch!!!');
    });

    // MusicFiles.getAll({
    //   blured: true,
    //   artist: true,
    //   duration: true,
    //   cover: true,
    //   genre: true,
    //   title: true,
    //   minimumSongDuration: 1,
    //   fields: ['title', 'albumTitle', 'gemre', 'lyrics', 'artwork', 'duration'],
    // })
    //   .then(data => {
    //     data.map(item => {
    //       let modified = {
    //         id: item.id,
    //         url: `${item.path}`,
    //         title: item.fileName ? item.fileName : 'Audio File',
    //         artist: item.artist ? item.artist : 'Unknown Artist',
    //         artwork: item.cover,
    //         album: item.album ? item.album : 'Unknown Albumn',
    //         genre: item.genre ? item.genre : 'Unknown Genre',
    //         duration: item.duration,
    //       };
    //       return modified;
    //     });
    //     setTracks(data);
    //     console.log('\n\nsetted:');
    //   })
    //   .catch(error => console.log(error));

    // DeviceEventEmitter.addListener('onBatchReceived', async params => {
    //   // console.log('\n\nBatch Received:', params.batch, params?.batch?.length);
    //   let batch = [];
    //   // params.batch.forEach(async (item, index) => {
    //   //   let data = {
    //   //     id: item.id,
    //   //     url: `${item.path}`,
    //   //     title: item.fileName ? item.fileName : 'Audio File',
    //   //     artist: item.artist ? item.artist : 'Unknown Artist',
    //   //     artwork: item.cover,
    //   //     album: item.album ? item.album : 'Unknown Albumn',
    //   //     genre: item.genre ? item.genre : 'Unknown Genre',
    //   //     duration: item.duration,
    //   //   };
    //   //   batch.push(data);
    //   // });
    //   // setTracks([...tracks, ...params.batch]);
    // });
  }, []);

  // 👇 handler to to reload the music queue
  const refresh = () => {
    loadQueue();
  };

  // handler to reload all tracks
  const reloadAllTracks = async () => {
    await addTracks();
  };

  // // 👇 handler to scroll to current if it's further away from the view area.
  // const scrollToCurrentSong = async () => {
  //   const index = await TrackPlayer.getCurrentTrack();
  //   let listOffset = trackListRef?.current?._listRef?._scrollMetrics?.offset;
  //   let songOffset =
  //     trackListRef?.current?._listRef?._getFrameMetrics(index)?.offset;
  //   let diff = Math.round(listOffset - songOffset);

  //   if (diff <= -150) {
  //     trackListRef?.current?.scrollToOffset({
  //       animated: false,
  //       offset: songOffset,
  //     });
  //   }
  // };

  // 👇 attach an event handler for any changes e.g change track.
  // useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
  //   if (event.type === Event.PlaybackTrackChanged && event.nextTrack != null) {
  //     const index = await TrackPlayer.getCurrentTrack();
  //     // trackListRef.current.scrollToIndex({
  //     //   animated: false,
  //     //   index: index,
  //     // });
  //     let listOffset = trackListRef?.current?._listRef?._scrollMetrics?.offset;
  //     let songOffset =
  //       trackListRef?.current?._listRef?._getFrameMetrics(index)?.offset;
  //     let diff = Math.round(listOffset - songOffset);
  //     if (diff <= -150) {
  //       trackListRef?.current?.scrollToOffset({
  //         animated: false,
  //         offset: songOffset,
  //       });
  //     }
  //   }

  // console.log(
  //   '\n\ni in tracks responded!',
  //   Object.keys(trackListRef?.current?._listRef),
  // );
  // console.log(
  //   '\n\ni in tracks responded!',
  //   trackListRef?.current?._listRef?._getFrameMetrics(22),
  // );
  // console.log(
  //   'footer length:',
  //   trackListRef?.current?._listRef?._scrollMetrics?.offset,
  // );
  // console.log('screen height:', height);
  // });

  // 👇 handler to skip to specific track
  const skipTo = async trackId => {
    await TrackPlayer.skip(trackId);
    await TrackPlayer.play();
  };

  // 👇 styles
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode
        ? COLORS.pageBackgroundDark
        : COLORS.pageBackgroundLight,
      paddingBottom: 100,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      borderTopWidth: 1,
      borderColor: 'transparent',
    },
    emptyContainer: {
      flex: 1,
      backgroundColor: isDarkMode
        ? COLORS.pageBackgroundDark
        : COLORS.pageBackgroundLight,
      alignItems: 'center',
      justifyContent: 'center',
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      borderTopWidth: 1,
      borderColor: 'transparent',
    },
    emptyText: {
      textAlign: 'center',
      maxWidth: '80%',
      lineHeight: 22,
      color: isDarkMode ? COLORS.emptyWhite : COLORS.emptyBlack,
      marginBottom: 20,
    },
    tracksControls: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 15,
      marginTop: 15,
      marginBottom: 30,
    },
    left: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    filterText: {
      color: isDarkMode ? COLORS.emptyWhite : COLORS.emptyBlack,
    },
    rightIcons: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    icon: {
      marginHorizontal: 5,
    },
    divider: {
      backgroundColor: isDarkMode ? COLORS.black555 : COLORS.emptyWhite,
      height: 0.4,
      width: '83%',
      alignSelf: 'flex-end',
    },
  });

  return tracks.length > 0 ? (
    <View style={styles.container}>
      <Button
        onPress={reloadAllTracks}
        textColor={COLORS.primary}
        labelStyle={{fontSize: 18}}
        style={{
          marginTop: 10,
          alignSelf: 'center',
        }}>
        Refresh
      </Button>
      {/* tracks controls section */}
      <View style={styles.tracksControls}>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.left}
          onPress={sortByName}>
          <TouchableOpacity activeOpacity={0.5}>
            <MaterialCommIcon
              name={'sort-ascending'}
              size={SIZES.iconSize}
              color={
                isDarkMode
                  ? COLORS.trackControlIconDark
                  : COLORS.trackControlIconLight
              }
              style={styles.icon}
            />
          </TouchableOpacity>
          <Text style={styles.filterText}>Name</Text>
        </TouchableOpacity>

        <View style={styles.rightIcons}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              setCanShuffle(!canShuffle);
              handleShuffle(true);
            }}>
            <MaterialCommIcon
              name={'shuffle-variant'}
              size={SIZES.iconSize}
              color={
                isDarkMode
                  ? COLORS.trackControlIconDark
                  : COLORS.trackControlIconLight
              }
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.5} onPress={() => skipTo(0)}>
            <IonIcon
              name={'play-circle'}
              size={25}
              color={
                isDarkMode
                  ? COLORS.trackControlIconDark
                  : COLORS.trackControlIconLight
              }
              style={[styles.icon]}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tracks section */}
      <FlatList
        data={tracks}
        ref={trackListRef}
        renderItem={({item, index}) => (
          <>
            <TrackItem
              item={item}
              index={index}
              isDarkMode={isDarkMode}
              handleShuffle={handleShuffle}
            />
            <Text style={styles.divider} />
          </>
        )}
        keyExtractor={item => item.id}
        style={{paddingHorizontal: 15}}
        removeClippedSubviews={true}
        getItemLayout={(data, index) => {
          let height = 50;
          return {length: height, offset: height * index, index};
        }}
      />
    </View>
  ) : (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Tracks will appear here.</Text>
      <Button onPress={refresh} textColor={COLORS.primary}>
        Refresh
      </Button>
    </View>
  );
}
