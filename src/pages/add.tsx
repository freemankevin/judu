import { useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Navbar from '@/components/Navbar'
import { githubService } from '@/services/github'
import { useToast } from '@/hooks/useToast'

export default function AddSentence() {
  const [formData, setFormData] = useState({
    content: '',
    author: '',
    source: '',
    tags: [] as string[],
    mood: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { showToast } = useToast()

  const availableTags = [
    { value: 'classical', label: '古典', icon: '📜' },
    { value: 'modern', label: '现代', icon: '🪶' },
    { value: 'love', label: '情感', icon: '❤️' },
    { value: 'philosophy', label: '哲思', icon: '💡' },
    { value: 'life', label: '生活', icon: '🌱' },
    { value: 'movie', label: '影视', icon: '🎬' }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleTagToggle = (tagValue: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tagValue)
        ? prev.tags.filter(t => t !== tagValue)
        : [...prev.tags, tagValue]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.content.trim()) {
      showToast('请输入句子内容')
      return
    }

    if (!formData.author.trim()) {
      showToast('请输入作者')
      return
    }

    setIsSubmitting(true)

    try {
      const success = await githubService.createSentence({
        content: formData.content.trim(),
        author: formData.author.trim(),
        source: formData.source.trim(),
        tags: formData.tags,
        mood: formData.mood.trim()
      })

      if (success) {
        showToast('句子收录成功！')
        setTimeout(() => {
          router.push('/')
        }, 1500)
      } else {
        showToast('收录失败，请稍后重试')
      }
    } catch (error) {
      console.error('Failed to submit sentence:', error)
      showToast('收录失败，请稍后重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Head>
        <title>收录句子 | 句读</title>
        <meta name="description" content="收录新的句子到句读平台" />
      </Head>

      <div className="min-h-screen bg-paper-50 text-ink-900 font-sans antialiased transition-colors duration-300 dark:bg-ink-950 dark:text-paper-100">
        <Navbar />
        
        <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="font-serif text-3xl font-medium mb-2">收录新句子</h1>
            <p className="text-ink-500 dark:text-paper-400">
              分享你喜欢的句子，让更多人感受到文字之美
            </p>
          </div>

          <div className="bg-white dark:bg-ink-900 rounded-2xl p-8 shadow-soft">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-ink-600 dark:text-paper-400 mb-2">
                  句子内容 <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full p-4 border border-ink-200 dark:border-ink-700 rounded-lg bg-paper-50 dark:bg-ink-950 focus:ring-2 focus:ring-ink-200 dark:focus:ring-ink-700 focus:outline-none resize-none font-serif text-lg"
                  placeholder="请输入你想收藏的句子..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="author" className="block text-sm font-medium text-ink-600 dark:text-paper-400 mb-2">
                    作者 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="author"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-ink-200 dark:border-ink-700 rounded-lg bg-paper-50 dark:bg-ink-950 focus:ring-2 focus:ring-ink-200 dark:focus:ring-ink-700 focus:outline-none"
                    placeholder="作者姓名"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="source" className="block text-sm font-medium text-ink-600 dark:text-paper-400 mb-2">
                    出处
                  </label>
                  <input
                    type="text"
                    id="source"
                    name="source"
                    value={formData.source}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-ink-200 dark:border-ink-700 rounded-lg bg-paper-50 dark:bg-ink-950 focus:ring-2 focus:ring-ink-200 dark:focus:ring-ink-700 focus:outline-none"
                    placeholder="书名/电影/歌曲等"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink-600 dark:text-paper-400 mb-2">
                  标签
                </label>
                <div className="flex flex-wrap gap-3">
                  {availableTags.map(tag => (
                    <label key={tag.value} className="cursor-pointer">
                      <input
                        type="checkbox"
                        className="peer hidden"
                        checked={formData.tags.includes(tag.value)}
                        onChange={() => handleTagToggle(tag.value)}
                      />
                      <span className="inline-flex items-center space-x-1 px-3 py-2 rounded-full text-sm border border-ink-200 dark:border-ink-700 peer-checked:bg-ink-900 peer-checked:text-paper-50 dark:peer-checked:bg-paper-100 dark:peer-checked:text-ink-900 peer-checked:border-transparent transition-all">
                        <span>{tag.icon}</span>
                        <span>{tag.label}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="mood" className="block text-sm font-medium text-ink-600 dark:text-paper-400 mb-2">
                  情感
                </label>
                <input
                  type="text"
                  id="mood"
                  name="mood"
                  value={formData.mood}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-ink-200 dark:border-ink-700 rounded-lg bg-paper-50 dark:bg-ink-950 focus:ring-2 focus:ring-ink-200 dark:focus:ring-ink-700 focus:outline-none"
                  placeholder="如：温暖、励志、伤感等"
                />
              </div>

              <div className="pt-4 flex items-center justify-end space-x-4 border-t border-ink-100 dark:border-ink-800">
                <button
                  type="button"
                  onClick={() => router.push('/')}
                  className="px-6 py-2 text-ink-600 dark:text-paper-400 hover:bg-ink-100 dark:hover:bg-ink-800 rounded-lg transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-2 bg-ink-900 dark:bg-paper-100 text-paper-50 dark:text-ink-900 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                      <span>提交中...</span>
                    </>
                  ) : (
                    <span>提交收录</span>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-8 p-4 bg-paper-100 dark:bg-ink-800 rounded-lg">
              <div className="flex items-start space-x-2 text-sm text-ink-600 dark:text-paper-400">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <p>
                  您的提交将被保存到本地存储（开发模式），或提交到 GitHub Issues（生产模式）。
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}