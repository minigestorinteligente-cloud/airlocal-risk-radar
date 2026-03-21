"use client"

import { useSearchParams, useRouter } from "next/navigation"

export default function LanguageSwitcher() {

  const params = useSearchParams()
  const router = useRouter()

  const currentLang = params.get("lang") ?? "en"

  function changeLang(lang: string) {

    const newParams = new URLSearchParams(params.toString())
    newParams.set("lang", lang)

    router.push("?" + newParams.toString())
  }

  return (
    <div className="flex justify-end text-sm mb-2">

      <button
        onClick={() => changeLang("en")}
        className={currentLang === "en" ? "font-bold mr-2" : "mr-2"}
      >
        EN
      </button>

      <button
        onClick={() => changeLang("es")}
        className={currentLang === "es" ? "font-bold" : ""}
      >
        ES
      </button>

    </div>
  )
}