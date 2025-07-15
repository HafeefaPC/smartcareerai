export const buildCareerPrompt = (resumeText: string): string => {
  return `
You are an expert career advisor. Analyze the following resume text and suggest 3 ideal career paths for the candidate. For each path, include:
- Job Title
- Why it's suitable
- Required skills
- Free courses to learn the skills

Resume:
${resumeText}
`
}
