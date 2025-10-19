import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export async function POST(request: NextRequest) {
  try {
    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    const { cardType, timeSlot, destination, context } = await request.json()

    if (!cardType) {
      return NextResponse.json(
        { error: 'Card type is required' },
        { status: 400 }
      )
    }

    // Build context string
    let contextString = ''
    if (context) {
      const { existingCards, dayTitle } = context
      
      if (dayTitle) {
        contextString += `\nDay theme: ${dayTitle}`
      }
      
      if (existingCards && existingCards.length > 0) {
        contextString += `\n\nOther activities in this day:`
        existingCards.forEach((card: any) => {
          contextString += `\n- ${card.title} (${card.type})${card.startTime ? ` at ${card.startTime}` : ''}`
        })
      }
    }

    const systemPrompt = `You are a travel planning assistant. Generate ONE alternative suggestion for a ${cardType} in JSON format.

Return ONLY a JSON object with this exact structure:
{
  "type": "${cardType}",
  "title": "Specific name or activity",
  "description": "Brief 1-2 sentence description",
  "duration": number (in minutes),
  "tags": ["tag1", "tag2"],
  "location": "Specific location",
  "startTime": "${timeSlot}" (keep the same time slot)
}

Make the suggestion:
- Different from existing activities
- Specific to the destination
- Realistic and well-timed
- Include actual place names`

    const userPrompt = `Destination: ${destination || 'the destination'}
Time slot: ${timeSlot || 'flexible'}${contextString}

Generate ONE alternative ${cardType} suggestion for ${destination || 'this destination'}.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.8, // Higher temperature for more variety
      response_format: { type: 'json_object' },
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from OpenAI')
    }

    const card = JSON.parse(content)

    return NextResponse.json({
      card: {
        type: card.type || cardType,
        title: card.title || 'Untitled',
        description: card.description || '',
        duration: card.duration || 120,
        tags: Array.isArray(card.tags) ? card.tags : [],
        location: card.location,
        startTime: card.startTime || timeSlot,
      },
    })
  } catch (error: any) {
    console.error('OpenAI API error:', error)
    
    if (error?.status === 401) {
      return NextResponse.json(
        { error: 'Invalid OpenAI API key' },
        { status: 401 }
      )
    }
    
    if (error?.status === 429) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }

    return NextResponse.json(
      { error: error?.message || 'Failed to regenerate card' },
      { status: 500 }
    )
  }
}
