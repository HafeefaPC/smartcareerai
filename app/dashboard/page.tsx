'use client'
import { useState, } from 'react'
import ResumeUpload from '@/components/ResumeUpload'
import CareerCard from '@/components/CareerCard'
import { fetchCareerSuggestions } from '@/lib/fetchCareerSuggestions'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
    const [suggestion, setSuggestion] = useState<string | null>(null)
    const router = useRouter()

    async function handleResume(text: string) {
        const result = await fetchCareerSuggestions(text)
        console.log('Career suggestion:', result)
        setSuggestion(result)
        sessionStorage.setItem('resumeText', text)

       
        const { data: { user } } = await supabase.auth.getUser()
  console.log('Current user:', user)
  console.log('Saving suggestion:', result)

  if (user && result) {
    const { error } = await supabase
      .from('career_results')
      .insert([{ 
        user_id: user.id, 
        suggestion: result, 
        date: new Date().toISOString() 
      }]) // ❗No "id" field here!
    
    if (error) console.error('Error saving suggestion:', error)
    else console.log('Suggestion saved to DB')
        }
         router.push('/results');

    }

    return (
        <div className="p-10">
            <h1 className="text-2xl font-bold mb-4 text-green-700">Upload Your Resume</h1>
            <ResumeUpload onExtract={handleResume} />
            {suggestion && <CareerCard suggestion={suggestion} />}
        </div>
    )
}
