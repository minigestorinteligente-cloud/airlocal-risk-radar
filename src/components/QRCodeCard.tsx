"use client"

import QRCode from "react-qr-code"

export default function QRCodeCard({ url }: any) {

  return (

    <div className="border rounded-xl p-4 shadow-sm text-center">

      <h2 className="text-lg font-semibold mb-3">
        Scan for House Guide
      </h2>

      <div className="flex justify-center">

        <QRCode
          value={url}
          size={160}
        />

      </div>

      <p className="text-sm mt-3 text-gray-500">
        Guests can scan this QR to open the guide
      </p>

    </div>
  )
}