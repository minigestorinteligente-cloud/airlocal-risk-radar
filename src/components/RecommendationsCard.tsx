export default function RecommendationsCard({ places }: any) {

    const list = places
      .split(/,|\n|</)
      .map((item: string) => item.trim())
      .filter((item: string) => item.length > 0)
  
    return (
  
      <div className="border rounded-xl p-4 shadow-sm">
  
        <h2 className="text-lg font-semibold mb-3">
          Local Recommendations
        </h2>
  
        <ul className="space-y-2">
  
          {list.map((item: string, i: number) => (
            <li key={i}>
              📍 {item}
            </li>
          ))}
  
        </ul>
  
      </div>
    )
  }