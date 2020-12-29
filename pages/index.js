import { useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useForm, useWatch } from 'react-hook-form'

import { parseRequest } from '../lib/parser'
import Header from '../components/Header'
import ColorPicker from '../components/ColorPicker'
import { fontInfoList, defaultFontInfo } from '../constants/fontInfoList'

function getPageAndImagePath({ text, font, color }) {
  const queryString = `text=${encodeURIComponent(text)}&font=${font}&color=${color.replace('#', '')}`
  const canShare = !!text
  const pagePath = canShare ? `/?${queryString}` : '/'
  const imagePath = canShare ? `/api/image?${queryString}` : '/img/default.png'
  return {
    pagePath,
    imagePath
  }
}

export default function Home({ initialFormValues, initialShareInfo }) {
  console.log({ initialFormValues, initialShareInfo })

  const [colorModalOpen, setColorModalOpen] = useState(false)

  const [shareInfo, setShareInfo] = useState(initialShareInfo)

  const router = useRouter()

  // Form
  const { register, handleSubmit, errors, control, setValue } = useForm({
    defaultValues: initialFormValues,
  })
  register('color', { required: true })
  const currentFont = useWatch({ control, name: 'font' })
  const currentColor = useWatch({ control, name: 'color' })

  const onSubmit = ({ text, font, color }) => {
    const { pagePath, imagePath } = getPageAndImagePath({ text, font, color })

    setShareInfo({
      canShare: true,
      title: text.replace(/\r?\n/g, ''),
      pagePath,
      imagePath,
    })

    router.replace(pagePath)
  }

  return (
    <div className="text-sm">
      <Head>
        <title>{shareInfo.title}</title>
        {!shareInfo.canShare && (
          <meta name="description" content="文字画像でリアクションしよう！" />
        )}
        <meta name="og:title" property="og:title" content={shareInfo.title} />
        <meta name="og:image" property="og:image" content={process.env.NEXT_PUBLIC_SITE_ROOT_URL + shareInfo.imagePath} />
        <meta name="og:url" property="og:url" content={process.env.NEXT_PUBLIC_SITE_ROOT_URL + shareInfo.pagePath} />
        <meta name="twitter:card" content="summary" />
        <link rel="canonical" href={process.env.NEXT_PUBLIC_SITE_ROOT_URL + shareInfo.pagePath} />
        <link rel="icon" href="/favicon.ico" />

        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@700;900&family=M+PLUS+Rounded+1c:wght@700;900&family=Noto+Serif+JP:wght@900&display=swap" rel="stylesheet" />
        </Head>

      <Header />

      <div className="max-w-2xl mx-auto">
        <div className="p-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="sm:flex sm:-mx-4">
              <div className="sm:w-5/12 sm:px-4">
                <div className="mb-6">
                  <div className="text-base font-bold mb-2">1. テキストを入力 (改行可)</div>
                  <div>
                    <textarea
                      name="text"
                      placeholder="いい&#13;ね！"
                      ref={register({ required: true })}
                      className={`
                        block appearance-none text-base bg-white border-2 border-gray-200 rounded w-full py-1.5 px-2.5 focus:outline-none focus:border-blue-500
                        ${errors.text ? 'border-red-500 bg-red-100' : ''}
                      `}
                    />
                  </div>
                  {errors.text?.type === "required" && <div className="mt-1 text-xs text-red-500">入力してください</div>}
                </div>

                <div className="mb-6">
                  <div className="text-base font-bold mb-2">2. フォントを選択</div>
                  <div className="">
                    {Object.keys(fontInfoList).map(key => (
                      <div key={key}>
                        <label
                          className={`
                            block mb-1 px-4 py-0.5 border-2 rounded-full cursor-pointer
                            ${fontInfoList[key].name === currentFont ? 'border-blue-500 bg-blue-100' : ''}
                          `}
                        >
                          <input
                            name="font"
                            type="radio"
                            value={fontInfoList[key].name}
                            ref={register({ required: true })}
                            className="hidden"
                          />
                          <span
                            style={{
                              fontFamily: fontInfoList[key].fontFamily,
                              fontWeight: fontInfoList[key].fontWeight
                            }}
                          >
                            {fontInfoList[key].nameJa}
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                  {errors.font?.type === "required" && <div className="mt-1 text-xs text-red-500">選択してください</div>}
                </div>

                <div className="mb-6">
                  <div className="text-base font-bold mb-2">3. 文字色を選択</div>
                  <a
                    className="inline-flex items-center px-3 py-1.5 border-2 rounded cursor-pointer hover:bg-gray-100"
                    style={{ color: currentColor }}
                    onClick={() => setColorModalOpen(true)}
                  >
                    <div
                      className="h-6 w-6 rounded border border-white"
                      style={{ backgroundColor: currentColor }}
                    />
                    <div className="ml-2">{currentColor}</div>
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
                        color={currentColor}
                        onChange={(color) => {
                          setValue('color', color)
                        }}
                      />
                      <div className="mt-6">
                        <a
                          className="flex justify-center px-3 py-1.5 rounded cursor-pointer bg-gray-100 hover:bg-gray-200"
                          onClick={() => setColorModalOpen(false)}
                        >
                          閉じる
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="sm:w-7/12 sm:px-4">
                <div className="mb-6">
                  <div className="text-base font-bold mb-2">4. プレビュー</div>
                  <button
                    type="submit"
                    className={`
                      flex w-full justify-center text-base text-white font-bold px-4 py-2 rounded-lg bg-yellow-500 focus:outline-none
                    `}
                    disabled={errors.text || errors.font || errors.color}
                  >
                    プレビューを生成！
                  </button>
                </div>

                {shareInfo.canShare && (
                  <div className="p-4 bg-gray-100 rounded-2xl">

                    <div className="flex mb-4 bg-white border max-w-xs border-gray-300 rounded-2xl overflow-hidden">
                      <div className="flex-none bg-gray-100 border-r border-gray-300">
                        <img src={shareInfo.imagePath} className="w-full" style={{ width: '84px', height: '84px'}} />
                      </div>
                      <div
                        className="flex-grow p-2.5 flex flex-col justify-center"
                        style={{ fontSize: '15px' }}
                      >
                        <div
                          className="mb-0.5 max-w-full"
                          style={{
                            WebkitLineClamp: 2,
                            lineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            display: '-webkit-box',
                            textOverflow: 'ellipsis',
                            overflowWrap: 'anywhere',
                            overflow: 'hidden',
                          }}
                        >
                          {shareInfo.title}
                        </div>
                        <div className="flex items-end leading-tight text-gray-500">
                          <span className="mr-0.5">
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><g><path d="M11.96 14.945c-.067 0-.136-.01-.203-.027-1.13-.318-2.097-.986-2.795-1.932-.832-1.125-1.176-2.508-.968-3.893s.942-2.605 2.068-3.438l3.53-2.608c2.322-1.716 5.61-1.224 7.33 1.1.83 1.127 1.175 2.51.967 3.895s-.943 2.605-2.07 3.438l-1.48 1.094c-.333.246-.804.175-1.05-.158-.246-.334-.176-.804.158-1.05l1.48-1.095c.803-.592 1.327-1.463 1.476-2.45.148-.988-.098-1.975-.69-2.778-1.225-1.656-3.572-2.01-5.23-.784l-3.53 2.608c-.802.593-1.326 1.464-1.475 2.45-.15.99.097 1.975.69 2.778.498.675 1.187 1.15 1.992 1.377.4.114.633.528.52.928-.092.33-.394.547-.722.547z"></path><path d="M7.27 22.054c-1.61 0-3.197-.735-4.225-2.125-.832-1.127-1.176-2.51-.968-3.894s.943-2.605 2.07-3.438l1.478-1.094c.334-.245.805-.175 1.05.158s.177.804-.157 1.05l-1.48 1.095c-.803.593-1.326 1.464-1.475 2.45-.148.99.097 1.975.69 2.778 1.225 1.657 3.57 2.01 5.23.785l3.528-2.608c1.658-1.225 2.01-3.57.785-5.23-.498-.674-1.187-1.15-1.992-1.376-.4-.113-.633-.527-.52-.927.112-.4.528-.63.926-.522 1.13.318 2.096.986 2.794 1.932 1.717 2.324 1.224 5.612-1.1 7.33l-3.53 2.608c-.933.693-2.023 1.026-3.105 1.026z"></path></g></svg>
                          </span>
                          <span>{process.env.NEXT_PUBLIC_SITE_ROOT_URL.replace(/https?:\/\//, '')}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-center font-bold mb-2">＼ 画像をシェアしてね ／</div>
                      <div className="mb-2">
                        <button
                          onClick={() => {
                            window.open(
                              `https://twitter.com/share?url=${encodeURIComponent(process.env.NEXT_PUBLIC_SITE_ROOT_URL + shareInfo.pagePath)}`,
                              'TWwindow',
                              'width=560, height=470, menubar=no, toolbar=no, scrollbars=yes'
                            )
                          }}
                          disabled={!shareInfo.canShare}
                          className="flex w-full justify-center text-white font-bold px-4 py-1 rounded-lg focus:outline-none"
                          style={{ backgroundColor: "#1b95e0" }}
                        >
                          Twitterでつぶやく
                        </button>
                      </div>

                      <div className="mb-2">
                        <button
                          onClick={() => {
                            window.open(
                              `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(process.env.NEXT_PUBLIC_SITE_ROOT_URL + shareInfo.pagePath)}`,
                              'FBwindow',
                              'width=560, height=470, menubar=no, toolbar=no, scrollbars=yes'
                            )
                          }}
                          disabled={!shareInfo.canShare}
                          className="flex w-full justify-center text-white font-bold px-4 py-1 rounded-lg focus:outline-none"
                          style={{ backgroundColor: "#1877f2" }}
                        >
                          Facebookでシェア
                        </button>
                      </div>
                    </div>

                    <div>
                      <a
                        href={`http://line.me/R/msg/text/?${encodeURIComponent(process.env.NEXT_PUBLIC_SITE_ROOT_URL + shareInfo.pagePath)}`}
                        target="_blank"
                        rel="noopener"
                        className="flex w-full justify-center text-white font-bold px-4 py-1 rounded-lg"
                        style={{ backgroundColor: "#14b734" }}
                      >
                        LINEで送る
                      </a>
                    </div>

                  </div>
                )}

              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}

export async function getServerSideProps(context) {
  const { text, fontInfo, color } = parseRequest(context.req)
  const font = fontInfo.name
  const canShare = !!text
  const { pagePath, imagePath } = getPageAndImagePath({ text, font, color })

  return {
    props: {
      initialFormValues: {
        text: text || "",
        font: font,
        color: `#${color}`,
      },
      initialShareInfo: {
        canShare: canShare,
        title: text?.replace(/\r?\n/g, '') || '文字リアクション！',
        pagePath: pagePath,
        imagePath: imagePath,
      },
    },
  }
}
