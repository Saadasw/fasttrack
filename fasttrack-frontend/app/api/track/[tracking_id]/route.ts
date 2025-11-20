import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { tracking_id: string } }
) {
  try {
    const trackingId = params.tracking_id
    
    if (!trackingId) {
      return NextResponse.json(
        { error: 'Tracking ID is required' },
        { status: 400 }
      )
    }

    // Call the backend tracking endpoint
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    const response = await fetch(`${backendUrl}/parcels/tracking/${trackingId}`)
    
    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Parcel not found' },
          { status: 404 }
        )
      }
      throw new Error(`Backend error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
    
  } catch (error: any) {
    console.error('Tracking API error:', error)
    return NextResponse.json(
      { error: 'Failed to track parcel' },
      { status: 500 }
    )
  }
}
