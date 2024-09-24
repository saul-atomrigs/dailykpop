import React, { useState } from 'react';
import { Alert } from 'react-native';
import { supabase } from '@/supabaseClient';
import { decode } from 'base64-arraybuffer';

import type { NewPost } from '@/types';

/**
 * Supabase 백엔드에 포스팅을 추가하는 함수
 * @param post 포스팅의 제목, 내용, 이미지 URL
 * @param userId 포스팅의 작성자 ID
 * @param router 
 */
const useAddPost = (post: NewPost, userId: string | null, router: any) => {
  const [loading, setLoading] = useState(false);

  const handleAddPost = async () => {
    setLoading(true);
    try {
      if (!userId) {
        Alert.alert('Error', 'User ID not found');
        return;
      }

      let imageUrl = null;

      if (post.image) {
        const fileName = `image_${Date.now()}.jpg`;

        const { data, error: uploadError } = await supabase.storage
          .from('posts')
          .upload(fileName, decode(post.image), {
            contentType: 'image/jpeg',
          });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw new Error('Image upload failed');
        }

        const { data: publicUrlData } = supabase.storage
          .from('posts')
          .getPublicUrl(data.path);

        imageUrl = publicUrlData?.publicUrl || null;
      }

      const { error: insertError } = await supabase.from('posts').insert({
        title: post.title,
        content: post.content,
        author_id: userId,
        image_url: imageUrl,
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

  return { handleAddPost, loading };
};

export default useAddPost;