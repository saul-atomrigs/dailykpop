import React from 'react';
import { Dimensions, SectionList, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { kpopGroups } from '@/lib/kpopGroups';

const WIDTH = Dimensions.get('window').width;

const sectionData = [
  {
    header: 'TRENDING',
    data: kpopGroups,
  },
];

export default function Explore() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <SectionList
        sections={sectionData}
        keyExtractor={(item, index) => item + index}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionHeader}>{section.header}</Text>
        )}
        renderItem={({ item }) => (
          <Text
            style={styles.item}
            onPress={() =>
              router.push({ pathname: '/ExplorePage', params: { param: item } })
            }
          >
            {item}
          </Text>
        )}
        style={styles.list}
        indicatorStyle='black'
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
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
