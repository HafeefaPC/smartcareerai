'use client'
import { useState } from 'react'
import ResumeUpload from '@/components/ResumeUpload'
import CareerCard from '@/components/CareerCard'
import { fetchCareerSuggestions } from '@/lib/fetchCareerSuggestions'

export default function Dashboard() {
  const [suggestion, setSuggestion] = useState<string | null>(null)

  async function handleResume(text: string) {
   
    const result = await fetchCareerSuggestions(text)
    console.log('Career suggestion:', result)
    setSuggestion(result)
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4 text-green-700">Upload Your Resume</h1>
      <ResumeUpload onExtract={handleResume} />
      {suggestion && <CareerCard   suggestion={suggestion} />}
    </div>
  )
}
