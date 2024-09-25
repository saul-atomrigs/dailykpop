import React from 'react';
import { Image, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Heart, UserSquare } from 'phosphor-react-native';

export default function FeedHeader({ title, content, image_url, likes, liked, toggleLike, isAuthenticated }) {
  return (
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
        <TouchableOpacity
          onPress={toggleLike}
          style={styles.likeButton}
        >
          <Heart size={24} color={liked ? 'red' : 'black'} />
          <Text style={styles.likeText}> {likes} Likes </Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.commentTitle}>Comments</Text>
    </>
  );
}

const styles = StyleSheet.create({
  title: { 
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  author: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  authorText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#555',
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  }, 
  likeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 24,
  },
  likeButton: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  likeText: { 
    marginLeft: 8, 
    fontSize: 16 
  },
  commentSection: { 
    marginTop: 24 
  },
  commentTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 12 
  },
});