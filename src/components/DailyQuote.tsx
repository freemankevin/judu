import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/useToast' 

interface DailyQuoteProps {
  content: string
  author: string
  source?: string
}

const sampleQuotes = [
  { content: "人生如逆旅，我亦是行人。", author: "苏轼", source: "《临江仙·送钱穆父》" },
  { content: "且将新火试新茶，诗酒趁年华。", author: "苏轼", source: "《望江南·超然台作》" },
  { content: "醉后不知天在水，满船清梦压星河。", author: "唐温如", source: "《题龙阳县青草湖》" },
  { content: "欲买桂花同载酒，终不似，少年游。", author: "刘过", source: "《唐多令·芦叶满汀洲》" },
  { content: "世界上只有一种英雄主义，就是在认清生活真相之后依然热爱生活。", author: "罗曼·罗兰", source: "《米开朗基罗传》" }
]

export default function DailyQuote() {
  const [quote, setQuote] = useState(sampleQuotes[0])
  const [isLoading, setIsLoading] = useState(false)
  const [isFlashing, setIsFlashing] = useState(false)
  const { showToast } = useToast()

  const refreshQuote = () => {
    setIsLoading(true)
    setIsFlashing(true)
    const randomQuote = sampleQuotes[Math.floor(Math.random() * sampleQuotes.length)]
    
    setTimeout(() => {
      setQuote(randomQuote)
      setIsLoading(false)
      setTimeout(() => {
        setIsFlashing(false)
      }, 300)
    }, 150)
  }

  const copyQuote = async () => {
    try {
      await navigator.clipboard.writeText(`${quote.content} —— ${quote.author}`)
      showToast('已复制到剪贴板')
    } catch (err) {
      showToast('复制失败，请手动复制')
    }
  }

  const shareQuote = async () => {
    const shareText = `${quote.content} —— ${quote.author}`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: '每日一句 | 句读',
          text: shareText,
          url: window.location.href
        })
      } catch (err) {
        // 用户取消分享
      }
    } else {
      await copyQuote()
      showToast('内容已复制，可直接分享')
    }
  }

  const formatDate = () => {
    const date = new Date()
    return date.toLocaleDateString('zh-CN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      weekday: 'long'
    })
  }

  return (
    <section className="relative mb-16">
      <div className="bg-white dark:bg-ink-900 rounded-3xl p-8 md:p-16 shadow-soft relative overflow-hidden min-h-[400px] flex items-center justify-center">
        {/* 装饰背景 */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-paper-200/50 to-transparent dark:from-ink-800/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-paper-300/30 to-transparent dark:from-ink-800/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-paper-100 dark:bg-ink-800 rounded-full text-xs text-ink-600 dark:text-paper-400 mb-8">
            <i className="fas fa-calendar-day text-sm"></i>
            <span>每日一句</span>
            <span className="w-1 h-1 bg-ink-400 rounded-full"></span>
            <span>{formatDate()}</span>
          </div>
          
          <div className="space-y-6">
            <h1 className={`font-serif text-3xl md:text-5xl font-semibold leading-relaxed text-ink-900 dark:text-paper-50 tracking-wide typing-cursor ${isLoading ? 'opacity-0' : 'opacity-100'} ${isFlashing ? 'flash-transition' : ''} transition-opacity duration-300`}>
              {quote.content}
            </h1>
            
            <div className="flex items-center justify-center space-x-4 text-ink-500 dark:text-paper-400">
              <span className="w-12 h-px bg-ink-300 dark:bg-ink-700"></span>
              <p className="font-serif text-lg">{quote.author}</p>
              {quote.source && (
                <span className="text-sm">《{quote.source.replace(/[《》]/g, '')}》</span>
              )}
              <span className="w-12 h-px bg-ink-300 dark:bg-ink-700"></span>
            </div>
          </div>

          <div className="mt-10 flex items-center justify-center space-x-4">
            <button
              onClick={refreshQuote}
              disabled={isLoading}
              className="p-3 rounded-full bg-paper-100 dark:bg-ink-800 text-ink-600 dark:text-paper-300 hover:bg-paper-200 dark:hover:bg-ink-700 transition-all hover:rotate-180 duration-500 disabled:opacity-50"
              title="换一句"
            >
              <i className={`fas fa-sync-alt text-base ${isLoading ? 'animate-spin' : ''}`}></i>
            </button>
            <button
              onClick={copyQuote}
              className="px-6 py-3 rounded-full bg-ink-900 dark:bg-paper-100 text-paper-50 dark:text-ink-900 font-medium hover:shadow-hover transition-all flex items-center space-x-2 group"
            >
              <i className="fas fa-copy text-sm group-hover:scale-110 transition-transform"></i>
              <span>复制句子</span>
            </button>
            <button
              onClick={shareQuote}
              className="p-3 rounded-full bg-paper-100 dark:bg-ink-800 text-ink-600 dark:text-paper-300 hover:bg-paper-200 dark:hover:bg-ink-700 transition-all"
            >
              <i className="fas fa-share-alt text-base"></i>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
