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
  const [comments, setComments] = useState(() =>
    rawComments ? JSON.parse(rawComments as string) : []
  );

  const { userId, isAuthenticated } = useAuth(); // Use the useAuth hook

  useEffect(() => {
    const checkIfLiked = async () => {
      if (!id || !userId) return;

      // Fetch the post to get the liked_by array
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

    checkIfLiked();
  }, [id, userId]);

  const toggleLike = async () => {
    if (!isAuthenticated) {
      Alert.alert('Authentication Required', 'Please log in to like posts.');
      return;
    }

    try {
      // Fetch the current liked_by array from the post
      const { data: postData, error: fetchError } = await supabase
        .from('posts')
        .select('liked_by, likes')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      let updatedLikedBy = [...(postData.liked_by || [])];
      let updatedLikes = postData.likes;

      if (liked) {
        // If the post was liked, unlike it (remove userId from liked_by)
        updatedLikedBy = updatedLikedBy.filter((user) => user !== userId);
        updatedLikes -= 1;
      } else {
        // Like the post (add userId to liked_by)
        updatedLikedBy.push(userId);
        updatedLikes += 1;
      }

      // Update the post in the database with the new liked_by array and likes count
      const { error } = await supabase
        .from('posts')
        .update({ liked_by: updatedLikedBy, likes: updatedLikes })
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setLikes(updatedLikes);
      setLiked(!liked);
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
