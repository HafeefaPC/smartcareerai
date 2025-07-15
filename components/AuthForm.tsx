'use client'
import { useState } from 'react'
import { supabase } from '../lib/supabase/client'

export default function AuthForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) alert(error.message)
    else window.location.href = '/dashboard'
    setLoading(false)
  }

  const handleSignup = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) alert(error.message)
    else alert('Check your email to confirm!')
    setLoading(false)
  }

  return (
    <div className="flex flex-col gap-4 w-[300px] mx-auto mt-24">
      <input className="border px-2 py-1" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input className="border px-2 py-1" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
      <button className="bg-blue-500 text-white p-2 rounded" onClick={handleLogin} disabled={loading}>Login</button>
      <button className="bg-green-500 text-white p-2 rounded" onClick={handleSignup} disabled={loading}>Signup</button>
    </div>
  )
}
