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
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';

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

  const pickImage = async () => {
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
    };

    const result = await ImagePicker.launchImageLibraryAsync(options);

    // Save image if not cancelled
    if (!result.canceled) {
      const img = result.assets[0];

      // Convert the image to base64
      const base64 = await FileSystem.readAsStringAsync(img.uri, {
        encoding: 'base64',
      });

      console.log('Image selected:', img.uri); // Log the URI for debugging

      // Update the state with the base64 string
      setPost({ ...post, image: base64 });
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

      // Upload image if available (in base64 format)
      if (post.image) {
        const fileName = `image_${Date.now()}.jpg`; // Generate a unique file name
        console.log('Starting image upload...');

        // Upload image to Supabase storage
        const { data, error: uploadError } = await supabase.storage
          .from('posts')
          .upload(fileName, decode(post.image), {
            contentType: 'image/jpeg', // Specify the MIME type
          });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw new Error('Image upload failed');
        }
        console.log('Image uploaded successfully:', data);

        // Generate public URL for the uploaded image
        const { data: publicUrlData } = supabase.storage
          .from('posts')
          .getPublicUrl(data.path);

        console.log('Public URL data:', publicUrlData);

        imageUrl = publicUrlData?.publicUrl || null;
        console.log('Final image URL:', imageUrl);
      }

      // Now insert the post into the database, with the imageUrl if available
      console.log('Inserting post with image URL:', imageUrl);
      const { error: insertError } = await supabase.from('posts').insert({
        title: post.title,
        content: post.content,
        author_id: userId,
        image_url: imageUrl, // This will now have the correct URL if an image was uploaded
      });

      if (insertError) {
        console.error('Post insertion error:', insertError);
        throw insertError;
      }

      Alert.alert('Post added successfully!');
      router.push('/');
    } catch (e: any) {
      console.error('Error adding post:', e);
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
