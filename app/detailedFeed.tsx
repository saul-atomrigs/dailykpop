import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { UserSquare, Heart } from 'phosphor-react-native';
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
  const [comments, setComments] = useState(() => {
    return rawComments ? JSON.parse(rawComments as string) : [];
  });

  const { userId, isAuthenticated } = useAuth(); // Use the useAuth hook

  useEffect(() => {
    console.log('Post Params:', {
      id,
      title,
      content,
      image_url,
      likes,
      comments,
    });

    // Check if the current user has liked this post
    if (isAuthenticated && userId) {
      checkUserLike();
    }
  }, [id, title, content, image_url, likes, comments, isAuthenticated, userId]);

  const checkUserLike = async () => {
    try {
      const { data, error } = await supabase
        .from('likes')
        .select('*')
        .eq('post_id', id)
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      setLiked(!!data);
    } catch (error) {
      console.error('Error checking user like:', error);
    }
  };

  const toggleLike = async () => {
    if (!isAuthenticated) {
      Alert.alert('Authentication Required', 'Please log in to like posts.');
      return;
    }

    try {
      if (liked) {
        // Remove like
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('post_id', id)
          .eq('user_id', userId);

        if (error) throw error;

        setLikes(likes - 1);
        setLiked(false);
      } else {
        // Add like
        const { error } = await supabase
          .from('likes')
          .insert({ post_id: id, user_id: userId });

        if (error) throw error;

        setLikes(likes + 1);
        setLiked(true);
      }

      // Update the total likes count in the posts table
      await supabase
        .from('posts')
        .update({ likes: likes + (liked ? -1 : 1) })
        .eq('id', id);
    } catch (error) {
      console.error('Error toggling like:', error);
      Alert.alert('Error', 'Failed to update like status. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Author */}
      <View style={styles.author}>
        <UserSquare size={24} color='black' />
        <Text style={styles.authorText}>Author</Text>
      </View>

      {/* Content */}
      <Text style={styles.content}>{content}</Text>

      {/* Image if any */}
      {image_url && (
        <Image source={{ uri: image_url as string }} style={styles.image} />
      )}

      {/* Like Button */}
      <View style={styles.likeContainer}>
        <TouchableOpacity onPress={toggleLike} style={styles.likeButton}>
          <Heart size={24} color={liked ? 'red' : 'black'} />
          <Text style={styles.likeText}> {likes} Likes </Text>
        </TouchableOpacity>
      </View>

      {/* Comments Section */}
      <View style={styles.commentSection}>
        <Text style={styles.commentTitle}>Comments</Text>

        {/* Render comments */}
        {comments.length > 0 ? (
          <FlatList
            data={comments}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.comment}>
                <Text style={styles.commentText}>{item.comment}</Text>
              </View>
            )}
          />
        ) : (
          <Text>No comments yet.</Text>
        )}
      </View>
    </ScrollView>
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
});
