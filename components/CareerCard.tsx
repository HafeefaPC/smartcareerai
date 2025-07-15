export default function CareerCard({ suggestion }: { suggestion: string }) {
  return (
    <div className="border p-4 rounded shadow-md bg-white">
      <pre>{suggestion}</pre>
    </div>
  )
}
