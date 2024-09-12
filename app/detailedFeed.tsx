import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { UserSquare, Heart } from 'phosphor-react-native';

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

  useEffect(() => {
    console.log('Post Params:', {
      id,
      title,
      content,
      image_url,
      likes,
      comments,
    });
  }, [id, title, content, image_url, likes, comments]);

  const toggleLike = () => {
    if (liked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setLiked(!liked);
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
