import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { Agenda } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';

import { AddButton, EventItem } from '@/components';
import { useEvents, useVoting } from '@/hooks';
import { rowHasChanged } from '@/utils';
import { colors, size, spacing, typography } from '@/design-tokens';

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
    backgroundColor: colors.background,
  },
  emptyDate: {
    height: size.block.none,
    flex: 1,
    paddingTop: spacing.lg,
  },
  addButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: -spacing.lg,
  },
});

const theme = {
  textDayFontWeight: typography.fontWeight.medium,
  textMonthFontWeight: typography.fontWeight.medium,
  todayButtonFontWeight: typography.fontWeight.medium,
  textDayHeaderFontWeight: typography.fontWeight.medium,
  calendarBackground: colors.background,
  agendaKnobColor: colors.agendaKnob,
  agendaTodayColor: colors.agendaToday,
  dotColor: colors.dot,
  textSectionTitleColor: colors.textSectionTitle,
  textSectionTitleDisabledColor: colors.textSectionTitleDisabled,
  selectedDayBackgroundColor: colors.selectedDayBackground,
  selectedDayTextColor: colors.selectedDayText,
  monthTextColor: colors.monthText,
  todayTextColor: colors.todayText,
  dayTextColor: colors.dayText,
  textDisabledColor: colors.textDisabled,
  selectedDotColor: colors.selectedDot,
}