import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AgendaEntry, AgendaSchedule } from 'react-native-calendars';
import { Dimensions } from 'react-native';

export const wait = (timeout: number) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

/** UI 관련 유틸 함수 */
export const WIDTH = Dimensions.get('window').width;
export const HEIGHT = Dimensions.get('window').height;

/** 캘린더 관련 유틸 함수 */
export const rowHasChanged = (r1: { text: string }, r2: { text: string }) =>
  r1.text !== r2.text;

export const getMarkedDates = (items: AgendaSchedule) => {
  const markedDates: { [key: string]: { marked: boolean } } = {};
  
  Object.keys(items).forEach((key) => {
    markedDates[key] = { marked: true };
  });

  return markedDates;
};

export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
