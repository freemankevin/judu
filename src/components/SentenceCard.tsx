import { useState } from 'react'
import { Sentence } from '@/utils/types'
import { useToast } from '@/hooks/useToast'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faCopy, faShareAlt, faQuoteLeft } from '@fortawesome/free-solid-svg-icons'
import '@fortawesome/fontawesome-svg-core/styles.css'

interface SentenceCardProps {
  sentence: Sentence
}

export default function SentenceCard({ sentence }: SentenceCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [likes, setLikes] = useState(sentence.likes)
  const { showToast } = useToast()

  const copySentence = async () => {
    try {
      await navigator.clipboard.writeText(`${sentence.content} —— ${sentence.author}`)
      showToast('已复制到剪贴板')
    } catch (err) {
      showToast('复制失败，请手动复制')
    }
  }

  const shareSentence = async () => {
    const shareText = `${sentence.content} —— ${sentence.author}`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: '句读 - 文字之美',
          text: shareText,
          url: window.location.href
        })
      } catch (err) {
        // 用户取消分享
      }
    } else {
      await copySentence()
      showToast('内容已复制，可直接分享')
    }
  }

  const toggleLike = () => {
    if (isLiked) {
      setLikes((prev: number) => prev - 1)
      setIsLiked(false)
    } else {
      setLikes((prev: number) => prev + 1)
      setIsLiked(true)
    }
  }

  const getTagLabel = (tag: string) => {
    const labels: Record<string, string> = {
      classical: '古典',
      modern: '现代',
      love: '情感',
      philosophy: '哲思',
      life: '生活',
      movie: '影视'
    }
    return labels[tag] || tag
  }

  return (
    <article className="sentence-card bg-white dark:bg-ink-900 rounded-2xl p-6 shadow-soft hover:shadow-hover relative group cursor-pointer border border-transparent hover:border-ink-200 dark:hover:border-ink-700 transition-all duration-300">
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation()
            copySentence()
          }}
          className="p-2 rounded-full bg-paper-100 dark:bg-ink-800 text-ink-600 dark:text-paper-300 hover:bg-paper-200 dark:hover:bg-ink-700"
          title="复制"
        >
          <FontAwesomeIcon icon={faCopy} className="w-4 h-4" />
        </button>
      </div>
      
      <div className="mb-4">
        <FontAwesomeIcon icon={faQuoteLeft} className="w-8 h-8 text-paper-400 dark:text-ink-700" />
      </div>
      
      <p className="font-serif text-lg leading-relaxed text-ink-900 dark:text-paper-50 mb-6 line-clamp-4">
        {sentence.content}
      </p>
      
      <div className="flex items-center justify-between pt-4 border-t border-ink-100 dark:border-ink-800">
        <div className="flex flex-col">
          <span className="font-medium text-sm text-ink-800 dark:text-paper-200">{sentence.author}</span>
          {sentence.source && (
            <span className="text-xs text-ink-500 dark:text-paper-500 truncate max-w-[150px]">
              {sentence.source}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleLike()
            }}
            className={`flex items-center space-x-1 transition-colors ${
              isLiked ? 'text-red-500' : 'text-ink-400 dark:text-paper-500 hover:text-red-500 dark:hover:text-red-400'
            }`}
          >
            <FontAwesomeIcon icon={faHeart} className={`w-4 h-4 ${isLiked ? 'text-red-500' : ''}`} />
            <span className="text-xs">{likes}</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              shareSentence()
            }}
            className="text-ink-400 dark:text-paper-500 hover:text-ink-600 dark:hover:text-paper-300"
          >
            <FontAwesomeIcon icon={faShareAlt} className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {sentence.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {sentence.tags.map((tag: string, index: number) => (
            <span
              key={index}
              className="text-xs px-2 py-1 rounded-md bg-paper-100 dark:bg-ink-800 text-ink-600 dark:text-paper-400"
            >
              {getTagLabel(tag)}
            </span>
          ))}
        </div>
      )}
    </article>
  )
}
