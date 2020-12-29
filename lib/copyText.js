export default function copyText(text) {
  const element = document.createElement('input')
  element.value = text
  document.body.appendChild(element)
  element.select()
  document.execCommand('copy')
  document.body.removeChild(element)
}
