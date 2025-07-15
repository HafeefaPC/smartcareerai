import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to SmartCareerAI</h1>
      <p className="mb-6 text-gray-600">Discover your ideal career path using AI</p>
      <div className="space-x-4">
        <Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded">Login / Signup</Link>
        <Link href="/dashboard" className="bg-green-600 text-white px-4 py-2 rounded">Go to Dashboard</Link>
      </div>
    </main>
  )
}
