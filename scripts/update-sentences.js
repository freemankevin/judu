const { Octokit } = require('@octokit/rest');
const fs = require('fs');

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const owner = process.env.GITHUB_REPOSITORY.split('/')[0];
const repo = process.env.GITHUB_REPOSITORY.split('/')[1];

async function updateSentences() {
  try {
    const { data: issues } = await octokit.issues.listForRepo({
      owner,
      repo,
      state: 'all',
      labels: 'sentence',
      per_page: 100,
    });
    
    const sentences = issues.map(issue => {
      const tags = issue.labels
        .filter(label => typeof label === 'object' && label.name !== 'sentence')
        .map(label => typeof label === 'object' ? label.name : '')
        .filter(Boolean);
        
      return {
        id: `s${issue.number}`,
        content: extractContent(issue.body) || issue.title.replace('新句子收录: ', ''),
        author: extractAuthor(issue.body) || '未知作者',
        source: extractSource(issue.body),
        tags,
        likes: issue.reactions?.['+1'] || 0,
        date_added: issue.created_at,
      };
    });
    
    const data = {
      sentences,
      metadata: {
        total: sentences.length,
        last_updated: new Date().toISOString(),
      },
    };
    
    fs.writeFileSync('data/sentences.json', JSON.stringify(data, null, 2));
    console.log(`Updated ${sentences.length} sentences`);
    
  } catch (error) {
    console.error('Error updating sentences:', error);
    process.exit(1);
  }
}

function extractContent(body) {
  if (!body) return '';
  const match = body.match(/\*\*句子内容\*\*\n(.+?)(?:\n\n|$)/s);
  return match ? match[1].trim() : '';
}

function extractAuthor(body) {
  if (!body) return '';
  const match = body.match(/\*\*作者\*\*\n(.+?)(?:\n\n|$)/s);
  return match ? match[1].trim() : '';
}

function extractSource(body) {
  if (!body) return '';
  const match = body.match(/\*\*出处\*\*\n(.+?)(?:\n\n|$)/s);
  return match ? match[1].trim() : '';
}

updateSentences();