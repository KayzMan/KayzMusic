import {View, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import PagerView from 'react-native-pager-view';
import PaginationDot from 'react-native-animated-pagination-dot';
import RNFS from 'react-native-fs';

// 👇 screens
import StartPage1 from '../screens/StartPage1';
import StartPage2 from '../screens/StartPage2';

export default function MyPagerView({navigation}) {
  const [currentPage, setCurrentPage] = useState(0);
  const [openCounter, setOpenCounter] = useState(0);

  useEffect(() => {
    getFirstOpenedInfo();
  }, []);

  // 👇 handler to save info about this app opened at least once
  const saveFirstOpenedInfo = () => {
    RNFS.writeFile(
      RNFS.ExternalDirectoryPath + '/data.txt',
      JSON.stringify({openCounter: openCounter + 1}),
      'utf8',
    )
      .then(success => {
        console.log('file written!', success);
      })
      .catch(error => console.log(error));
  };

  // if (openCounter <= 0) {
  //   saveFirstOpenedInfo();
  // }

  // 👇 handler to get info about this app opened at least once.
  const getFirstOpenedInfo = () => {
    RNFS.readFile(RNFS.ExternalDirectoryPath + '/data.txt', 'utf8')
      .then(data => {
        let value = JSON.parse(data);
        setOpenCounter(value.openCounter);
        console.log('fetched::', value);
        if (value.openCounter > 0) {
          navigation.navigate('home');
        }
      })
      .catch(error => {
        if (error.code == 'ENOENT') {
          console.log('\n\nFile not found', error.code);
          saveFirstOpenedInfo();
        } else {
          console.log(error);
        }
      });
  };

  const styles = StyleSheet.create({
    pagerView: {
      flex: 1,
    },
  });

  return (
    <View style={{flex: 1}}>
      <PagerView
        style={styles.pagerView}
        initialPage={0}
        onPageSelected={e => setCurrentPage(e.nativeEvent.position)}>
        <StartPage1 key={'1'} />
        <StartPage2 key={'2'} />
      </PagerView>
      <View style={{alignSelf: 'center', position: 'absolute', bottom: 10}}>
        <PaginationDot
          activeDotColor="dodgerblue"
          curPage={currentPage}
          maxPage={2}
          sizeRatio={1.5}
        />
      </View>
    </View>
  );
}
