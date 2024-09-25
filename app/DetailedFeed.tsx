import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';

import { useAuth } from '@/hooks';
import { supabase } from '@/supabaseClient';
import { CommentList, FeedHeader, CommentInput } from '@/components';

/**
 * 피드 상세 페이지
 */
export default function DetailedFeed() {
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

    checkIfLiked();
    fetchComments();
  }, [id, userId]);

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

  // const renderItem = ({ item }) => (
  //   <View style={styles.comment}>
  //     <UserSquare size={24} color='black' />
  //     <View style={styles.commentContent}>
  //       <View style={styles.commentHeader}>
  //         <Text style={styles.authorName}>
  //           {/* get the 3 last digits of author id */}
  //           {'fan' + item.author_id.slice(-3) || 'Anonymous'}
  //         </Text>
  //       </View>
  //       <Text style={styles.commentText}>{item.comment}</Text>
  //     </View>
  //   </View>
  // );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <FlatList
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps='handled'
          ListHeaderComponent={
            <FeedHeader
              title={title}
              content={content}
              image_url={image_url}
              likes={likes}
              liked={liked}
              toggleLike={toggleLike}
              isAuthenticated={isAuthenticated}
            />
          }
          data={comments}
          renderItem={({ item }) => <CommentList comment={item} />}
          keyExtractor={(item) => item.id.toString()}
        />
        <CommentInput
          newComment={newComment}
          setNewComment={setNewComment}
          submitComment={submitComment}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: '#fff' 
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
});
