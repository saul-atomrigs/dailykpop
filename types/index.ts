export interface NewPost {
  /**
   * @title 포스팅의 제목
   */
  title: string;
  /**
   * @content 포스팅의 내용
   */
  content: string;
  /**
   * @image 포스팅의 이미지 URL (= supabase storage에 저장된 이미지의 경로)
   */
  image: string | null;
}

export interface PostProps {
  post: {
    /**
     * @id 포스팅의 고유 ID
     */
    id: string;
    /**
     * @title 포스팅의 제목
     */
    title: string;
    /**
     * @content 포스팅의 내용
     */
    content: string;
    /**
     * @image_url 포스팅의 이미지 URL (= supabase storage에 저장된 이미지의 경로)
     */
    image_url: string;
    /**
     * @likes 포스팅의 좋아요 수
     */
    likes: number;
    /**
     * @comments 포스팅의 댓글 목록
     */
    comments: Array<{ id: string; text: string }>;
  };
  /**
   * @onPress 포스팅을 클릭했을 때 호출되는 함수
   */
  onPress: (post: PostProps['post']) => void;
}