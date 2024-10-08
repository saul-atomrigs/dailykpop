import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ThumbsUp, ThumbsDown } from 'phosphor-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { supabase } from '@/supabaseClient';
import { colors, size, spacing, typography } from '@/design-tokens';

interface EventItemProps {
  artist: string;
  event: string;
  id: number;
  thumbs_up: number;
  thumbs_down: number;
  handleThumbsUp: (eventId: number) => Promise<any>;
  handleThumbsDown: (eventId: number) => Promise<any>;
}

/**
 * 이벤트 일정 아이템을 렌더링하는 함수
 */
export default function EventItem(props: EventItemProps) {
  const [hasVoted, setHasVoted] = useState(false);
  const [voteType, setVoteType] = useState<'up' | 'down' | null>(null);
  const [thumbsUp, setThumbsUp] = useState<number | null>(props.thumbs_up);
  const [thumbsDown, setThumbsDown] = useState<number | null>(props.thumbs_down);

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
  const handleVote = async (voteFunction: (eventId: number) => Promise<any>, currentVoteType: 'up' | 'down' | null) => {
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
    <View style={styles.item} testID="event-item">
      <Text style={styles.artist} testID="event-artist">{props.artist}</Text>
      <View style={styles.eventContainer}>
        <Text style={styles.event} testID="event-name">{props.event}</Text>
      </View>
      <View style={styles.stats}>
        <TouchableOpacity
          onPress={() => handleVote(props.handleThumbsUp, 'up')}
          testID="thumbs-up-button"
        >
          <ThumbsUp
            size={20}
            color={voteType === 'up' ? 'hotpink' : 'black'}
            weight={voteType === 'up' ? 'duotone' : 'thin'}
            testID="thumbs-up-icon"
          />
        </TouchableOpacity>
        <Text testID="thumbs-up-count">{thumbsUp}</Text>
        <TouchableOpacity
          onPress={() => handleVote(props.handleThumbsDown, 'down')}
          testID="thumbs-down-button"
        >
          <ThumbsDown
            size={20}
            color={voteType === 'down' ? 'hotpink' : 'black'}
            weight={voteType === 'down' ? 'duotone' : 'thin'}
            testID="thumbs-down-icon"
          />
        </TouchableOpacity>
        <Text testID="thumbs-down-count">{thumbsDown}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: colors.background,
    flex: 1,
    borderRadius: size.borderRadius.large,
    padding: spacing.md,
    marginTop: spacing.md,
    marginRight: spacing.lg,
  },
  artist: {
    fontWeight: typography.fontWeight.bold,
    fontSize: typography.fontSize.md,
  },
  eventContainer: {
    flexDirection: 'row',
  },
  event: {
    marginHorizontal: spacing.sm,
    fontSize: typography.fontSize.md,
  },
  stats: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginHorizontal: spacing.sm,
    justifyContent: 'flex-end',
  },
});