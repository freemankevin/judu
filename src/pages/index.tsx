import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Navbar from '@/components/Navbar'
import DailyQuote from '@/components/DailyQuote'
import CategoryFilter from '@/components/CategoryFilter'
import SentenceCard from '@/components/SentenceCard'
import { githubService } from '@/services/github'
import { Sentence } from '@/utils/types'
import { useToast } from '@/hooks/useToast'

export default function Home() {
  const [sentences, setSentences] = useState<Sentence[]>([])
  const [filteredSentences, setFilteredSentences] = useState<Sentence[]>([])
  const [currentCategory, setCurrentCategory] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { showToast } = useToast()

  useEffect(() => {
    loadSentences()
  }, [])

  useEffect(() => {
    const { search } = router.query
    if (search) {
      handleSearch(search as string)
    } else {
      filterSentences(currentCategory, '')
    }
  }, [router.query, sentences])

  const loadSentences = async () => {
    try {
      setIsLoading(true)
      const data = await githubService.getSentences()
      setSentences(data)
      setFilteredSentences(data)
    } catch (error) {
      console.error('Failed to load sentences:', error)
      showToast('加载失败，请稍后重试')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCategoryChange = (category: string) => {
    setCurrentCategory(category)
    const searchQuery = router.query.search as string || ''
    filterSentences(category, searchQuery)
  }

  const handleSearch = (query: string) => {
    filterSentences(currentCategory, query)
  }

  const filterSentences = (category: string, query: string) => {
    let filtered = sentences

    if (category !== 'all') {
      filtered = filtered.filter(s => s.tags.includes(category))
    }

    if (query) {
      const searchTerm = query.toLowerCase()
      filtered = filtered.filter(s => 
        s.content.toLowerCase().includes(searchTerm) || 
        s.author.toLowerCase().includes(searchTerm) ||
        (s.source && s.source.toLowerCase().includes(searchTerm))
      )
    }

    setFilteredSentences(filtered)
  }

  return (
    <>
      <Head>
        <title>句读 | 文字之美</title>
        <meta name="description" content="基于GitHub Issues的句子收藏与分享平台" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-paper-50 text-ink-900 font-sans transition-colors duration-300 dark:bg-ink-950 dark:text-paper-100">
        <Navbar />
        
        <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <DailyQuote />
          
          <CategoryFilter 
            currentCategory={currentCategory}
            onCategoryChange={handleCategoryChange}
          />

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ink-900 dark:border-paper-100"></div>
            </div>
          ) : (
            <>
              <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                {filteredSentences.map((sentence) => (
                  <SentenceCard key={sentence.id} sentence={sentence} />
                ))}
              </section>

              {filteredSentences.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-ink-500 dark:text-paper-400">暂无匹配的句子</p>
                </div>
              )}

              <div className="text-center">
                <button className="px-8 py-3 rounded-full border-2 border-ink-300 dark:border-ink-600 text-ink-600 dark:text-paper-400 font-medium hover:bg-ink-900 hover:text-paper-50 hover:border-ink-900 dark:hover:bg-paper-100 dark:hover:text-ink-900 dark:hover:border-paper-100 transition-all">
                  加载更多
                </button>
              </div>
            </>
          )}

          <section className="mt-20 pt-10 border-t border-ink-200 dark:border-ink-800">
            <div className="text-center mb-8">
              <h3 className="font-serif text-2xl font-medium mb-2">留言板</h3>
              <p className="text-ink-500 dark:text-paper-400 text-sm">基于 GitHub Discussions 的评论系统</p>
            </div>
            <div className="bg-white dark:bg-ink-900 rounded-2xl p-8 shadow-soft">
              <div className="flex flex-col items-center justify-center py-12 text-ink-400 dark:text-paper-500 space-y-4">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <p>评论系统加载中...</p>
                <p className="text-sm">需要登录 GitHub 账号参与讨论</p>
              </div>
            </div>
          </section>
        </main>

        <footer className="bg-white dark:bg-ink-900 border-t border-ink-200 dark:border-ink-800 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-ink-900 dark:bg-paper-100 rounded flex items-center justify-center">
                  <span className="text-paper-50 dark:text-ink-900 font-serif text-xs font-bold">句</span>
                </div>
                <span className="font-serif font-medium">句读</span>
                <span className="text-ink-400 dark:text-paper-500 text-sm">|</span>
                <span className="text-ink-400 dark:text-paper-500 text-sm">文字收藏与分享</span>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-ink-500 dark:text-paper-400">
                <a href="https://github.com/FreemanKevin/judu" target="_blank" rel="noopener noreferrer" className="hover:text-ink-900 dark:hover:text-paper-100 transition-colors">
                  <i className="fa-brands fa-github text-lg"></i>
                </a>
                <span className="w-1 h-1 bg-ink-400 dark:bg-paper-600 rounded-full"></span>
                <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="hover:text-ink-900 dark:hover:text-paper-100 transition-colors">
                  <svg height="16" viewBox="0 0 75 65" fill="currentColor" className="text-ink-500 dark:text-paper-400 hover:text-ink-900 dark:hover:text-paper-100">
                    <path d="M37.59.25l36.95 64H.64l36.95-64z"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
