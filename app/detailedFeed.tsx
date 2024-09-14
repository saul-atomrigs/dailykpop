import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  FlatList,
  TextInput,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { UserSquare, Heart, PaperPlaneTilt } from 'phosphor-react-native';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/supabaseClient';

export default function DetailedFeed() {
  const {
    id,
    title,
    content,
    image_url,
    likes: initialLikes,
    comments: rawComments,
  } = useLocalSearchParams();

  const [likes, setLikes] = useState(initialLikes ? Number(initialLikes) : 0);
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

  const renderItem = ({ item }) => (
    <View style={styles.comment}>
      <Text style={styles.commentText}>{item.comment}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        keyboardShouldPersistTaps='handled'
        ListHeaderComponent={
          <>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.author}>
              <UserSquare size={24} color='black' />
              <Text style={styles.authorText}>Author</Text>
            </View>
            <Text style={styles.content}>{content}</Text>
            {image_url && (
              <Image
                source={{ uri: image_url as string }}
                style={styles.image}
              />
            )}
            <View style={styles.likeContainer}>
              <TouchableOpacity onPress={toggleLike} style={styles.likeButton}>
                <Heart size={24} color={liked ? 'red' : 'black'} />
                <Text style={styles.likeText}> {likes} Likes </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.commentTitle}>Comments</Text>
          </>
        }
        data={comments}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListFooterComponent={
          <View style={styles.commentInputContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder='Write a comment...'
              value={newComment}
              onChangeText={setNewComment}
            />
            <TouchableOpacity onPress={submitComment} style={styles.sendButton}>
              <PaperPlaneTilt size={24} color='black' />
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  author: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  authorText: { marginLeft: 8, fontSize: 16, color: '#555' },
  content: { fontSize: 16, lineHeight: 24, marginBottom: 16 },
  image: { width: '100%', height: 200, borderRadius: 8, marginBottom: 16 },
  likeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 24,
  },
  likeButton: { flexDirection: 'row', alignItems: 'center' },
  likeText: { marginLeft: 8, fontSize: 16 },
  commentSection: { marginTop: 24 },
  commentTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  comment: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  commentText: { fontSize: 16, color: '#555' },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 8,
  },
});
