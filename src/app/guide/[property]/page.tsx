import WelcomeCard from "@/components/WelcomeCard"
import WifiCard from "@/components/WifiCard"
import ApplianceGuide from "@/components/ApplianceGuide"
import GuestPulse from "@/components/GuestPulse"
import LanguageSwitcher from "@/components/LanguageSwitcher"
import PoweredBy from "@/components/PoweredBy"

import HouseRulesCard from "@/components/HouseRulesCard"
import RecommendationsCard from "@/components/RecommendationsCard"
import QRCodeCard from "@/components/QRCodeCard"

import { getGuide } from "@/lib/guidesStore"

export default async function GuidePage({ params }: any) {

  const { property } = await params

  const guide = getGuide(property)

  if (!guide) {
    return (
      <div className="p-10 text-center">
        Guide not found
      </div>
    )
  }

  const url = `http://localhost:3000/guide/${property}`

  return (

    <div className="max-w-xl mx-auto p-6 space-y-6">

      <div className="flex justify-end">
        <LanguageSwitcher />
      </div>

      <WelcomeCard property={guide.propertyName} />

      <WifiCard
        network={guide.wifiNetwork}
        password={guide.wifiPassword}
      />

      <HouseRulesCard rules={guide.houseRules} />

      <ApplianceGuide text={guide.appliances} />

      <RecommendationsCard places={guide.recommendations} />

      <QRCodeCard url={url} />

      <GuestPulse />

      <PoweredBy />

    </div>
  )
}