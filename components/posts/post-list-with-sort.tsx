'use client';

import { useState } from 'react';
import PostList from './post-list';
import PostSortSelector from './post-sort-selector';

export default function PostListWithSort() {
  const [sortType, setSortType] = useState<'new' | 'random' | 'reactions'>('new');

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <PostSortSelector currentSort={sortType} onSortChange={setSortType} />
      </div>
      <PostList sortType={sortType} />
    </div>
  );
}

