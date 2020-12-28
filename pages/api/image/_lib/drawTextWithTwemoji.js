
import { parse } from 'twemoji-parser'
import { loadImage } from 'canvas'

function splitEntitiesFromText (text) {
  const twemojiEntities = parse(text, { assetType: 'svg' })

  let unparsedText = text
  let lastTwemojiIndice = 0
  const textEntities = []

  twemojiEntities.forEach((twemoji) => {
    textEntities.push(
      unparsedText.slice(0, twemoji.indices[0] - lastTwemojiIndice)
    )

    textEntities.push(twemoji)

    unparsedText = unparsedText.slice(twemoji.indices[1] - lastTwemojiIndice)
    lastTwemojiIndice = twemoji.indices[1]
  })

  textEntities.push(unparsedText)

  return textEntities
}

const cachedTwemojiImages = new Map()
async function loadTwemojiImageByUrl (url) {
  return new Promise(async (res) => {
    if (cachedTwemojiImages.has(url)) {
      return res(cachedTwemojiImages.get(url))
    }

    const image = await loadImage(url)
    image.width = image.naturalWidth * 20
    image.height = image.naturalHeight * 20

    cachedTwemojiImages.set(url, image)

    return res(image)
  })
}

const defaultHeight = 16
function getFontSizeByCssFont(cssFont) {
  if (typeof cssFont !== 'string') {
    return defaultHeight
  }

  const sizeFamily = cssFont.match(/([0-9.]+)(px)/)

  if (sizeFamily.length !== 3) {
    return defaultHeight
  }

  return Number(sizeFamily[1])
}

function measureText (
  context,
  text,
  {
    emojiSideMarginPercent = 0.1
  } = {}
) {
  const textEntities = splitEntitiesFromText(text)
  const fontSize = getFontSizeByCssFont(context.font)

  const emojiSideMargin = fontSize * emojiSideMarginPercent

  let currentWidth = 0

  for (let i = 0; i < textEntities.length; i++) {
    const entity = textEntities[i]
    if (typeof entity === 'string') {
      // Common text case
      currentWidth += context.measureText(entity).width
    } else {
      // Emoji case
      currentWidth += fontSize + (emojiSideMargin * 2)
    }
  }

  const measured = context.measureText('')

  return {
    width: currentWidth,
    alphabeticBaseline: measured.alphabeticBaseline
  }
}


export default async function drawTextWithEmoji(
  context,
  fillType,
  text,
  x,
  y,
  {
    maxWidth = Infinity,
    emojiSideMarginPercent = 0.1,
    emojiTopMarginPercent = 0.1
  } = {}
) {
  const textEntities = splitEntitiesFromText(text)
  const fontSize = getFontSizeByCssFont(context.font)
  const baseLine = context.measureText('').alphabeticBaseline
  const textAlign = context.textAlign
  const transform = context.currentTransform

  const emojiSideMargin = fontSize * emojiSideMarginPercent
  const emojiTopMargin = fontSize * emojiTopMarginPercent

  const textWidth = measureText(context, text, { emojiSideMarginPercent }).width

  // for Text align
  let textLeftMargin = 0

  if (!['', 'left', 'start'].includes(textAlign)) {
    context.textAlign = 'left'

    switch (textAlign) {
      case 'center':
        textLeftMargin = -textWidth / 2
        break

      case 'right':
      case 'end':
        textLeftMargin = -textWidth
        break
    }
  }

  // Drawing
  let currentWidth = 0

  if (textWidth > maxWidth) {
    let scale = maxWidth / textWidth
    context.setTransform(scale, 0, 0, 1, 0, 0)
    x = x / scale
  }

  for (let i = 0; i < textEntities.length; i++) {
    const entity = textEntities[i]
    if (typeof entity === 'string') {
      // Common text case
      if (fillType === 'fill') {
        context.fillText(entity, textLeftMargin + x + currentWidth, y)
      } else {
        context.strokeText(entity, textLeftMargin + x + currentWidth, y)
      }

      currentWidth += context.measureText(entity).width
    } else {
      // Emoji case
      const emoji = await loadTwemojiImageByUrl(entity.url)
      context.drawImage(
        emoji,
        textLeftMargin + x + currentWidth + emojiSideMargin,
        y + emojiTopMargin - fontSize - baseLine,
        fontSize,
        fontSize
      )

      currentWidth += fontSize + (emojiSideMargin * 2)
    }
  }

  // Restore
  if (textAlign) {
    context.textAlign = textAlign
  }
  context.setTransform(transform)
}
