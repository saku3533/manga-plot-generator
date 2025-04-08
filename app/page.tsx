import { MangaPlotGenerator } from "../components/manga-plot-generator";

export default function Home() {
  return (
    <main className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-pink-600 mb-8 text-center">百合漫画ジェネレーター</h1>
        <MangaPlotGenerator />
      </div>
    </main>
  )
}

