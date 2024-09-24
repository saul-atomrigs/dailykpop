import React from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

import type { NewPost } from '@/types';

/**
 * 휴대폰 앨범에서 이미지를 선택하는 함수
 * @param setPost 포스팅의 이미지를 설정
 */
const useImagePicker = (setPost: React.Dispatch<React.SetStateAction<NewPost>>) => {
  const pickImage = async () => {
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
    };

    const result = await ImagePicker.launchImageLibraryAsync(options);

    if (!result.canceled) {
      const img = result.assets[0];
      const base64 = await FileSystem.readAsStringAsync(img.uri, {
        encoding: 'base64',
      });
      setPost((prevPost) => ({ ...prevPost, image: base64 }));
    }
  };

  return pickImage;
};

export default useImagePicker;