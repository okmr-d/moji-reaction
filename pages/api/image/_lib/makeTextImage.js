import { createCanvas, loadImage } from 'canvas'
import drawTextWithTwemoji from './drawTextWithTwemoji'

export default async function makeTextImage(text, color, font) {
  //const align = "left"
  const lines = text.split("\n")

  const canvasSize = 300
  const canvasPadding = 10
  const canvasInnerSize = canvasSize - canvasPadding * 2
  //const lineHeight = 1.1
  const fontSize = canvasInnerSize / lines.length

  var canvas = createCanvas(canvasSize, canvasSize)
  var ctx = canvas.getContext('2d')
  ctx.fillStyle    = `#ffffff`
  ctx.fillRect(0, 0, canvasSize, canvasSize)
  ctx.fillStyle    = `#${color}`
  ctx.font         = `${fontSize}px ${font}`
  ctx.textBaseline = "top"

  for (let i = 0; i < lines.length; i++) {
    const x = canvasPadding
    const y = canvasPadding + fontSize * i
    await drawTextWithTwemoji(ctx, 'fill', lines[i], x, y, { maxWidth: canvasInnerSize })
  }

  return canvas.toBuffer('image/png')
}
