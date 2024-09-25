import { Dimensions } from 'react-native';

export const wait = (timeout: number) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

/** UI 관련 유틸 함수 */
export const WIDTH = Dimensions.get('window').width;
export const HEIGHT = Dimensions.get('window').height;