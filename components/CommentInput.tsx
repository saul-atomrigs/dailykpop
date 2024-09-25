import React from 'react';
import { TextInput, TouchableOpacity, View, StyleSheet } from 'react-native';
import { PaperPlaneTilt } from 'phosphor-react-native';

export default function CommentInput({ newComment, setNewComment, submitComment }) {
  return (
    <View style={styles.commentInputContainer}>
      <TextInput
        style={styles.commentInput}
        placeholder='Write a comment...'
        placeholderTextColor={'#555'}
        value={newComment}
        onChangeText={setNewComment}
      />
      <TouchableOpacity onPress={submitComment} style={styles.sendButton}>
        <PaperPlaneTilt size={24} color='white' />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  commentInputContainer: {
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  sendButton: {
    marginLeft: 12,
    backgroundColor: '#007AFF',
    borderRadius: 20,
    padding: 8,
  },
});