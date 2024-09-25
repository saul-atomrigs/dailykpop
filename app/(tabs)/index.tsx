import React, { useState, useCallback } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '@/supabaseClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AddButton } from '@/components';
import { ChatText, Heart, Plus } from 'phosphor-react-native';

interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  likes: number;
  image_url: string | null;
  comments: number;
  author_id: string;
}

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const router = useRouter();

  async function fetchPosts() {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        // .eq('author_id', userId) // Match with userId
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data);
    } catch (e) {
      console.log('Error fetching posts:', e.message);
    }
  }

  // Use useFocusEffect to fetch posts whenever the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchPosts(); // Fetch posts on screen focus
    }, [])
  );

  return (
    <SafeAreaView style={styles.safeareaview}>
      <ScrollView>
        <View style={styles.container}>
          {posts.map((post) => (
            <View key={post.id} style={styles.post}>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: '/detailedFeed',
                    params: {
                      id: post.id,
                      title: post.title,
                      content: post.content,
                      image_url: post.image_url,
                      likes: post.likes,
                      comments: JSON.stringify(post.comments), // serialize comments
                    },
                  })
                }
              >
                <View style={styles.post}>
                  <View style={styles.content}>
                    <View style={styles.textContainer}>
                      <Text style={styles.title}>
                        {post.title.length > 80
                          ? post.title.substring(0, 80) + '...'
                          : post.title}
                      </Text>
                      <Text style={styles.text}>
                        {post.content.length > 120
                          ? post.content.substring(0, 120) + '...'
                          : post.content}
                      </Text>
                    </View>
                    {post.image_url && (
                      <Image
                        style={styles.image}
                        source={{ uri: post.image_url as string }}
                      />
                    )}
                  </View>
                  <View style={styles.postFooter}>
                    <Text style={styles.createdAt}>
                      {post.created_at.toString().split('T')[0]}
                    </Text>
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
      <View style={styles.addButtonContainer}>
        <AddButton title='Add Feed' onPress={() => router.push('/AddFeed')} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeareaview: {
    flex: 1,
  },
  container: {
    backgroundColor: '#eee',
    marginBottom: 80,
  },
  post: {
    marginTop: 10,
    backgroundColor: '#fff',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginVertical: 20,
  },
  textContainer: {
    width: '65%',
  },
  title: {
    fontSize: 16,
    color: '#02007F',
  },
  image: {
    width: '30%',
    height: 100,
    borderRadius: 10,
  },
  text: {
    fontSize: 14,
  },
  createdAt: {
    fontSize: 12,
  },
  postFooter: {
    marginTop: 10,
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  stat: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
  },
  statDetails: {
    padding: 5,
    marginBottom: 10,
    backgroundColor: '#eee',
    borderRadius: 13,
    marginHorizontal: 5,
    fontSize: 10,
    flexDirection: 'row',
    alignItems: 'center', // Ensure icons and text are centered
  },
  addButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: -20,
  },
});
