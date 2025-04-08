import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, apiKey } = body

    if (!apiKey) {
      return NextResponse.json({ error: "APIキーが必要です" }, { status: 400 })
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
        }),
      },
    )

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { error: `APIエラー: ${errorData.error?.message || "不明なエラー"}` },
        { status: response.status },
      )
    }

    const data = await response.json()

    // レスポンスからテキストを抽出
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || ""

    return NextResponse.json({ text: generatedText })
  } catch (error) {
    console.error("Error generating content:", error)
    return NextResponse.json(
      { error: `エラーが発生しました: ${error instanceof Error ? error.message : "不明なエラー"}` },
      { status: 500 },
    )
  }
}

