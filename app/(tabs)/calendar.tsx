import React, { useCallback, useEffect, useState } from 'react';
import {
  Dimensions,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import { Agenda } from 'react-native-calendars';
import { Plus, ThumbsUp, ThumbsDown } from 'phosphor-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { supabase } from '../../supabaseClient';
import { auth } from '@/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  const handleVote = async (eventId, voteType) => {
    try {
      const userId = await AsyncStorage.getItem('@dailykpop-user');

      if (!userId) {
        alert('You need to be logged in to vote.');
        return;
      }

      const { data: existingVote, error: checkError } = await supabase
        .from('votes')
        .select('*')
        .eq('user_id', userId)
        .eq('event_id', eventId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingVote) {
        alert('You have already voted on this event.');
        return;
      }

      const { error: insertError } = await supabase
        .from('votes')
        .insert({ user_id: userId, event_id: eventId, vote_type: voteType });

      if (insertError) throw insertError;

      const column = voteType === 'up' ? 'thumbs_up' : 'thumbs_down';

      const { data, error: updateError } = await supabase
        .from('events')
        .update({
          [column]: supabase.rpc('increment', { x: 1 }), // Use RPC function for increment
        })
        .eq('id', eventId)
        .single();

      if (updateError) throw updateError;

      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === eventId
            ? {
                ...item,
                [column]: data[column],
              }
            : item
        )
      );
    } catch (error) {
      console.error('Error handling vote:', error);
    }
  };

  const handleThumbsUp = (eventId) => handleVote(eventId, 'up');
  const handleThumbsDown = (eventId) => handleVote(eventId, 'down');

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
      thumbs_up: event.thumbs_up, // Add this line to make sure the vote counts are passed
      thumbs_down: event.thumbs_down, // Add this line to make sure the vote counts are passed
      date: event.date,
    });
    return acc;
  }, {});

  function renderItem(props: any) {
    return (
      <RenderItem
        {...props}
        handleThumbsUp={handleThumbsUp}
        handleThumbsDown={handleThumbsDown}
      />
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

// Move renderItem to a separate functional component
function RenderItem(props: any) {
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    const checkUserVote = async () => {
      const userId = auth.currentUser?.uid;
      const { data: userVote } = await supabase
        .from('votes')
        .select('*')
        .eq('user_id', userId)
        .eq('event_id', props.id)
        .single();

      if (userVote) {
        setHasVoted(true);
      }
    };

    checkUserVote();
  }, []);

  return (
    <View style={styles.item}>
      <Text style={styles.artist}>{props.artist}</Text>
      <View style={styles.eventContainer}>
        <Text style={styles.event}>{props.event}</Text>
      </View>
      <View style={styles.stats}>
        <TouchableOpacity
          onPress={() => props.handleThumbsUp(props.id)}
          disabled={hasVoted}
        >
          <ThumbsUp size={20} />
        </TouchableOpacity>
        <Text>{props.thumbs_up}</Text>
        <TouchableOpacity
          onPress={() => props.handleThumbsDown(props.id)}
          disabled={hasVoted}
        >
          <ThumbsDown size={20} />
        </TouchableOpacity>
        <Text>{props.thumbs_down}</Text>
      </View>
    </View>
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
    gap: 10,
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
