import { useState } from 'react';
import { supabase } from '@/supabaseClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface VoteResult {
  success: boolean;
  message: string;
  thumbsUp?: number;
  thumbsDown?: number;
}

export default function useVoting() {
  const [isVoting, setIsVoting] = useState(false);

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

  return { handleThumbsUp, handleThumbsDown, isVoting };
}
