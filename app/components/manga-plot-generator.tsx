"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

type Character = {
  name: string
  age: string
  gender: string
  personality: string
  details: string
}

type PlotSettings = {
  title: string
  concept: string
  genres: string[]
  era: string
  location: string
  mood: string[]
  scenes: string
  storyPattern: string
}

export function MangaPlotGenerator() {
  const [apiKey, setApiKey] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPlot, setGeneratedPlot] = useState("")
  const [error, setError] = useState("")

  const [characterA, setCharacterA] = useState<Character>({
    name: "",
    age: "10代後半",
    gender: "女性",
    personality: "明るい",
    details: "",
  })

  const [characterB, setCharacterB] = useState<Character>({
    name: "",
    age: "10代後半",
    gender: "女性",
    personality: "クール",
    details: "",
  })

  const [plotSettings, setPlotSettings] = useState<PlotSettings>({
    title: "",
    concept: "",
    genres: ["恋愛"],
    era: "現代",
    location: "学校",
    mood: ["青春"],
    scenes: "3〜5",
    storyPattern: "出会いから始まる物語",
  })

  const genres = ["恋愛", "日常", "青春", "ファンタジー", "SF", "アクション", "ドラマ"]
  const eras = ["現代", "近未来", "古代", "中世", "江戸", "昭和", "その他"]
  const locations = ["学校", "田舎", "都会", "カフェ", "家", "職場", "その他"]
  const moods = ["青春", "切ない", "明るい", "暗い", "怖い", "美しい", "激しい"]
  const storyPatterns = ["出会いから始まる物語", "すれ違いの恋の物語", "友達から恋人へ", "ライバルから恋人へ"]
  const ageOptions = ["10代前半", "10代後半", "20代前半", "20代後半", "30代", "40代以上"]
  const genderOptions = ["女性", "男性", "その他"]
  const personalityOptions = ["明るい", "クール", "優しい", "厳しい", "内向的", "外交的", "天然"]

  const handleCharacterChange = (character: "A" | "B", field: keyof Character, value: string) => {
    if (character === "A") {
      setCharacterA({ ...characterA, [field]: value })
    } else {
      setCharacterB({ ...characterB, [field]: value })
    }
  }

  const handleGenreToggle = (genre: string) => {
    if (plotSettings.genres.includes(genre)) {
      setPlotSettings({
        ...plotSettings,
        genres: plotSettings.genres.filter((g) => g !== genre),
      })
    } else {
      setPlotSettings({
        ...plotSettings,
        genres: [...plotSettings.genres, genre],
      })
    }
  }

  const handleMoodToggle = (mood: string) => {
    if (plotSettings.mood.includes(mood)) {
      setPlotSettings({
        ...plotSettings,
        mood: plotSettings.mood.filter((m) => m !== mood),
      })
    } else {
      setPlotSettings({
        ...plotSettings,
        mood: [...plotSettings.mood, mood],
      })
    }
  }

  const generatePlot = async () => {
    if (!apiKey) {
      setError("APIキーを入力してください")
      return
    }

    setIsGenerating(true)
    setError("")

    try {
      const prompt = `
あなたは漫画や小説のプロットを生成する専門家です。与えられた設定に基づいて、魅力的で詳細なストーリープロットを作成してください。

以下の設定に基づいて、漫画または小説のプロットを日本語で生成してください。
詳細で魅力的なストーリーを作成し、起承転結を含めてください。

【基本設定】
タイトル: ${plotSettings.title || "（自動生成）"}
コンセプト: ${plotSettings.concept}
ジャンル: ${plotSettings.genres.join(", ")}
時代設定: ${plotSettings.era}
場所: ${plotSettings.location}
雰囲気: ${plotSettings.mood.join(", ")}
シーン数: ${plotSettings.scenes}
ストーリーパターン: ${plotSettings.storyPattern}

【キャラクター設定】
キャラクターA:
名前: ${characterA.name || "（未設定）"}
年齢: ${characterA.age}
性別: ${characterA.gender}
性格: ${characterA.personality}
詳細: ${characterA.details}

キャラクターB:
名前: ${characterB.name || "（未設定）"}
年齢: ${characterB.age}
性別: ${characterB.gender}
性格: ${characterB.personality}
詳細: ${characterB.details}

プロットは1000文字程度で、起承転結を含めて作成してください。
`

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          apiKey,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "不明なエラーが発生しました")
      }

      const data = await response.json()
      setGeneratedPlot(data.text)
    } catch (err) {
      console.error(err)
      setError(`エラーが発生しました: ${err instanceof Error ? err.message : "不明なエラー"}`)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="pt-6">
          <div className="mb-4">
            <Label htmlFor="api-key">Gemini APIキー（必須）</Label>
            <Input
              id="api-key"
              type="password"
              placeholder="API キーを入力..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">※ Google AI StudioからGemini APIキーを入力してください</p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="basic">基本設定</TabsTrigger>
          <TabsTrigger value="characters">キャラクター設定</TabsTrigger>
          <TabsTrigger value="story">物語設定</TabsTrigger>
          <TabsTrigger value="atmosphere">雰囲気</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">タイトル（任意）</Label>
                  <Input
                    id="title"
                    placeholder="空欄の場合は自動生成されます"
                    value={plotSettings.title}
                    onChange={(e) =>
                      setPlotSettings({
                        ...plotSettings,
                        title: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="concept">コンセプト</Label>
                  <Textarea
                    id="concept"
                    placeholder="例：高校を舞台にした青春ラブストーリー"
                    value={plotSettings.concept}
                    onChange={(e) =>
                      setPlotSettings({
                        ...plotSettings,
                        concept: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <Label>ジャンル（複数選択可）</Label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-2">
                    {genres.map((genre) => (
                      <div key={genre} className="flex items-center space-x-2">
                        <Checkbox
                          id={`genre-${genre}`}
                          checked={plotSettings.genres.includes(genre)}
                          onCheckedChange={() => handleGenreToggle(genre)}
                        />
                        <Label htmlFor={`genre-${genre}`} className="text-sm font-normal">
                          {genre}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="characters" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium text-pink-600 mb-4">キャラクターA</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="char-a-name">名前</Label>
                  <Input
                    id="char-a-name"
                    placeholder="名前"
                    value={characterA.name}
                    onChange={(e) => handleCharacterChange("A", "name", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="char-a-age">年齢</Label>
                  <Select value={characterA.age} onValueChange={(value) => handleCharacterChange("A", "age", value)}>
                    <SelectTrigger id="char-a-age">
                      <SelectValue placeholder="年齢を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {ageOptions.map((age) => (
                        <SelectItem key={age} value={age}>
                          {age}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="char-a-gender">性別</Label>
                  <Select
                    value={characterA.gender}
                    onValueChange={(value) => handleCharacterChange("A", "gender", value)}
                  >
                    <SelectTrigger id="char-a-gender">
                      <SelectValue placeholder="性別を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {genderOptions.map((gender) => (
                        <SelectItem key={gender} value={gender}>
                          {gender}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="char-a-personality">性格</Label>
                  <Select
                    value={characterA.personality}
                    onValueChange={(value) => handleCharacterChange("A", "personality", value)}
                  >
                    <SelectTrigger id="char-a-personality">
                      <SelectValue placeholder="性格を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {personalityOptions.map((personality) => (
                        <SelectItem key={personality} value={personality}>
                          {personality}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="char-a-details">その他の詳細</Label>
                  <Textarea
                    id="char-a-details"
                    placeholder="キャラクターの詳細情報"
                    value={characterA.details}
                    onChange={(e) => handleCharacterChange("A", "details", e.target.value)}
                  />
                </div>
              </div>

              <h3 className="text-lg font-medium text-pink-600 mt-8 mb-4">キャラクターB</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="char-b-name">名前</Label>
                  <Input
                    id="char-b-name"
                    placeholder="名前"
                    value={characterB.name}
                    onChange={(e) => handleCharacterChange("B", "name", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="char-b-age">年齢</Label>
                  <Select value={characterB.age} onValueChange={(value) => handleCharacterChange("B", "age", value)}>
                    <SelectTrigger id="char-b-age">
                      <SelectValue placeholder="年齢を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {ageOptions.map((age) => (
                        <SelectItem key={age} value={age}>
                          {age}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="char-b-gender">性別</Label>
                  <Select
                    value={characterB.gender}
                    onValueChange={(value) => handleCharacterChange("B", "gender", value)}
                  >
                    <SelectTrigger id="char-b-gender">
                      <SelectValue placeholder="性別を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {genderOptions.map((gender) => (
                        <SelectItem key={gender} value={gender}>
                          {gender}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="char-b-personality">性格</Label>
                  <Select
                    value={characterB.personality}
                    onValueChange={(value) => handleCharacterChange("B", "personality", value)}
                  >
                    <SelectTrigger id="char-b-personality">
                      <SelectValue placeholder="性格を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {personalityOptions.map((personality) => (
                        <SelectItem key={personality} value={personality}>
                          {personality}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="char-b-details">その他の詳細</Label>
                  <Textarea
                    id="char-b-details"
                    placeholder="キャラクターの詳細情報"
                    value={characterB.details}
                    onChange={(e) => handleCharacterChange("B", "details", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="story" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="era">時代設定</Label>
                  <Select
                    value={plotSettings.era}
                    onValueChange={(value) => setPlotSettings({ ...plotSettings, era: value })}
                  >
                    <SelectTrigger id="era">
                      <SelectValue placeholder="時代を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {eras.map((era) => (
                        <SelectItem key={era} value={era}>
                          {era}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="location">舞台設定</Label>
                  <Select
                    value={plotSettings.location}
                    onValueChange={(value) => setPlotSettings({ ...plotSettings, location: value })}
                  >
                    <SelectTrigger id="location">
                      <SelectValue placeholder="場所を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="scenes">シーン数の目安（例：3〜5、多〜少）</Label>
                  <Input
                    id="scenes"
                    placeholder="3〜5"
                    value={plotSettings.scenes}
                    onChange={(e) =>
                      setPlotSettings({
                        ...plotSettings,
                        scenes: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="story-pattern">ストーリー・パターン</Label>
                  <Select
                    value={plotSettings.storyPattern}
                    onValueChange={(value) => setPlotSettings({ ...plotSettings, storyPattern: value })}
                  >
                    <SelectTrigger id="story-pattern">
                      <SelectValue placeholder="パターンを選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {storyPatterns.map((pattern) => (
                        <SelectItem key={pattern} value={pattern}>
                          {pattern}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="atmosphere" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <Label>雰囲気（複数選択可）</Label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-2">
                    {moods.map((mood) => (
                      <div key={mood} className="flex items-center space-x-2">
                        <Checkbox
                          id={`mood-${mood}`}
                          checked={plotSettings.mood.includes(mood)}
                          onCheckedChange={() => handleMoodToggle(mood)}
                        />
                        <Label htmlFor={`mood-${mood}`} className="text-sm font-normal">
                          {mood}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-center">
        <Button
          onClick={generatePlot}
          disabled={isGenerating}
          className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-2"
        >
          {isGenerating ? "生成中..." : "プロットを生成する"}
        </Button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

      {generatedPlot && (
        <Card className="mt-8">
          <CardContent className="pt-6">
            <h2 className="text-xl font-bold text-pink-600 mb-4">生成されたプロット</h2>
            <div className="whitespace-pre-wrap bg-gray-50 p-4 rounded-md border">{generatedPlot}</div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

