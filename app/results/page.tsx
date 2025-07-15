'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase/client'
import CareerCard from '@/components/CareerCard'

export default function ResultsPage() {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchResults = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('career_results')
        .select('suggestion')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(3)

      if (error) console.error(error)
      else setSuggestions(data.map((r: any) => r.suggestion))

      setLoading(false)
    }

    fetchResults()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Your Career Suggestions</h1>
      {loading ? <p>Loading...</p> :
        suggestions.length === 0 ? <p>No suggestions found.</p> :
          suggestions.map((s, i) => <CareerCard key={i} suggestion={s} />)}
    </div>
  )
}
