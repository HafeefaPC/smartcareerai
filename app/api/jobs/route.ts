import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { resumeText, location  } = await req.json()

  const response = await fetch('https://api.together.xyz/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'meta-llama/Llama-3-8b-chat-hf',
      messages: [
        {
          role: 'system',
          content: 'You are a career coach. Suggest 5 or more current job titles based on the given resume. DO NOT return URLs. Just return the titles.',
        },
        {
          role: 'user',
          content: resumeText,
        },
      ],
    }),
  })

  const data = await response.json()
  const rawText = data.choices?.[0]?.message?.content || ''
  console.log('Raw suggestions from LLM:', rawText)

  const lines = rawText.split('\n').filter((line: string) => line.trim() !== '')
const jobTitles: string[] = []

 

    for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    const match = line.match(/^\d+\.\s*(.+)$/)
    if (match) {
      jobTitles.push(match[1].trim())
    } else if (!line.match(/^https?:\/\//)) {
      jobTitles.push(line.trim())
    }
  }

  const jobs: { title: string; url: string }[] = []

  for (const title of jobTitles) {
    const query = encodeURIComponent(title)
    const loc = encodeURIComponent(location )
    const url = `https://www.linkedin.com/jobs/search/?keywords=${query}&location=${loc}&f_TPR=r86400&sortBy=R`
    jobs.push({ title, url })
  }

  console.log('Final LinkedIn job URLs:', jobs)

  return NextResponse.json(jobs)
}
