import { parseRequest } from './_lib/parser'
import makeTextImage from './_lib/makeTextImage'

export default async function handler(req, res) {
  try {
    const { text, fontInfo, color } = parseRequest(req)
    const file = await makeTextImage(text, fontInfo, color)
    res.statusCode = 200
    res.setHeader('Content-Type', 'image/png')
    res.setHeader('Cache-Control', `public, immutable, no-transform, s-maxage=31536000, max-age=31536000`)
    res.end(file)
  } catch (e) {
    res.statusCode = 500
    res.setHeader('Content-Type', 'text/html')
    res.end('<h1>Internal Error</h1><p>Sorry, there was a problem</p>')
    console.error(e)
  }
}
