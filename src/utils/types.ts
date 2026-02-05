export interface Sentence {
  id: string
  content: string
  author: string
  source?: string
  tags: string[]
  likes: number
  date_added: string
  mood?: string
}

export interface Category {
  id: string
  name: string
  icon: string
  color: string
}

export interface GitHubIssue {
  id: number
  number: number
  title: string
  body: string
  state: string
  labels: Array<{
    id: number
    name: string
    color: string
  }>
  user: {
    login: string
    avatar_url: string
  }
  created_at: string
  updated_at: string
  comments: number
  reactions?: {
    '+1': number
    '-1': number
    laugh: number
    hooray: number
    confused: number
    heart: number
    rocket: number
    eyes: number
  }
}

export interface SearchParams {
  category?: string
  query?: string
  page?: number
  limit?: number
}
