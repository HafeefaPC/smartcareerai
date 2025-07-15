export async function fetchCareerSuggestions(resumeText: string): Promise<string | null> {
  const prompt = `
Suggest 3 ideal career paths for someone with this resume:
${resumeText}
Also list required skills and free online course platforms.
`.trim()

  const response = await fetch("https://api-inference.huggingface.co/models/google/flan-t5-base", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.HUGGINGFACE_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: prompt,
      options: {
        wait_for_model: true,
      }
    }),
  })

  if (!response.ok) {
    console.error('Error from HuggingFace API:', await response.text())
    return null
  }

  const data = await response.json()

  // For models like FLAN-T5, output is usually: [{ generated_text: "..." }]
  const generatedText = data[0]?.generated_text || null
  console.log('HuggingFace response:', generatedText)
  return generatedText
}
