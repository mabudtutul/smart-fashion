import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import BlogCard from '@/components/BlogCard';
import pb from '@/lib/pocketbaseClient';
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback.js';

const BlogSection = () => {
  const { t } = useTranslationWithFallback();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      const records = await pb.collection('blog_posts').getList(1, 8, {
        sort: '-created',
        $autoCancel: false
      });
      setPosts(records.items);
    } catch (err) {
      console.error('Error fetching blog posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const scroll = (direction) => {
    const container = document.getElementById('blog-scroll');
    if (container) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="py-12 bg-white">
        <div className="container-custom mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <Skeleton className="h-8 w-48" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[3/2] rounded-lg" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <div className="py-12 bg-white">
      <div className="container-custom mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">{t('front.sections.blog', 'Latest from our blog')}</h2>
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="outline"
              className="rounded-full transition-all duration-200 active:scale-95"
              onClick={() => scroll('left')}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="rounded-full transition-all duration-200 active:scale-95"
              onClick={() => scroll('right')}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <div 
          id="blog-scroll"
          className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {posts.map((post) => (
            <div key={post.id} className="flex-none w-full md:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]">
              <BlogCard post={post} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogSection;