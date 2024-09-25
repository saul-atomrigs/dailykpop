import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { UserSquare } from 'phosphor-react-native';

export default function CommentList({ comment }) {
  return (
    <View style={styles.comment}>
      <UserSquare size={24} color='black' />
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <Text style={styles.authorName}>
            {'fan' + comment.author_id.slice(-3) || 'Anonymous'}
          </Text>
        </View>
        <Text style={styles.commentText}>{comment.comment}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  comment: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#f9f9f9',
    marginVertical: 4,
    borderRadius: 8,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  authorName: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
  },
  commentText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 20,
  },
});