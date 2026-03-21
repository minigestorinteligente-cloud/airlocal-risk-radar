export default function ApplianceGuide({ text }: any) {

  const appliances = text
    .split(/,|\n|</)
    .map((item: string) => item.trim())
    .filter((item: string) => item.length > 0)

  return (

    <div className="border rounded-xl p-4 shadow-sm">

      <h2 className="text-lg font-semibold mb-3">
        How to use appliances
      </h2>

      <ul className="space-y-2">

        {appliances.map((item: string, i: number) => (
          <li key={i}>
            • {item}
          </li>
        ))}

      </ul>

    </div>
  )
}