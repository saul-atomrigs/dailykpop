import React from 'react';
import { Dimensions, SectionList, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const WIDTH = Dimensions.get('window').width;

const kpopGroups = [
  {
    header: 'TRENDING',
    data: [
      '(G)I-DLE',
      'ATEEZ',
      'ASTRO',
      'aespa',
      'BTS',
      'BLACKPINK',
      'Dreamcatcher',
      'ENHYPEN',
      'EVERGLOW',
      'EXO',
      'GOT7',
      'IVE',
      'ITZY',
      'JENNIE',
      'Kep1er',
      'LOONA',
      'MAMAMOO',
      'MONSTA X',
      'NCT 127',
      'NMIXX',
      'Oh My Girl',
      'Red Velvet',
      'SEVENTEEN',
      'SF9',
      'Stray Kids',
      'STAYC',
      'TREASURE',
      'TXT',
      'TWICE',
      'WINNER',
    ],
  },
];

export default function Explore() {
  const router = useRouter();

  return (
    <SafeAreaView>
      <SectionList
        sections={kpopGroups}
        keyExtractor={(item, index) => item + index}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionHeader}>{section.header}</Text>
        )}
        renderItem={({ item }) => (
          <Text
            style={styles.item}
            // onPress={() => router.push('DetailedDiscover', { param: item })}
            // onPress={() => router.push('/explorePage')}
            onPress={() =>
              router.push({ pathname: '/explorePage', params: { param: item } })
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
