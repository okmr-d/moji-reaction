import { parse } from 'url'

export function parseRequest(req) {
  console.log('HTTP ' + req.url)
  const { query } = parse(req.url || '/', true)
  const { text, font, color } = (query || {})

  if (Array.isArray(text)) {
    throw new Error('Expected a single text')
  }
  if (Array.isArray(font)) {
    throw new Error('Expected a single font')
  }
  if (Array.isArray(color)) {
    throw new Error('Expected a single color')
  }

  let fontValue = font
  if (!['font1', 'font2'].includes(fontValue)) {
    fontValue = 'font1'
  }
  let colorValue = color
  if (!/^[a-fA-F0-9]{6}$/.test(colorValue)) {
    colorValue = '000000'
  }

  return {
    text: decodeURIComponent(text),
    font: fontValue,
    color: colorValue,
  }
}

