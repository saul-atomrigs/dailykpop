import React, { useCallback, useState } from 'react';
import {
  Dimensions,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import { Agenda } from 'react-native-calendars';
import { BellRinging, Plus } from 'phosphor-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { supabase } from '../../supabaseClient';

export default function Calendar() {
  const [items, setItems] = useState([]);

  const router = useRouter();

  const fetchEvents = async () => {
    const { data, error } = await supabase.from('events').select('*');
    if (error) {
      console.log(error);
    } else {
      setItems(data);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchEvents();
    }, [])
  );

  const itemsReduced = items.reduce((acc, event) => {
    const date = event.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push({
      artist: event.artist,
      event: event.event,
      id: event.id,
      date: event.date,
    });
    return acc;
  }, {});

  // EACH COMPONENT IN AGENDA
  function renderItem(props: any) {
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() =>
          router.push({
            pathname: '/detailedSchedule',
            params: {
              artist: props.artist,
              event: props.event,
              date: props.date,
              id: props.id,
            },
          })
        }
      >
        <Text style={styles.artist}>{props.artist}</Text>
        <View style={styles.eventContainer}>
          <View>{props.icon}</View>
          <Text style={styles.event}>{props.event}</Text>
        </View>
        <View style={styles.stats}>
          <BellRinging size={20} />
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Agenda
        items={itemsReduced}
        dayLoading={false}
        renderItem={renderItem}
        renderEmptyData={renderEmptyDate}
        rowHasChanged={rowHasChanged}
        showClosingKnob={true}
        markingType={'custom'}
        showScrollIndicator={true}
        theme={{
          textDayFontWeight: '500',
          textMonthFontWeight: '500',
          todayButtonFontWeight: '500',
          textDayHeaderFontWeight: '500',
          calendarBackground: '#fff',
          agendaKnobColor: 'gray',
          agendaTodayColor: 'blue',
          dotColor: '#000',
          textSectionTitleColor: '#000',
          textSectionTitleDisabledColor: '#d9e1e8',
          selectedDayBackgroundColor: '#000',
          selectedDayTextColor: '#ffffff',
          monthTextColor: 'blue',
          todayTextColor: 'blue',
          dayTextColor: '#2d4150',
          textDisabledColor: '#d9e1e8',
          selectedDotColor: '#ffffff',
        }}
        hideExtraDays={false}
      />

      <View style={styles.floatingBtnContainer}>
        <TouchableOpacity
          style={styles.floatingBtn}
          onPress={() => router.push('/addSchedule')}
        >
          <Plus color='white' weight='bold' />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function renderEmptyDate() {
  return <View style={styles.emptyDate}></View>;
}

const rowHasChanged = (r1: { text: string }, r2: { text: string }) =>
  r1.text !== r2.text;

const WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerRightButtons: {
    width: 30,
    height: 30,
    marginRight: WIDTH * 0.05,
  },
  container: {
    flex: 1,
  },
  dayItem: {
    textAlign: 'center',
  },
  itemsCount: {
    textAlign: 'center',
    fontSize: 10,
  },
  item: {
    backgroundColor: '#fff',
    flex: 1,
    borderRadius: 13,
    padding: 10,
    marginTop: 10,
    marginRight: 20,
  },
  artist: {
    fontWeight: '800',
  },
  eventContainer: {
    flexDirection: 'row',
  },
  event: {
    marginHorizontal: 10,
    fontSize: 16,
  },
  stats: {
    flexDirection: 'row',
    marginHorizontal: 10,
    justifyContent: 'flex-end',
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30,
  },
  floatingBtnContainer: {
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  floatingBtn: {
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: 'black',
    shadowColor: 'lightgray',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  floatingBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    textDecorationLine: 'underline',
  },
});
