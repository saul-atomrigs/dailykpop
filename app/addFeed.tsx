import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { supabase } from '@/supabaseClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface NewPost {
  title: string;
  content: string;
  image: string | null; // Nullable because image is optional
}

export default function AddFeed() {
  const [post, setPost] = useState<NewPost>({
    title: '',
    content: '',
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (name: keyof NewPost, value: string) => {
    setPost({ ...post, [name]: value });
  };

  // Image picker function
  const pickImage = async () => {
    // Request permission
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setPost({ ...post, image: result.assets[0].uri });
    }
  };

  const handleAddPost = async () => {
    setLoading(true);
    try {
      const userId = await AsyncStorage.getItem('@dailykpop-user');
      if (!userId) {
        Alert.alert('Error', 'User ID not found');
        return;
      }

      let imageUrl = null;

      // Upload image if available
      if (post.image) {
        const fileName = post.image.split('/').pop();
        const { data, error: uploadError } = await supabase.storage
          .from('posts') // Ensure the bucket 'posts' exists
          .upload(fileName, {
            uri: post.image,
            type: 'image/jpeg', // or other relevant types
            name: fileName,
          });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw new Error('Image upload failed');
        }

        imageUrl = data?.path
          ? supabase.storage.from('posts').getPublicUrl(data.path).publicURL
          : null;
      }

      // Insert post into the database
      const { error } = await supabase.from('posts').insert({
        title: post.title,
        content: post.content,
        author_id: userId,
        image_url: imageUrl, // Add image URL to the post
      });

      if (error) throw error;

      Alert.alert('Post added successfully!');
      router.push('/'); // Redirect to the Feed page
    } catch (e) {
      Alert.alert('Error adding post:', e.message || e.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder='Post Title'
        value={post.title}
        onChangeText={(text) => handleInputChange('title', text)}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder='Post Content'
        value={post.content}
        onChangeText={(text) => handleInputChange('content', text)}
        multiline
      />
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        <Text style={styles.imagePickerText}>
          {post.image ? 'Change Image' : 'Upload Image'}
        </Text>
      </TouchableOpacity>

      {post.image && (
        <Image source={{ uri: post.image }} style={styles.imagePreview} />
      )}

      <Button
        title={loading ? 'Adding...' : 'Add Post'}
        onPress={handleAddPost}
        disabled={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 12,
    borderRadius: 8,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  imagePicker: {
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  imagePickerText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 8,
  },
});
