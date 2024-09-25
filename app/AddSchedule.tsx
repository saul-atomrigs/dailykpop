import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { AddButton, WheelPicker } from '@/components';
import { supabase } from '@/supabaseClient';

/**
 * 일정 추가 페이지
 */
export default function AddSchedule() {
  const initialValues = {
    date: '',
    artist: '',
    event: '',
  };

  const [values, setValues] = useState(initialValues);
  const [items, setItems] = useState([]);
  const [datePickerVisible, setDatePickerVisibility] = useState(false);
  const [text, onChangeText] = useState('');

  const router = useRouter();

  /** 날짜 선택 기능 보여주기/숨기기 */
  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (date: Date) => {
    hideDatePicker();
    onChangeText(new Date(date).toISOString().split('T')[0]);
    setValues({ ...values, date: new Date(date).toISOString().split('T')[0] });
  };

  /** 입력 필드 업데이트 */
  const handleInputChange = (key: string, value: string) =>
    setValues({ ...values, [key]: value });

  /** 아이템 생성 */
  const addItem = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .insert([{ date: text, artist: values.artist, event: values.event }])
        .single();

      if (error) throw error;

      setItems([...items, data]);
      setValues(initialValues);
      console.log('Event created:', data);
    } catch (e) {
      console.error('Error:', e);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAwareScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          {/* 아이돌 선택 */}
          <TextInput
            value={values.artist}
            onChangeText={(value) => handleInputChange('artist', value)}
            placeholder='1. Who? (write here or pick below)'
            style={styles.textInput}
            placeholderTextColor='#666'
          />
          {/* 아이돌 선택 원형 휠 피커 */}
          <WheelPicker
            selectedValue={values.artist}
            onValueChange={(value) => setValues({ ...values, artist: value })}
            onConfirm={() => {}}
          />
          {/* 날짜 선택 */}
          <TouchableOpacity onPress={showDatePicker}>
            <View pointerEvents='none'>
              <TextInput
                value={text}
                placeholder='2. When?'
                style={styles.textInput}
                placeholderTextColor='#666'
                editable={false}
              />
            </View>
            {/* 날짜 선택 모달 */}
            <DateTimePickerModal
              headerTextIOS='1. When is it happening?'
              isVisible={datePickerVisible}
              mode='date'
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
          </TouchableOpacity>

          {/* 이벤트 선택 */}
          <TextInput
            value={values.event}
            onChangeText={(value) => handleInputChange('event', value)}
            placeholder='3. Event (schedule, birthday, release..)'
            style={styles.textInput}
            placeholderTextColor='#666'
          />

          {/* 추가 버튼 */}
          <View style={styles.buttonWrapper}>
            <AddButton
              title='Add to Calendar'
              onPress={() => {
                addItem();
                router.push('/calendar');
              }}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  textInput: {
    fontSize: 16,
    color: '#000',
    height: 50,
    width: 300,
    borderColor: '#e6e6e6',
    backgroundColor: '#eee',
    borderWidth: 1,
    borderRadius: 13,
    padding: 10,
    marginVertical: 15,
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  picker: {
    width: 150,
    height: 220,
  },
  confirm: {
    height: 180,
    justifyContent: 'center',
  },
  buttonWrapper: {
    marginTop: 'auto',
    paddingVertical: 20,
    width: '100%',
    alignItems: 'center',
  },
  addButton: {
    width: 300,
    height: 40,
    backgroundColor: 'black',
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'lightgray',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 0.8,
  },
  addButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    textDecorationLine: 'underline',
  },
});
