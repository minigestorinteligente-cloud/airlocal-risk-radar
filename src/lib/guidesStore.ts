export type GuideData = {
    id: string
    propertyName: string
    wifiNetwork: string
    wifiPassword: string
    houseRules: string
    appliances: string
    recommendations: string
  }
  
  declare global {
    var guidesStore: Record<string, GuideData>
  }
  
  if (!global.guidesStore) {
    global.guidesStore = {}
  }
  
  export function saveGuide(data: GuideData) {
    global.guidesStore[data.id] = data
  }
  
  export function getGuide(id: string) {
    return global.guidesStore[id]
  }