import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChatText, Heart, Plus } from 'phosphor-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Feed(props) {
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: 'First Post',
      createdAt: '2024-09-01',
      likes: 12,
      comments: 4,
    },
    {
      id: 2,
      title: 'Second Post',
      createdAt: '2024-09-05',
      likes: 25,
      comments: 10,
    },
    {
      id: 3,
      title: 'Third Post',
      createdAt: '2024-09-07',
      likes: 8,
      comments: 2,
    },
    {
      id: 4,
      title:
        'Fourth Post - This post has a longer title for testing purposes to see how it looks when it exceeds 80 characters.',
      createdAt: '2024-09-10',
      likes: 45,
      comments: 15,
    },
    {
      id: 5,
      title:
        'Fourth Post - This post has a longer title for testing purposes to see how it looks when it exceeds 80 characters.',
      createdAt: '2024-09-10',
      likes: 45,
      comments: 15,
    },
  ]);

  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeareaview}>
      <ScrollView>
        <View style={styles.container}>
          {posts
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((post, index) => (
              <View key={index} style={styles.post}>
                <TouchableOpacity
                  onPress={() => router.push('/detailedFeed', { param: post })}
                >
                  <View style={styles.post}>
                    <View style={styles.content}>
                      <Text style={styles.text}>
                        {post.title.length > 80
                          ? post.title.substring(0, 80) + '...'
                          : post.title}
                      </Text>
                    </View>
                    <View style={styles.postFooter}>
                      <Text style={styles.createdAt}>{post.createdAt}</Text>
                      <View style={styles.stat}>
                        <View style={styles.statDetails}>
                          <Heart size={18} color='black' />
                          <Text> {post.likes} </Text>
                        </View>
                        <View style={styles.statDetails}>
                          <ChatText size={18} color='black' />
                          <Text> {post.comments} </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            ))}
        </View>
      </ScrollView>

      <View style={styles.floatingBtnContainer}>
        <TouchableOpacity
          style={styles.floatingBtn}
          onPress={() => router.push('/addSchedule')}
        >
          <Plus color='white' weight='bold' />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
  safeareaview: {
    flex: 1,
  },
  container: {
    backgroundColor: '#eee',
  },
  post: {
    marginTop: 10,
    backgroundColor: '#fff',
    padding: 15, // Added padding for post content
    borderRadius: 10, // Added border-radius for better UI
    shadowColor: 'gray', // Added shadow for better UI
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  createdAt: {
    marginLeft: 12,
    color: 'gray',
    fontSize: 12,
  },
  content: {
    marginHorizontal: 20,
    marginVertical: 10,
    color: 'gray',
  },
  text: {
    fontSize: 16,
    color: '#02007F',
  },
  postFooter: {
    marginTop: 10,
    flexDirection: 'row',
  },
  stat: {
    flexDirection: 'row',
    marginLeft: 5,
    marginRight: 5,
    flex: 1,
    justifyContent: 'flex-end',
  },
  statDetails: {
    padding: 5,
    backgroundColor: '#eee',
    borderRadius: 13,
    marginHorizontal: 5,
    fontSize: 12,
    fontWeight: '600',
    flexDirection: 'row',
    alignItems: 'center', // Ensure icons and text are centered
  },
  floatingBtnContainer: {
    justifyContent: 'center',
    paddingHorizontal: 20,
    top: 20,
  },
  floatingBtn: {
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: 'black',
    shadowColor: 'lightgray',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  floatingBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    textDecorationLine: 'underline',
  },
});
