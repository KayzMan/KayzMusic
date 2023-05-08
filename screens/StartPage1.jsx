import {
  View,
  Dimensions,
  StatusBar,
  Text,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import {Button} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';

export default function StartPage1() {
  let {width, height} = Dimensions.get('screen');
  const navigation = useNavigation();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    imageBackground: {
      flex: 1,
      width: width,
      height: height,
      alignItems: 'center',
    },
    item: {
      width: '80%',
      alignItems: 'center',
    },
    headerText: {
      alignSelf: 'center',
      fontSize: 40,
      color: '#fff',
      fontWeight: '500',
      marginTop: 100,
    },
    subHeadingText: {
      color: '#eee',
      fontSize: 22,
      fontWeight: '500',
    },
    text: {
      color: '#eee',
      fontSize: 16,
    },
  });

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <ImageBackground
        blurRadius={5}
        source={require('../assets/page3.jpg')}
        style={styles.imageBackground}
        resizeMode="stretch">
        <Text style={styles.headerText}>Kayz Music</Text>

        <View style={[styles.item, {marginVertical: 100}]}>
          <Text style={[styles.subHeadingText, {alignSelf: 'flex-start'}]}>
            {' '}
            Play your own tracks{' '}
          </Text>
          <Text style={styles.text}>
            Listen to MP3s, and other audio files on your phone.
          </Text>
        </View>

        <View style={[{width: '80%'}]}>
          <Text style={styles.subHeadingText}> Easily browse your music </Text>
          <Text style={styles.text}>
            {' '}
            Sort by album, artist, genre, and more.{' '}
          </Text>
        </View>

        {/* <Button
          style={{
            position: 'absolute',
            bottom: 50,
            right: 20,
          }}
          contentStyle={{
            borderRadius: 10,
            paddingVertical: 2,
            borderColor: 'dodgerblue',
            borderWidth: 1,
          }}
          labelStyle={{
            color: '#eee',
            fontSize: 20,
          }}
          onPress={() => navigation.navigate('home')}>
          Skip
        </Button> */}
      </ImageBackground>
    </View>
  );
}
