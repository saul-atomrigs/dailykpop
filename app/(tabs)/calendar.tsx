import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { Agenda } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';

import { AddButton, EventItem } from '@/components';
import { useEvents, useVoting } from '@/hooks';
import { rowHasChanged, WIDTH } from '@/utils';

/** 
 * 아이돌 스케쥴, 생일, 콘서트 등 이벤트 일정 확인 페이지
 */
export default function Calendar() {
  const { items, itemsReduced, loading, error, fetchEvents } = useEvents();
  const { handleThumbsUp, handleThumbsDown, isVoting } = useVoting();
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      fetchEvents();
    }, [])
  );

  const renderItem = (props: any) => {
    return (
      <EventItem
        {...props}
        handleThumbsUp={handleThumbsUp}
        handleThumbsDown={handleThumbsDown}
      />
    );
  }

  const renderEmptyDate = () => {
    return <View style={styles.emptyDate}></View>;
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
        theme={theme}
        hideExtraDays={false}
      />

      <View style={styles.addButtonContainer}>
        <AddButton title='Add Schedule' onPress={() => router.push('/AddSchedule')} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30,
  },
  addButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: -20,
  },
});

const theme = {
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
}