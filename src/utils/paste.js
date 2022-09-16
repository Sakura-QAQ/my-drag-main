/*
 * @Description: 复制函数
 */
export default function(text) {
  const body = document.querySelector('body')
  const input = document.createElement('input')
  input.value = text
  input.style.opacity = 0
  input.style.position = 'fixed'
  input.style.top = '0'
  input.style.left = '0'
  body.appendChild(input)
  input.select()
  document.execCommand('copy')
  body.removeChild(input)
}
