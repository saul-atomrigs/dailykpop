import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/hooks';
import { supabase } from '@/supabaseClient';

export default function useDetailedFeed() {
  const {
    id,
    title,
    content,
    image_url,
    likes: initialLikes,
    comments: rawComments,
  } = useLocalSearchParams();

  const [likes, setLikes] = useState(initialLikes ? +(initialLikes) : 0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const { userId, isAuthenticated } = useAuth();

  useEffect(() => {
    checkIfLiked();
    fetchComments();
  }, [id, userId]);

  /**
   * 현재 사용자가 해당 피드를 좋아요 했는지 확인하는 함수
   */
  const checkIfLiked = async () => {
    if (!id || !userId) return;

    const { data, error } = await supabase
      .from('posts')
      .select('liked_by')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching liked_by:', error);
      return;
    }

    if (data.liked_by && data.liked_by.includes(userId)) {
      setLiked(true);
    }
  };

  /**
   * 피드에 달린 댓글 목록을 가져오는 함수
   */
  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
      Alert.alert('Error', 'Failed to fetch comments. Please try again.');
    }
  };

  /**
   * 피드의 좋아요 상태를 토글하는 함수
   */
  const toggleLike = async () => {
    if (!isAuthenticated) {
      Alert.alert('Authentication Required', 'Please log in to like posts.');
      return;
    }

    try {
      const { data: postData, error: fetchError } = await supabase
        .from('posts')
        .select('liked_by, likes')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      let updatedLikedBy = [...(postData.liked_by || [])];
      let updatedLikes = postData.likes;

      if (liked) {
        updatedLikedBy = updatedLikedBy.filter((user) => user !== userId);
        updatedLikes -= 1;
      } else {
        updatedLikedBy.push(userId);
        updatedLikes += 1;
      }

      const { error } = await supabase
        .from('posts')
        .update({ liked_by: updatedLikedBy, likes: updatedLikes })
        .eq('id', id);

      if (error) throw error;

      setLikes(updatedLikes);
      setLiked(!liked);
    } catch (error) {
      console.error('Error toggling like:', error);
      Alert.alert('Error', 'Failed to update like status. Please try again.');
    }
  };

  /**
   * 피드에 댓글을 추가하는 함수
   */
  const submitComment = async () => {
    if (!isAuthenticated) {
      Alert.alert(
        'Authentication Required',
        'Please log in to submit a comment.'
      );
      return;
    }

    if (!newComment.trim()) {
      Alert.alert('Empty Comment', 'Comment cannot be empty.');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('comments')
        .insert([
          {
            post_id: id,
            comment: newComment,
            author_id: userId,
            created_at: new Date().toISOString(),
          },
        ])
        .select();

      if (error) throw error;

      if (Array.isArray(data) && data.length > 0) {
        const newCommentObj = data[0];
        setComments((prevComments) => {
          return Array.isArray(prevComments)
            ? [...prevComments, newCommentObj]
            : [newCommentObj];
        });
        setNewComment('');
      } else {
        console.error('Unexpected response format:', data);
        Alert.alert(
          'Error',
          'Unexpected response from server. Please try again.'
        );
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      Alert.alert('Error', 'Failed to submit comment. Please try again.');
    }
  };

  return {
    title,
    content,
    image_url,
    likes,
    liked,
    comments,
    newComment,
    isAuthenticated,
    toggleLike,
    setNewComment,
    submitComment,
  };
}
