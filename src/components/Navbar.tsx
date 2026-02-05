import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useTheme } from '@/hooks/useTheme'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { theme, toggleTheme } = useTheme()
  const router = useRouter()

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    // 触发搜索事件
    if (query) {
      router.push(`/?search=${encodeURIComponent(query)}`, undefined, { shallow: true })
    } else {
      router.push('/', undefined, { shallow: true })
    }
  }

  const handleAddSentence = () => {
    router.push('/add')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-paper-50/80 backdrop-blur-md border-b border-ink-200/50 dark:bg-ink-950/80 dark:border-ink-800 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => router.push('/')}>
            <div className="w-8 h-8 bg-ink-900 dark:bg-paper-100 rounded-lg flex items-center justify-center">
              <span className="text-paper-50 dark:text-ink-900 font-serif font-bold text-lg">句</span>
            </div>
            <span className="font-serif text-xl font-semibold tracking-wide">句读</span>
          </div>

          {/* 搜索框 - 桌面 */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full group">
              <i className="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400 group-focus-within:text-ink-600 dark:group-focus-within:text-paper-400 transition-colors w-4 h-4"></i>
              <input
                type="search"
                placeholder="搜索句子、作者或标签..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-700 rounded-full text-sm focus:outline-none focus:border-ink-400 dark:focus:border-paper-400 focus:ring-2 focus:ring-ink-100 dark:focus:ring-ink-800 transition-all"
              />
            </div>
          </div>

          {/* 右侧操作 */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors"
              aria-label="切换主题"
            >
              {theme === 'dark' ? (
                <i className="fas fa-sun w-5 h-5 text-paper-300"></i>
              ) : (
                <i className="fas fa-moon w-5 h-5 text-ink-600"></i>
              )}
            </button>
            
            <button
              onClick={handleAddSentence}
              className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-ink-900 dark:bg-paper-100 text-paper-50 dark:text-ink-900 rounded-full text-sm font-medium hover:shadow-lg hover:scale-105 transition-all"
            >
              <i className="fas fa-plus w-4 h-4"></i>
              <span>收录句子</span>
            </button>
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-ink-100 dark:hover:bg-ink-800"
            >
              {isMenuOpen ? (
                <i className="fas fa-times w-5 h-5 text-ink-600 dark:text-paper-300"></i>
              ) : (
                <i className="fas fa-bars w-5 h-5 text-ink-600 dark:text-paper-300"></i>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 移动端菜单 */}
      {isMenuOpen && (
        <div className="md:hidden px-4 pb-3 border-t border-ink-200 dark:border-ink-800">
          <div className="relative mt-3">
            <i className="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400 w-4 h-4"></i>
            <input
              type="search"
              placeholder="搜索..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-700 rounded-lg text-sm"
            />
          </div>
          <button
            onClick={handleAddSentence}
            className="w-full mt-3 flex items-center justify-center space-x-2 px-4 py-2 bg-ink-900 dark:bg-paper-100 text-paper-50 dark:text-ink-900 rounded-lg text-sm font-medium"
          >
            <i className="fas fa-plus w-4 h-4"></i>
            <span>收录句子</span>
          </button>
        </div>
      )}
    </nav>
  )
}
