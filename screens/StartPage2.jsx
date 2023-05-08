import {
  View,
  Dimensions,
  StatusBar,
  Text,
  ImageBackground,
  StyleSheet,
  PermissionsAndroid,
} from 'react-native';
import {Button} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';

export default function StartPage2() {
  let {width, height} = Dimensions.get('screen');
  const navigation = useNavigation();

  const requestPermissions = () => {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: 'File Access',
        message: 'This app would like to access your file storage.',
      },
    )
      .then(() => console.log('read file storage allowed'))
      .catch(error => console.log(error));
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'File Access',
        message: 'This app would like to access your file storage',
      },
    )
      .then(() => {
        console.log('access to write storage allowed!');
        navigation.navigate('home');
      })
      .catch(error => console.log(error));
  };

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
      fontSize: 30,
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
      fontSize: 14,
      marginTop: 5,
    },
    permissionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 15,
    },
    right: {
      marginLeft: 20,
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
        <Text style={styles.headerText}>Kayz Music uses these permissions</Text>

        <View style={[styles.item, {marginVertical: 70}]}>
          <Text style={[styles.subHeadingText, {alignSelf: 'flex-start'}]}>
            {' '}
            Required permissions{' '}
          </Text>

          <View style={styles.permissionItem}>
            <FeatherIcon name="folder" size={25} color={'#eee'} />

            <View style={styles.right}>
              <Text style={styles.subHeadingText}>Storage</Text>
              <Text style={styles.text}>
                Used to play audio files stored on your phone.
              </Text>
            </View>
          </View>
        </View>

        <Button
          style={{
            position: 'absolute',
            bottom: 50,
            right: 20,
          }}
          contentStyle={{
            borderRadius: 10,
            paddingVertical: 2,
            backgroundColor: 'dodgerblue',
          }}
          labelStyle={{
            color: '#eee',
            fontSize: 20,
          }}
          onPress={requestPermissions}>
          Proceed
        </Button>
      </ImageBackground>
    </View>
  );
}
