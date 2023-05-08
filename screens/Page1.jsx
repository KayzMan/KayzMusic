import {View, Text} from 'react-native';
import React from 'react';

export default function Page1() {
  console.log('\nPage 1 new:');
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text style={{color: '#555', fontSize: 40}}> Page 1 </Text>
    </View>
  );
}
