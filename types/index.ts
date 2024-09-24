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