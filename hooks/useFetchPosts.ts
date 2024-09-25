import { useState, useEffect } from 'react';
import { supabase } from '@/supabaseClient';

interface Post {
  id: string;
  title: string;
  content: string;
  image_url: string;
  likes: number;
  comments: Array<{ id: string; text: string }>;
}

const useFetchPosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      const postsWithComments = await Promise.all(
        data.map(async (post) => {
          const { data: comments, error: commentsError } = await supabase
            .from('comments')
            .select('id, text')
            .eq('post_id', post.id);

          if (commentsError) {
            console.error('Error fetching comments:', commentsError);
            return { ...post, comments: [] };
          }

          return { ...post, comments: comments || [] };
        })
      );

      setPosts(postsWithComments);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const refetch = () => {
    fetchPosts();
  };

  return { posts, loading, error, refetch };
};

export default useFetchPosts