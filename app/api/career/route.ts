import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    const { resumeText } = await req.json()

    const prompt = `Based on this resume, suggest 3 ideal career paths with required skills and free online learning platforms:\n\n${resumeText}\n\nResponse format:\n1. Career Path Name\n   Required Skills: [skills]\n   Free Courses: [platforms]\n\n2. Career Path Name\n   Required Skills: [skills]\n   Free Courses: [platforms]\n\n3. Career Path Name\n   Required Skills: [skills]\n   Free Courses: [platforms]`

    try {
        const response = await fetch('https://api.together.xyz/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'meta-llama/Llama-3-8b-chat-hf', // ✅ use a valid Together AI model
                messages: [
                    {
                        role: 'system',
                        content: 'You are a career coach that gives suggestions based on user input.',
                    },
                    {
                        role: 'user',
                        content: resumeText,
                    },
                ],
            }),
        })

        const data = await response.json()

        if (!response.ok || !data.choices || !data.choices[0]?.message?.content) {
            console.error('Together API error:', data)
            return NextResponse.json({ error: 'Failed to generate suggestion' }, { status: 500 })
        }

        return NextResponse.json({ suggestion: data.choices[0].message.content })


    } catch (error: any) {
        console.error('Together AI error:', error)

        // Fallback to enhanced local processing
        const localSuggestion = generateEnhancedLocalSuggestions(resumeText)
        return NextResponse.json({
            suggestion: localSuggestion,
            source: "local_processing"
        })
    }
}

function generateEnhancedLocalSuggestions(resumeText: string): string {
    const text = resumeText.toLowerCase()

    // Enhanced keyword detection
    const techSkills = {
        frontend: ['react', 'angular', 'vue', 'javascript', 'html', 'css', 'frontend'],
        backend: ['node', 'python', 'java', 'php', 'backend', 'api', 'server'],
        data: ['python', 'sql', 'data', 'analytics', 'pandas', 'numpy', 'machine learning', 'ai'],
        mobile: ['react native', 'flutter', 'swift', 'kotlin', 'mobile', 'ios', 'android'],
        devops: ['docker', 'kubernetes', 'aws', 'azure', 'devops', 'ci/cd'],
        design: ['figma', 'photoshop', 'illustrator', 'ui', 'ux', 'design'],
        marketing: ['marketing', 'seo', 'social media', 'content', 'analytics'],
        management: ['project', 'scrum', 'agile', 'leadership', 'management']
    }

    type CareerKey = keyof typeof careerMap;

    const detectedSkills: CareerKey[] = []
    for (const [category, keywords] of Object.entries(techSkills)) {
        if (keywords.some(keyword => text.includes(keyword))) {
            detectedSkills.push(category as CareerKey)
        }
    }

    const careerMap = {
        frontend: {
            title: "Frontend Developer",
            skills: "React/Vue/Angular, JavaScript, HTML/CSS, Git, Responsive Design",
            courses: "freeCodeCamp, Scrimba, The Odin Project, MDN Web Docs"
        },
        backend: {
            title: "Backend Developer",
            skills: "Node.js/Python/Java, APIs, Databases, Server Management",
            courses: "freeCodeCamp, Codecademy, Django/Flask tutorials, Express.js docs"
        },
        data: {
            title: "Data Scientist",
            skills: "Python, SQL, Pandas, Machine Learning, Statistics, Data Visualization",
            courses: "Kaggle Learn, Coursera ML, edX Data Science, Python.org"
        },
        mobile: {
            title: "Mobile Developer",
            skills: "React Native/Flutter, Mobile UI/UX, App Store deployment",
            courses: "React Native docs, Flutter.dev, iOS/Android documentation"
        },
        devops: {
            title: "DevOps Engineer",
            skills: "Docker, Kubernetes, AWS/Azure, CI/CD, Linux",
            courses: "AWS Free Tier, Azure Learn, Docker docs, Kubernetes tutorials"
        },
        design: {
            title: "UX/UI Designer",
            skills: "Figma, User Research, Prototyping, Design Systems",
            courses: "Google UX Certificate, Figma Academy, Adobe tutorials"
        },
        marketing: {
            title: "Digital Marketing Specialist",
            skills: "SEO, Google Analytics, Social Media, Content Strategy",
            courses: "Google Digital Marketing, HubSpot Academy, Meta Blueprint"
        },
        management: {
            title: "Technical Project Manager",
            skills: "Agile/Scrum, Leadership, Communication, Risk Management",
            courses: "Coursera PM Certificate, Scrum.org, PMI resources"
        }
    }

    let suggestions = "🎯 **Personalized Career Recommendations**\n\n"

    // Get top 3 suggestions based on detected skills
    const recommendedCareers = detectedSkills.slice(0, 3).map(skill => careerMap[skill])

    // Add default careers if less than 3 detected
    const defaultCareers = [
        careerMap.frontend,
        careerMap.data,
        careerMap.marketing
    ]

    const finalCareers = [...recommendedCareers]
    defaultCareers.forEach(career => {
        if (finalCareers.length < 3 && !finalCareers.includes(career)) {
            finalCareers.push(career)
        }
    })

    finalCareers.slice(0, 3).forEach((career, index) => {
        suggestions += `**${index + 1}. ${career.title}**\n`
        suggestions += `   📋 Required Skills: ${career.skills}\n`
        suggestions += `   🎓 Free Learning Platforms: ${career.courses}\n\n`
    })

    suggestions += "💡 **Pro Tips:**\n"
    suggestions += "• Build a portfolio/GitHub profile\n"
    suggestions += "• Join relevant communities (Discord, Reddit)\n"
    suggestions += "• Practice with real projects\n"
    suggestions += "• Network on LinkedIn\n"

    return suggestions
}