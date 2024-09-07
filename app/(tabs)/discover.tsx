import React, { useState, useCallback, useLayoutEffect } from 'react';
import {
  SectionList,
  Text,
  View,
  TouchableOpacity,
  Image,
  RefreshControl,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { wait } from '@/utils';

const WIDTH = Dimensions.get('window').width;

const dummyData = [
  {
    header: 'TRENDING',
    data: [
      'BTS',
      'aespa',
      'BLACKPINK',
      'TWICE',
      'EXO',
      'IVE',
      'JENNIE',
      'NCT 127',
      'Kep1er',
      'Stray Kids',
      'ITZY',
      'TXT',
    ],
  },
];

export default function Discover() {
  const navigation = useNavigation();

  // State for handling refresh control
  const [refreshing, setRefreshing] = useState(false);

  // Handle pull-to-refresh action
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  // Setup header buttons
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: 'left',
      title: 'Discover',
      headerRight: () => (
        <View style={styles.headerRightContainer}>
          <TouchableOpacity
          // onPress={() => navigation.navigate('Notifications')}
          >
            <Image
              style={styles.headerRightButton}
              source={require('../assets/icons/dots-nine.png')}
            />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <SectionList
        sections={dummyData}
        keyExtractor={(item, index) => item + index}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionHeader}>{section.header}</Text>
        )}
        renderItem={({ item }) => (
          <Text
            style={styles.item}
            onPress={() => navigation.push('DetailedDiscover', { param: item })}
          >
            {item}
          </Text>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        style={styles.list}
        indicatorStyle='black'
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    marginBottom: 80,
    backgroundColor: '#fff',
  },
  sectionHeader: {
    paddingVertical: 2,
    paddingHorizontal: 20,
    fontSize: 23,
    fontWeight: 'bold',
    backgroundColor: '#f5f5f5',
  },
  item: {
    marginHorizontal: 40,
    padding: 10,
    fontSize: 19,
    height: 50,
  },
  list: {
    marginTop: 10,
    backgroundColor: '#fff',
  },
  headerRightContainer: {
    flexDirection: 'row',
  },
  headerRightButton: {
    width: 30,
    height: 30,
    marginRight: WIDTH * 0.05,
  },
});
