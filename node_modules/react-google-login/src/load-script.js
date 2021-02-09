export default (d, s, id, jsSrc, cb) => {
  const element = d.getElementsByTagName(s)[0]
  const fjs = element
  let js = element
  js = d.createElement(s)
  js.id = id
  js.src = jsSrc
  if (fjs && fjs.parentNode) {
    fjs.parentNode.insertBefore(js, fjs)
  } else {
    d.head.appendChild(js)
  }
  js.onload = cb
}
