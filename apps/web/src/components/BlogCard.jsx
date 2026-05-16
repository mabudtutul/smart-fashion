import React from 'react';
import { Calendar } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { format } from 'date-fns';

const BlogCard = ({ post }) => {
  const imageUrl = post.image 
    ? pb.files.getUrl(post, post.image, { thumb: '600x400' })
    : 'https://via.placeholder.com/600x400?text=Blog+Post';

  const formattedDate = post.date 
    ? format(new Date(post.date), 'MMM dd, yyyy')
    : format(new Date(post.created), 'MMM dd, yyyy');

  return (
    <div className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="relative aspect-[3/2] overflow-hidden bg-gray-100">
        <img 
          src={imageUrl} 
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      
      <div className="p-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <Calendar className="h-4 w-4" />
          <span>{formattedDate}</span>
          {post.author && (
            <>
              <span>•</span>
              <span>By {post.author}</span>
            </>
          )}
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#FF8C00] transition-colors duration-200">
          {post.title}
        </h3>
        
        {post.content && (
          <p className="text-sm text-gray-600 line-clamp-3">
            {post.content}
          </p>
        )}
      </div>
    </div>
  );
};

export default BlogCard;