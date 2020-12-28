import { createCanvas, loadImage, registerFont } from 'canvas'
import drawTextWithTwemoji from './drawTextWithTwemoji'

import path from 'path'

export default async function makeTextImage(text, fontInfo, color) {
  const lines = text.split("\n")

  const fontPath = path.resolve(`./pages/api/image/_fonts/${fontInfo.name}.${fontInfo.ext}`)
  registerFont(fontPath, { family: fontInfo.name })

  const canvasSize = 300
  const canvasPadding = 5
  const canvasInnerSize = canvasSize - canvasPadding * 2
  const fontSize = canvasInnerSize / lines.length
  const translateY = fontInfo.adjustedValue / lines.length // TODO 要調整

  var canvas = createCanvas(canvasSize, canvasSize)
  var ctx = canvas.getContext('2d')
  ctx.fillStyle    = `#ffffff`
  ctx.fillRect(0, 0, canvasSize, canvasSize)
  ctx.fillStyle    = `#${color}`
  ctx.font         = `${fontSize}px "${fontInfo.name}"`
  ctx.textBaseline = "top"

  for (let i = 0; i < lines.length; i++) {
    const x = canvasPadding
    const y = canvasPadding + fontSize * i - translateY
    await drawTextWithTwemoji(ctx, 'fill', lines[i], x, y, { maxWidth: canvasInnerSize })
  }

  return canvas.toBuffer('image/png')
}
