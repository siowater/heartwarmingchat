'use client';

interface PostSortSelectorProps {
  currentSort: 'new' | 'random' | 'reactions';
  onSortChange: (sort: 'new' | 'random' | 'reactions') => void;
}

export default function PostSortSelector({ currentSort, onSortChange }: PostSortSelectorProps) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onSortChange('new')}
        className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
          currentSort === 'new'
            ? 'bg-purple-100 text-purple-700'
            : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
      >
        新着順
      </button>
      <button
        onClick={() => onSortChange('random')}
        className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
          currentSort === 'random'
            ? 'bg-purple-100 text-purple-700'
            : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
      >
        ランダム
      </button>
      <button
        onClick={() => onSortChange('reactions')}
        className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
          currentSort === 'reactions'
            ? 'bg-purple-100 text-purple-700'
            : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
      >
        リアクション順
      </button>
    </div>
  );
}

