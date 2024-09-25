import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '../supabaseClient'; // import your supabase client
import { useRouter } from 'expo-router';
import { kpopGroups } from '@/lib/kpopGroups';
import { SafeAreaView } from 'react-native-safe-area-context';

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

  // Show and hide date picker
  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (date) => {
    hideDatePicker();
    onChangeText(new Date(date).toISOString().split('T')[0]);
    setValues({ ...values, date: new Date(date).toISOString().split('T')[0] });
  };

  // Update input fields when they change
  const handleInputChange = (key, value) =>
    setValues({ ...values, [key]: value });

  // Create item
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

  // WheelPicker component
  const WheelPicker = () => {
    const [selectedIndex, setSelectedIndex] = useState('');
    const onValueChange = (itemValue) => setSelectedIndex(itemValue);
    const confirmArtist = () => setValues({ ...values, artist: selectedIndex });

    return (
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedIndex}
          onValueChange={onValueChange}
          style={styles.picker}
        >
          {kpopGroups.map((value, index) => (
            <Picker.Item label={value} value={value} key={index} />
          ))}
        </Picker>
        <TouchableOpacity onPress={confirmArtist} style={styles.confirm}>
          <Text>Confirm</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAwareScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          <TextInput
            value={values.artist}
            onChangeText={(value) => handleInputChange('artist', value)}
            placeholder='1. Who? (write here or pick below)'
            style={styles.textInput}
            placeholderTextColor='#666'
          />
          <WheelPicker />

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
            <DateTimePickerModal
              headerTextIOS='1. When is it happening?'
              isVisible={datePickerVisible}
              mode='date'
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
          </TouchableOpacity>

          <TextInput
            value={values.event}
            onChangeText={(value) => handleInputChange('event', value)}
            placeholder='3. Event (schedule, birthday, release..)'
            style={styles.textInput}
            placeholderTextColor='#666'
          />

          <View style={styles.buttonWrapper}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                addItem();
                router.push('/calendar');
              }}
            >
              <Text style={styles.addButtonText}>Add to Calendar</Text>
            </TouchableOpacity>
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
    marginTop: 'auto', // Pushes the button to the bottom of the container
    paddingVertical: 20, // Adds space between the button and the last TextInput
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
