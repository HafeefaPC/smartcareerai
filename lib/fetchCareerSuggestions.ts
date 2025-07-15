export async function fetchCareerSuggestions(resumeText: string): Promise<string | null> {
  const response = await fetch("/api/career", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resumeText }),
  })

  const data = await response.json()
  return data.suggestion
}
