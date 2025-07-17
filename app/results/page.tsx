'use client'

import { useEffect, useState } from 'react'

export default function ResultPage() {
    const [resumeText, setResumeText] = useState('')
    const [jobs, setJobs] = useState<{ title: string; url: string }[]>([])
    const [loading, setLoading] = useState(false)
    const [location, setLocation] = useState('India') // Default fallback

    useEffect(() => {
        const stored = sessionStorage.getItem('resumeText')
        if (stored) {
            setResumeText(stored)
            setLoading(true)

            // Get user location
            navigator.geolocation?.getCurrentPosition(
                async (position) => {
                    try {
                        const { latitude, longitude } = position.coords

                        // Reverse geocode with Nominatim API
                        const res = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
                        )
                        const data = await res.json()
                        console.log('Reverse geocode data:', data)
                        const city =
                            data.address?.city ||
                            data.address?.town ||
                            data.address?.village ||
                            data.address?.county || // Fallback to county
                            data.address?.state_district || // Fallback to district
                            data.address?.state // Last resort
                        console.log('Detected city:', city)

                        console.log('Detected city:', city)
                        setLocation(city)

                        // Fetch jobs with location
                        fetch('/api/jobs', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ resumeText: stored, location: city }),
                        })
                            .then(res => res.json())
                            .then(data => {
                                setJobs(data.slice(1)) // Skip first job suggestion
                            })
                            .catch(err => console.error('Error fetching job suggestions:', err))
                            .finally(() => setLoading(false))
                    } catch (e) {
                        console.error('Geolocation or reverse geocode failed:', e)
                        setLoading(false)
                    }
                },
                (error) => {
                    console.warn('Location permission denied:', error)
                    // Continue with fallback
                    fetch('/api/jobs', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ resumeText: stored, location: 'India' }),
                    })
                        .then(res => res.json())
                        .then(data => {
                            setJobs(data.slice(1)) // Skip first
                        })
                        .catch(err => console.error('Error fetching job suggestions:', err))
                        .finally(() => setLoading(false))
                }
            )
        }
    }, [])

    return (
        <div className="p-10">
            <h1 className="text-2xl font-bold mb-4">
                Recommended Jobs in {location}
            </h1>
            <p className="mb-4 text-gray-600">
                Based on your resume: {resumeText.slice(0, 100)}...
            </p>

            {loading ? (
                <p>Loading job suggestions...</p>
            ) : (
                <ul className="space-y-4">
                    {jobs.map((job, index) => (
                        <li key={index} className="border p-4 rounded shadow-sm">
                            <h2 className="font-semibold">{job.title}</h2>
                            <a
                                href={job.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline"
                            >
                                Apply Now
                            </a>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
