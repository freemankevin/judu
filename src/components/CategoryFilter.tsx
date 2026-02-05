

const categories = [
  { id: 'all', name: '全部', icon: null },
  { id: 'classical', name: '古典', icon: 'fa-scroll' },
  { id: 'modern', name: '现代', icon: 'fa-feather' },
  { id: 'love', name: '情感', icon: 'fa-heart' },
  { id: 'philosophy', name: '哲思', icon: 'fa-lightbulb' },
  { id: 'movie', name: '影视', icon: 'fa-film' }
]

interface CategoryFilterProps {
  currentCategory: string
  onCategoryChange: (category: string) => void
}

export default function CategoryFilter({ currentCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <section className="mb-10 sticky top-20 z-40 bg-paper-50/95 dark:bg-ink-950/95 backdrop-blur-sm py-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:rounded-xl transition-all">
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`filter-btn px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all flex items-center space-x-1 ${
              currentCategory === category.id
                ? 'bg-ink-900 dark:bg-paper-100 text-paper-50 dark:text-ink-900'
                : 'bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-700 text-ink-600 dark:text-paper-300 hover:border-ink-400 dark:hover:border-paper-400'
            }`}
          >
            {category.icon && <i className={`fas ${category.icon} w-3 h-3 mr-1`}></i>}
            {category.name}
          </button>
        ))}
        <button
          onClick={() => {}}
          className="px-4 py-2 rounded-full text-sm font-semibold text-ink-400 hover:text-ink-600 dark:hover:text-paper-200 whitespace-nowrap transition-all"
        >
          更多 <span className="text-xs">▼</span>
        </button>
      </div>
    </section>
  )
}
