"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function CreateGuideWizard() {

  const router = useRouter()

  const [step, setStep] = useState(1)

  const [locationInput, setLocationInput] = useState("")

  const [propertyName, setPropertyName] = useState("")
  const [city, setCity] = useState("")
  const [guests, setGuests] = useState("")
  const [bedrooms, setBedrooms] = useState("")
  const [bathrooms, setBathrooms] = useState("")

  const [amenities, setAmenities] = useState<string[]>([])

  const [wifiName, setWifiName] = useState("")
  const [wifiPassword, setWifiPassword] = useState("")
  const [checkin, setCheckin] = useState("")

  function toggleAmenity(name:string){

    if(amenities.includes(name)){
      setAmenities(amenities.filter(a => a !== name))
    } else {
      setAmenities([...amenities, name])
    }

  }

  async function generateGuide(){

    const res = await fetch("/api/create-guide",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        propertyName,
        city,
        guests,
        bedrooms,
        bathrooms,
        amenities,
        wifiName,
        wifiPassword,
        checkin,
        locationInput
      })
    })

    const data = await res.json()

    router.push(`/guide/${data.id}`)
  }

  return (

    <div className="min-h-screen bg-gradient-to-b from-[#0B0F1A] via-[#111827] to-black flex items-center justify-center px-6">

      <div className="w-full max-w-xl">

        {/* LOGO */}

        <div className="flex justify-center mb-6">

          <Image
            src="/airlocal-logo.png"
            width={140}
            height={60}
            alt="Airlocal"
          />

        </div>


        {/* HEADER */}

        <div className="text-center mb-8">

          <h1 className="text-3xl font-bold text-white mb-2">
            Create your AI Guest Guide
          </h1>

          <p className="text-gray-400 text-sm max-w-md mx-auto">
            Airlocal builds a smart digital guide for your guests using your
            property location and amenities.
          </p>

        </div>


        {/* CARD */}

        <div className="bg-white rounded-2xl shadow-2xl p-8">


          {/* STEP 1 */}

          {step === 1 && (

            <div>

              <div className="text-xs text-[#27C9B8] font-semibold mb-2">
                STEP 1 — PROPERTY LOCATION
              </div>

              <h2 className="text-xl font-bold mb-2">
                Add your property location
              </h2>

              <p className="text-gray-500 text-sm mb-6">
                Paste a Google Maps link, address or listing link.
              </p>

              <input
                className="w-full bg-gray-100 border rounded-lg p-3 mb-6"
                placeholder="Google Maps link, address or Airbnb listing"
                value={locationInput}
                onChange={(e)=>setLocationInput(e.target.value)}
              />

              <button
                onClick={()=>setStep(2)}
                className="w-full bg-[#27C9B8] text-black font-semibold p-3 rounded-lg hover:bg-[#7CFF5B] transition"
              >
                Analyze location with AI
              </button>

            </div>

          )}


          {/* STEP 2 */}

          {step === 2 && (

            <div>

              <div className="text-xs text-[#27C9B8] font-semibold mb-2">
                STEP 2 — PROPERTY DETAILS
              </div>

              <h2 className="text-xl font-bold mb-6">
                Tell us about your property
              </h2>

              <input
                className="w-full bg-gray-100 border rounded-lg p-3 mb-3"
                placeholder="Property name"
                value={propertyName}
                onChange={(e)=>setPropertyName(e.target.value)}
              />

              <input
                className="w-full bg-gray-100 border rounded-lg p-3 mb-3"
                placeholder="City"
                value={city}
                onChange={(e)=>setCity(e.target.value)}
              />

              <input
                className="w-full bg-gray-100 border rounded-lg p-3 mb-3"
                placeholder="Guests capacity"
                value={guests}
                onChange={(e)=>setGuests(e.target.value)}
              />

              <input
                className="w-full bg-gray-100 border rounded-lg p-3 mb-3"
                placeholder="Bedrooms"
                value={bedrooms}
                onChange={(e)=>setBedrooms(e.target.value)}
              />

              <input
                className="w-full bg-gray-100 border rounded-lg p-3 mb-6"
                placeholder="Bathrooms"
                value={bathrooms}
                onChange={(e)=>setBathrooms(e.target.value)}
              />

              <button
                onClick={()=>setStep(3)}
                className="w-full bg-[#27C9B8] text-black font-semibold p-3 rounded-lg hover:bg-[#7CFF5B]"
              >
                Continue
              </button>

            </div>

          )}


          {/* STEP 3 */}

          {step === 3 && (

            <div>

              <div className="text-xs text-[#27C9B8] font-semibold mb-2">
                STEP 3 — AMENITIES
              </div>

              <h2 className="text-xl font-bold mb-6">
                Select amenities
              </h2>

              <div className="grid grid-cols-2 gap-3 mb-6">

                {[
                  "Wifi",
                  "Air conditioning",
                  "Parking",
                  "Kitchen",
                  "Washer",
                  "TV",
                  "Workspace",
                  "Pool"
                ].map((a)=> (

                  <button
                    key={a}
                    onClick={()=>toggleAmenity(a)}
                    className={`border rounded-lg p-2 text-sm ${
                      amenities.includes(a)
                        ? "bg-[#27C9B8] text-black"
                        : "bg-gray-100"
                    }`}
                  >
                    {a}
                  </button>

                ))}

              </div>

              <button
                onClick={()=>setStep(4)}
                className="w-full bg-[#27C9B8] text-black font-semibold p-3 rounded-lg hover:bg-[#7CFF5B]"
              >
                Continue
              </button>

            </div>

          )}


          {/* STEP 4 */}

          {step === 4 && (

            <div>

              <div className="text-xs text-[#27C9B8] font-semibold mb-2">
                STEP 4 — GUEST INFO
              </div>

              <h2 className="text-xl font-bold mb-6">
                Guest instructions
              </h2>

              <input
                className="w-full bg-gray-100 border rounded-lg p-3 mb-3"
                placeholder="Wifi network"
                value={wifiName}
                onChange={(e)=>setWifiName(e.target.value)}
              />

              <input
                className="w-full bg-gray-100 border rounded-lg p-3 mb-3"
                placeholder="Wifi password"
                value={wifiPassword}
                onChange={(e)=>setWifiPassword(e.target.value)}
              />

              <textarea
                className="w-full bg-gray-100 border rounded-lg p-3 mb-6"
                placeholder="Check-in instructions"
                value={checkin}
                onChange={(e)=>setCheckin(e.target.value)}
              />

              <button
                onClick={generateGuide}
                className="w-full bg-[#27C9B8] text-black font-semibold p-3 rounded-lg hover:bg-[#7CFF5B]"
              >
                Generate guest guide
              </button>

            </div>

          )}

        </div>

      </div>

    </div>

  )
}