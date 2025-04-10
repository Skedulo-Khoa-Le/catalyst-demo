export interface AddressPrediction {
  description: string
  placeId: string
}

export interface AutocompleteResult {
  predictions: AddressPrediction[]
  status: string
  errorMessage?: string | null
}

export interface PlaceDetail {
  addressComponents: {
    streetNumber: string
    route: string
    locality: string
    area2: string
    area1: string
    country: string
    postalCode: string
  }
  formattedAddress: string
  geometry: {
    lat: number
    lng: number
  }
}

export interface DistanceMatrixResponse {
  duration: {
    durationInSeconds: number
  }
  distance: {
    distanceInMeters: number
  }
  status: string
}

export interface Geocode {
  lat: number
  lng: number
}