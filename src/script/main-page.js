const elements = {
  items: document.querySelectorAll('.item'),
  downloadArrow: document.getElementById('download-arrow'),
}

const { log } = console
const testAPI = 'https://veryfast.io/t/front_test_api.php'

const getDataAPI = () => {
  return fetch(testAPI)
      .then(async (response) => {
        const resp = await response.json()
        if (!response.ok) throw new Error(resp.message)
        return resp.result.elements
      })
      .catch(e => {
        throw new Error(e.message)
      })
}

getDataAPI().then(setData)

function setData(fetchData) {
  elements.items.forEach((item, idx) => {
    const data = fetchData[idx]
    const { amount, license, name, downloadBtn, best, discount, discountAmount } = itemElements(item)

    data.is_best && ( best.style.display = 'block')
    if(data.price_key === '50%') {
      discount.style.display = 'block'
      discountAmount.style.display = 'block'
    }

    amount.innerHTML = `\$${ data.amount }`
    license.innerHTML = data.license_name
    name.innerHTML = data.name_prod

    downloadBtn.addEventListener('click', (e) => onDownload(e, data.link))
  })
}

function itemElements (item) {
  const amount = item.querySelector('.item__price__amount')
  const license = item.querySelector('.item__details__license-name')
  const name = item.querySelector('.item__details__product-name')
  const downloadBtn = item.querySelector('.item__details__download')
  const best = item.querySelector('.item__price__best')
  const discount = item.querySelector('.item__price__discount')
  const discountAmount = item.querySelector('.item__price__discount-amount')
  return { amount, license, name, downloadBtn, best, discount, discountAmount }
}

function onDownload(e, link) {
  const a = document.createElement('a')
  document.body.appendChild(a)
  a.href = link
  a.click()

  setTimeout(() => {
    URL.revokeObjectURL(link)
    document.body.removeChild(a)
  }, 0)

  if(navigator.userAgent.includes('Chrome')) {
    elements.downloadArrow.classList.add('download-arrow__chrome')
  }
  if(navigator.userAgent.includes('Firefox')) {
    elements.downloadArrow.classList.add('download-arrow__firefox')
  }
  //etc
  //https://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browsers
}
