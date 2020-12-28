import { useState } from 'react'
import Head from 'next/head'
import { useForm } from "react-hook-form"

import Header from '../components/Header'
import ColorPicker from '../components/ColorPicker'
import { fontInfoList } from '../constants/fontInfoList'

export default function Home() {

  const [color, setColor] = useState("#EC71A1")
  const [colorModalOpen, setColorModalOpen] = useState(false)

  const [imageUrl, setImageUrl] = useState(null)

  const { register, handleSubmit, errors } = useForm()

  const onSubmit = ({ text, font }) => {
    console.log({ text, font, color })
    setImageUrl(`/api/image?text=${encodeURIComponent(text)}&font=${font}&color=${color.replace('#', '')}`)
  }

  return (
    <div>
      <Head>
        <title>サイト名</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <div className="max-w-2xl mx-auto">
        <div className="p-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="sm:flex sm:-mx-2">
              <div className="sm:w-2/5 sm:px-2">
                <div className="mb-6">
                  <div className="font-bold mb-2">1. テキストを入力</div>
                  <div>
                    <textarea name="text" placeholder="" ref={register({ required: true })} />
                  </div>
                  {errors.text?.type === "required" && <div className="mt-1 text-xs text-red-500">入力してください</div>}
                </div>

                <div className="mb-6">
                  <div className="font-bold mb-2">2. フォントを選択</div>
                  <div>
                    {Object.keys(fontInfoList).map(key => (
                      <div key={key}>
                        <label>
                          <input name="font" type="radio" value={fontInfoList[key].name} ref={register({ required: true })} />
                          {fontInfoList[key].nameJa}
                        </label>
                      </div>
                    ))}
                  </div>
                  {errors.font?.type === "required" && <div className="mt-1 text-xs text-red-500">選択してください</div>}
                </div>

                <div className="mb-6">
                  <div className="font-bold mb-2">3. 文字色を選択</div>
                  <a
                    className="inline-flex items-center px-3 py-1.5 border rounded cursor-pointer hover:bg-gray-100"
                    style={{ color: color }}
                    onClick={() => setColorModalOpen(true)}
                  >
                    <div
                      className="h-6 w-6 rounded border border-white"
                      style={{ backgroundColor: color }}
                    />
                    <div className="ml-2">文字色</div>
                  </a>

                </div>
                {colorModalOpen && (
                  <div className="z-50 fixed inset-0 flex items-center justify-center">
                    <div
                      className="fixed inset-0 bg-black opacity-20"
                      onClick={() => setColorModalOpen(false)}
                    />
                    <div
                      className="relative bg-white p-6 rounded-xl"
                      style={{ width: '248px' }}
                    >
                      <ColorPicker
                        color={color}
                        onChange={setColor}
                      />
                      <div className="mt-6">
                        <a
                          className="flex justify-center px-3 py-1.5 rounded cursor-pointer bg-gray-100 hover:bg-gray-200 text-sm"
                          onClick={() => setColorModalOpen(false)}
                        >
                          閉じる
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="sm:w-3/5 sm:px-2">

                <div className="mb-6">
                  <div className="font-bold mb-2">4. プレビュー</div>
                  <button
                    type="submit"
                    className="bg-blue-500"
                  >
                    プレビューを生成
                  </button>
                </div>

                {imageUrl && (
                  <>
                    <div className="border" style={{ maxWidth: "300px" }}>
                      <img src={imageUrl} className="w-full" />
                    </div>
                  </>
                )}
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}
