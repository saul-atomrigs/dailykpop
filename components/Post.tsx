import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface PostProps {
  post: {
    id: string;
    title: string;
    content: string;
    image_url: string;
    likes: number;
    comments: Array<{ id: string; text: string }>;
  };
  onPress: (post: PostProps['post']) => void;
}

const Post: React.FC<PostProps> = ({ post, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(post)}>
      <Image source={{ uri: post.image_url }} style={styles.image} />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.content} numberOfLines={2}>
          {post.content}
        </Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <FontAwesome name="heart" size={16} color="#FF6B6B" />
            <Text style={styles.statText}>{post.likes}</Text>
          </View>
          <View style={styles.statItem}>
            <FontAwesome name="comment" size={16} color="#4ECDC4" />
            <Text style={styles.statText}>{post.comments.length}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  content: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  statsContainer: {
    flexDirection: 'row',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
});

export default Post;
