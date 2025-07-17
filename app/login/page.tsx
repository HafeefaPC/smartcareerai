'use client'
import { supabase } from '../../lib/supabase/client'
import { useState } from 'react'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isSignup, setIsSignup] = useState(false)

  const handleSubmit = async () => {
    if (isSignup) {
      // Sign up the user
      const { data, error: signupError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (signupError) {
        alert(signupError.message)
        return
      }

      // After sign up, insert into users table
      const { error: insertError } = await supabase.from('users').insert([
        {
          email,
          name,
        },
      ])

      if (insertError) {
        alert('Signup succeeded but saving profile failed: ' + insertError.message)
        return
      }

      alert('Signup successful!')
      window.location.href = '/dashboard'
    } else {
      // Login the user
      const { error: loginError } = await supabase.auth.signInWithPassword({ email, password })
      if (loginError) {
        alert(loginError.message)
      } else {
        window.location.href = '/dashboard'
      }
    }
  }

  return (
    <div className="flex flex-col items-center mt-20 space-y-4">
      <h2 className="text-xl font-bold">{isSignup ? 'Signup' : 'Login'}</h2>
      {isSignup && (
        <input
          className="border p-2"
          onChange={(e) => setName(e.target.value)}
          placeholder="Full Name"
          value={name}
        />
      )}
      <input
        className="border p-2"
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        value={email}
      />
      <input
        className="border p-2"
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder="Password"
        value={password}
      />
      <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">
        {isSignup ? 'Signup' : 'Login'}
      </button>
      <p
        className="text-sm text-blue-700 cursor-pointer underline"
        onClick={() => setIsSignup(!isSignup)}
      >
        {isSignup ? 'Already have an account? Login' : "Don't have an account? Signup"}
      </p>
    </div>
  )
}
