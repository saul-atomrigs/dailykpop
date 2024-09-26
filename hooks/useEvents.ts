import { useState, useEffect } from 'react';
import { AgendaSchedule } from 'react-native-calendars';
import { supabase } from '@/supabaseClient';

interface Event {
  id: number;
  artist: string;
  event: string;
  date: string;
  thumbs_up: number;
  thumbs_down: number;
}

/**
 * 이벤트 일정 목록을 가져오는 훅
 */
export default function useEvents() {
  const [items, setItems] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  /**
   * 이벤트 일정 목록을 가져오는 함수
   */
  async function fetchEvents() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;

      setItems(data || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }

  /**
   * `react-native-calendars` 라이브러리에서 사용하기 위해 이벤트 일정을 축약하여 반환하는 함수
   */
  const itemsReduced: AgendaSchedule = items.reduce((acc, event) => {
    const date = event.date.split('T')[0]; 
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push({
      artist: event.artist,
      event: event.event,
      id: event.id,
      thumbs_up: event.thumbs_up, 
      thumbs_down: event.thumbs_down, 
      date: event.date,
    });
    return acc;
  }, {} as AgendaSchedule);

  return { items, itemsReduced, loading, error, fetchEvents };
}
