import { Sentence } from '../utils/types'
import localData from '../../data/sentences.json'

class LocalDataService {
  async getSentences(): Promise<Sentence[]> {
    try {
      // 直接返回本地 JSON 数据
      return localData.sentences.map(sentence => ({
        ...sentence,
        id: sentence.id || `s${Date.now()}`,
        likes: sentence.likes || 0,
        date_added: sentence.date_added || new Date().toISOString()
      }))
    } catch (error) {
      console.error('Failed to load local data:', error)
      return []
    }
  }

  async createSentence(sentence: Omit<Sentence, 'id' | 'date_added' | 'likes'>): Promise<boolean> {
    // 本地开发模式下，创建操作只记录到控制台
    console.log('创建新句子（本地模式）：', sentence)
    
    // 可以在这里添加本地存储逻辑，比如保存到 localStorage
    try {
      const existingData = localStorage.getItem('judu_local_sentences')
      const localSentences = existingData ? JSON.parse(existingData) : []
      
      const newSentence = {
        ...sentence,
        id: `local_${Date.now()}`,
        likes: 0,
        date_added: new Date().toISOString()
      }
      
      localSentences.push(newSentence)
      localStorage.setItem('judu_local_sentences', JSON.stringify(localSentences))
      
      return true
    } catch (error) {
      console.error('Failed to create sentence locally:', error)
      return false
    }
  }
}

export const localDataService = new LocalDataService()
