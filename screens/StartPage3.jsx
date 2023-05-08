import {View, Image, Dimensions, StatusBar} from 'react-native';
import {Button} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';

export default function StartPage3() {
  let {width, height} = Dimensions.get('screen');
  const navigation = useNavigation();

  return (
    <View style={{flex: 1}}>
      <StatusBar hidden />
      <Image
        source={require('../assets/img1.png')}
        style={{
          flex: 1,
          width: width,
          height: height,
        }}
        resizeMode="stretch"
      />
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
        onPress={() => navigation.navigate('home')}>
        Continue
      </Button>
    </View>
  );
}
