"use client"

export default function WifiCard({ network, password }: any) {

  const copyPassword = () => {
    navigator.clipboard.writeText(password)
  }

  return (

    <div className="border rounded-xl p-4 shadow-sm">

      <h2 className="text-lg font-semibold mb-2">
        Wifi
      </h2>

      <p>
        <strong>Network:</strong> {network}
      </p>

      <p className="mb-3">
        <strong>Password:</strong> {password}
      </p>

      <button
        onClick={copyPassword}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Copy Password
      </button>

    </div>
  )
}