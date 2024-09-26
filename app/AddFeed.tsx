import React, { useState } from 'react';
import {
  Button,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { NewPost } from '@/types';
import LoginPage from '@/app/LoginPage';
import { useAuth, useImagePicker, useAddPost } from '@/hooks';
import { colors, size, spacing, typography } from '@/design-tokens';

/**
 * 포스팅을 업로드하는 UI 페이지
 */
export default function AddFeed() {
  const [post, setPost] = useState<NewPost>({
    title: '',
    content: '',
    image: null,
  });
  const { userId, isAuthenticated } = useAuth();
  const router = useRouter();

  const pickImage = useImagePicker(setPost);
  const { handleAddPost, loading } = useAddPost(post, userId, router);

  const handleInputChange = (name: keyof NewPost, value: string) => {
    setPost({ ...post, [name]: value });
  };

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* 포스팅의 제목을 입력하는 텍스트 입력창 */}
      <TextInput
        style={styles.input}
        placeholder='Title'
        placeholderTextColor={colors.placeholderText}
        value={post.title}
        onChangeText={(text) => handleInputChange('title', text)}
      />
      {/* 포스팅의 내용을 입력하는 텍스트 입력창 */}
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder='Content'
        placeholderTextColor={colors.placeholderText}
        value={post.content}
        onChangeText={(text) => handleInputChange('content', text)}
        multiline
      />
      {/* 포스팅의 이미지를 업로드하는 버튼 */}
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        <Text style={styles.imagePickerText}>
          {post.image ? 'Change Image' : 'Upload Image'}
        </Text>
      </TouchableOpacity>

      {/* 포스팅의 이미지를 미리보기하는 이미지 뷰 */}
      {post.image && (
        <Image
          source={{ uri: `data:image/jpeg;base64,${post.image}` }}
          style={styles.imagePreview}
        />
      )}

      {/* 포스팅을 업로드하는 버튼 */}
      <Button
        title={loading ? 'Adding...' : 'Add Post'}
        onPress={handleAddPost}
        disabled={loading}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
    backgroundColor: colors.background,
    marginBottom: spacing.lg,
  },
  input: {
    borderWidth: size.lineWidth.micro,
    borderColor: colors.border,
    padding: spacing.sm,
    marginBottom: spacing.md,
    borderRadius: spacing.sm,
    fontSize: typography.fontSize.md,
    color: colors.text,
  },
  textArea: {
    height: size.block.medium,
    textAlignVertical: 'top',
  },
  imagePicker: {
    backgroundColor: colors.inputBackground,
    padding: spacing.md,
    borderRadius: spacing.sm,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  imagePickerText: {
    color: colors.primary,
    fontWeight: typography.fontWeight.medium,
  },
  imagePreview: {
    width: size.relative.full,
    height: size.block.xlarge,
    marginTop: spacing.md,
    borderRadius: spacing.sm,
  },
});
