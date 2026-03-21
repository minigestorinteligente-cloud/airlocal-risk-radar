"use client"

import { useState } from "react"

export default function GuestPulse() {

  const [status, setStatus] = useState("")

  function handleResponse(value: string) {
    setStatus(value)

    if (value === "help") {
      alert("The host has been notified to assist you.")
    }
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">

      <h2 className="text-xl font-semibold mb-4">
        How is your stay going?
      </h2>

      <div className="flex gap-3">

        <button
          onClick={() => handleResponse("great")}
          className="bg-green-500 text-white px-4 py-2 rounded-lg"
        >
          😊 Great
        </button>

        <button
          onClick={() => handleResponse("ok")}
          className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
        >
          😐 Okay
        </button>

        <button
          onClick={() => handleResponse("help")}
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          😞 Need help
        </button>

      </div>

      {status && (
        <p className="mt-4 text-gray-600">
          Thanks for your feedback!
        </p>
      )}

    </div>
  )
}