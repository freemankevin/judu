import { Sentence, GitHubIssue } from '../utils/types'
import { localDataService } from './localData'

const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN
const GITHUB_OWNER = process.env.NEXT_PUBLIC_GITHUB_OWNER
const GITHUB_REPO = process.env.NEXT_PUBLIC_GITHUB_REPO

const GITHUB_API_BASE = 'https://api.github.com'

class GitHubService {
  private headers: Record<string, string>
  private isConfigured: boolean

  constructor() {
    this.isConfigured = !!(GITHUB_TOKEN && GITHUB_OWNER && GITHUB_REPO)
    
    this.headers = {
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    }
    
    if (GITHUB_TOKEN) {
      this.headers['Authorization'] = `token ${GITHUB_TOKEN}`
    }
    
    if (!this.isConfigured) {
      console.log('GitHub 环境变量未配置，将使用本地数据模式')
    }
  }

  async getSentences(): Promise<Sentence[]> {
    // 如果没有配置 GitHub 环境变量，使用本地数据
    if (!this.isConfigured) {
      console.log('使用本地数据服务')
      return localDataService.getSentences()
    }

    try {
      const response = await fetch(
        `${GITHUB_API_BASE}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues?state=all&labels=sentence&per_page=100`,
        { headers: this.headers }
      )

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`)
      }

      const issues: GitHubIssue[] = await response.json()
      return this.parseIssuesToSentences(issues)
    } catch (error) {
      console.error('Failed to fetch sentences from GitHub, falling back to local data:', error)
      // 如果 GitHub API 调用失败，回退到本地数据
      return localDataService.getSentences()
    }
  }

  async createSentence(sentence: Omit<Sentence, 'id' | 'date_added' | 'likes'>): Promise<boolean> {
    // 如果没有配置 GitHub 环境变量，使用本地数据服务
    if (!this.isConfigured) {
      console.log('使用本地数据服务创建句子')
      return localDataService.createSentence(sentence)
    }

    try {
      const title = `新句子收录: ${sentence.content.substring(0, 50)}...`
      const body = this.formatSentenceBody(sentence)
      
      const response = await fetch(
        `${GITHUB_API_BASE}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues`,
        {
          method: 'POST',
          headers: this.headers,
          body: JSON.stringify({
            title,
            body,
            labels: ['sentence', ...sentence.tags]
          })
        }
      )

      return response.ok
    } catch (error) {
      console.error('Failed to create sentence on GitHub, falling back to local data:', error)
      // 如果 GitHub API 调用失败，回退到本地数据服务
      return localDataService.createSentence(sentence)
    }
  }

  private parseIssuesToSentences(issues: GitHubIssue[]): Sentence[] {
    return issues.map(issue => {
      const parsed = this.parseIssueBody(issue.body)
      const tags = issue.labels
        .filter((label: any) => typeof label === 'object' && label.name !== 'sentence')
        .map((label: any) => (typeof label === 'object' ? label.name : ''))
        .filter(Boolean)

      return {
        id: `s${issue.number}`,
        content: parsed.content || issue.title.replace('新句子收录: ', ''),
        author: parsed.author || '未知作者',
        source: parsed.source,
        tags,
        likes: issue.reactions?.['+1'] || 0,
        date_added: issue.created_at,
        mood: parsed.mood
      }
    })
  }

  private parseIssueBody(body: string): { content: string; author: string; source?: string; mood?: string } {
    const sections = body.split('\n\n')
    const result: any = {}

    sections.forEach(section => {
      if (section.startsWith('**句子内容**')) {
        result.content = section.replace('**句子内容**\n', '').trim()
      } else if (section.startsWith('**作者**')) {
        result.author = section.replace('**作者**\n', '').trim()
      } else if (section.startsWith('**出处**')) {
        result.source = section.replace('**出处**\n', '').trim()
      } else if (section.startsWith('**情感**')) {
        result.mood = section.replace('**情感**\n', '').trim()
      }
    })

    return result
  }

  private formatSentenceBody(sentence: Omit<Sentence, 'id' | 'date_added' | 'likes'>): string {
    return `**句子内容**
${sentence.content}

**作者**
${sentence.author}

**出处**
${sentence.source || '未知'}

**情感**
${sentence.mood || '无'}`
  }
}

export const githubService = new GitHubService()
