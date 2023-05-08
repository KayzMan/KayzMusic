import {View, Text} from 'react-native';
import React from 'react';

export default function Page2() {
  console.log('\nPage 2:');
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text style={{color: '#555', fontSize: 40}}> Page 2</Text>
    </View>
  );
}
