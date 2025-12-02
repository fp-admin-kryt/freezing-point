import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { publicId, resourceType } = await request.json()

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { success: false, error: 'Cloudinary credentials not configured' },
        { status: 500 }
      )
    }

    if (!publicId) {
      return NextResponse.json(
        { success: false, error: 'Public ID is required' },
        { status: 400 }
      )
    }

    // Create signature
    const timestamp = Math.round(new Date().getTime() / 1000)
    const message = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`
    
    // Use Node.js crypto for SHA-1
    const crypto = require('crypto')
    const signature = crypto.createHash('sha1').update(message).digest('hex')

    // Delete from Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType || 'image'}/destroy`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          public_id: publicId,
          timestamp,
          api_key: apiKey,
          signature,
        }),
      }
    )

    const data = await response.json()

    if (data.result === 'ok') {
      return NextResponse.json({ success: true, message: 'Deleted successfully' })
    } else {
      return NextResponse.json(
        { success: false, error: data.error?.message || 'Deletion failed' },
        { status: 400 }
      )
    }
  } catch (error: any) {
    console.error('Error deleting from Cloudinary:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

