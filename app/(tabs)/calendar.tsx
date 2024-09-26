import React, { useCallback, useEffect, useState } from 'react';
import {
  Dimensions,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import { Agenda } from 'react-native-calendars';
import { ThumbsUp, ThumbsDown } from 'phosphor-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';

import { supabase } from '@/supabaseClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AddButton } from '@/components';
import { useEvents } from '@/hooks';

/** 
 * 아이돌 스케쥴, 생일, 콘서트 등 이벤트 일정 확인 페이지
 */
export default function Calendar() {
  const { items, itemsReduced, loading, error, fetchEvents } = useEvents();
  const router = useRouter();

  /**
   * 이벤트 일정에 대한 투표를 처리하는 함수
   */
  const handleVote = async (eventId: number, voteType: 'up' | 'down') => {
    try {
      const userId = await AsyncStorage.getItem('@dailykpop-user');
      if (!userId) {
        alert('You need to be logged in to vote.');
        return;
      }

      /**
       * 사용자가 이미 해당 이벤트에 투표했는지 확인하는 함수
       */
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

      /**
       * 새로운 투표를 `votes` 테이블에 삽입하는 함수
       */
      const { error: insertError } = await supabase
        .from('votes')
        .insert({ user_id: userId, event_id: eventId, vote_type: voteType });
      if (insertError) throw insertError;

      /**
       * '좋아요' 수를 가져오는 함수
       */
      const { count: thumbsUpCount } = await supabase
        .from('votes')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', eventId)
        .eq('vote_type', 'up');

      /**
       * '싫어요' 수를 가져오는 함수
       */
      const { count: thumbsDownCount } = await supabase
        .from('votes')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', eventId)
        .eq('vote_type', 'down');

      /**
       * 투표 수를 업데이트하는 함수
       */
      const { error: updateError } = await supabase
        .from('events')
        .update({
          thumbs_up: thumbsUpCount,
          thumbs_down: thumbsDownCount,
        })
        .eq('id', eventId);
      if (updateError) throw updateError;

      /**
       * 업데이트된 투표 수(좋아요, 싫어요)를 반환하는 함수
       */
      return { thumbsUpCount, thumbsDownCount };
    } catch (error) {
      console.error('Error handling vote:', error);
      return null;
    }
  };

  /**
   * 좋아요 투표 함수
   */
  const handleThumbsUp = (eventId: number) => handleVote(eventId, 'up');
  /**
   * 싫어요 투표 함수
   */
  const handleThumbsDown = (eventId: number) => handleVote(eventId, 'down');

  useFocusEffect(
    useCallback(() => {
      fetchEvents();
    }, [])
  );

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

      <View style={styles.addButtonContainer}>
        <AddButton title='Add Schedule' onPress={() => router.push('/AddSchedule')} />
      </View>
    </SafeAreaView>
  );
}

/**
 * 이벤트 일정 아이템을 렌더링하는 함수
 */
function RenderItem(props: any) {
  const [hasVoted, setHasVoted] = useState(false);
  const [voteType, setVoteType] = useState<'up' | 'down' | null>(null);
  const [thumbsUp, setThumbsUp] = useState(props.thumbs_up);
  const [thumbsDown, setThumbsDown] = useState(props.thumbs_down);

  useEffect(() => {
    /**
     * 현재 사용자가 해당 이벤트에 투표했는지 확인하는 함수
     */
    const checkUserVote = async () => {
      const userId = await AsyncStorage.getItem('@dailykpop-user');
      const { data: userVote } = await supabase
        .from('votes')
        .select('*')
        .eq('user_id', userId)
        .eq('event_id', props.id)
        .single();

      /**
       * 사용자가 이미 해당 이벤트에 투표했다면 투표 상태를 업데이트
       */
      if (userVote) {
        setHasVoted(true);
        setVoteType(userVote.vote_type);
      }
    };

    checkUserVote();
  }, []);

  /**
   * 이미 투표한 아이콘을 누르면 투표를 취소하고, 아니라면 새로 투표를 생성
   */
  const handleVote = async (voteFunction, currentVoteType) => {
    if (hasVoted && currentVoteType === voteType) {
      const result = await removeVote(props.id);
      if (result) {
        setThumbsUp(result.thumbsUpCount);
        setThumbsDown(result.thumbsDownCount);
        setHasVoted(false);
        setVoteType(null); // Reset vote type
      }
    } else {
      const result = await voteFunction(props.id);
      if (result) {
        setThumbsUp(result.thumbsUpCount);
        setThumbsDown(result.thumbsDownCount);
        setHasVoted(true);
        setVoteType(currentVoteType); // Set the new vote type
      }
    }
  };

  /**
   * 투표를 취소하는 함수
   */
  const removeVote = async (eventId: number) => {
    try {
      const userId = await AsyncStorage.getItem('@dailykpop-user');
      if (!userId) {
        alert('You need to be logged in to undo your vote.');
        return;
      }

      const { error: deleteError } = await supabase
        .from('votes')
        .delete()
        .eq('user_id', userId)
        .eq('event_id', eventId);

      if (deleteError) throw deleteError;

      const { count: thumbsUpCount } = await supabase
        .from('votes')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', eventId)
        .eq('vote_type', 'up');

      const { count: thumbsDownCount } = await supabase
        .from('votes')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', eventId)
        .eq('vote_type', 'down');

      const { error: updateError } = await supabase
        .from('events')
        .update({
          thumbs_up: thumbsUpCount,
          thumbs_down: thumbsDownCount,
        })
        .eq('id', eventId);

      if (updateError) throw updateError;

      return { thumbsUpCount, thumbsDownCount };
    } catch (error) {
      console.error('Error removing vote:', error);
      return null;
    }
  };

  return (
    <View style={styles.item}>
      <Text style={styles.artist}>{props.artist}</Text>
      <View style={styles.eventContainer}>
        <Text style={styles.event}>{props.event}</Text>
      </View>
      <View style={styles.stats}>
        <TouchableOpacity
          onPress={() => handleVote(props.handleThumbsUp, 'up')}
        >
          <ThumbsUp
            size={20}
            color={voteType === 'up' ? 'hotpink' : 'black'}
            weight={voteType === 'up' ? 'duotone' : 'thin'}
          />
        </TouchableOpacity>
        <Text>{thumbsUp}</Text>
        <TouchableOpacity
          onPress={() => handleVote(props.handleThumbsDown, 'down')}
        >
          <ThumbsDown
            size={20}
            color={voteType === 'down' ? 'hotpink' : 'black'}
            weight={voteType === 'down' ? 'duotone' : 'thin'}
          />
        </TouchableOpacity>
        <Text>{thumbsDown}</Text>
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
  addButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: -20,
  },
});
