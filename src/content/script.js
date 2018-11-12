import './style.css'

let goods = document.querySelectorAll('.gbGoodsItem_title')
let shopCodes = []
let shopGoodsElements = []

// resetShopcodes()

;(async function() {
  await Promise.all(Array.from(goods).map(addShopCode))
  console.log(shopCodes)
})()

async function addShopCode(el) {
  let href = el.getAttribute('href')
  // let parent = el.closest('.gbGoodsItem')
  return await fetch(href)
    .then(res => res.text())
    .then(res => {
      let match = res.match(/shopCode: "([\d]*)"[\S\s]*brandCode: "([\w]+)"/)
      // let shopCode = res.match(/shopCode: "([\d]*)"/)[1]
      let code = match[1]
      let name = match[2]
      console.log(code, name)
      if (shopCodes.indexOf(shop => shop.code === code) === -1) {
        shopCodes.push({
          code, name
        })
        return code
      }
    })
}


// getStorageShopCodes()
//   .then(async res => {
//     shopCodes = res
//     goods.forEach(addShopCodes)
//     console.log(shopCodes)
//     console.log(shopGoodsElements)
//     let shops = await getShopsInfo(shopCodes)
//     console.log(shops)
//   })




function getStorageShopCodes() {
  return new Promise(resolve => {
    chrome.storage.sync.get(['shop_codes'], data => {
      resolve(data.shop_codes)
    })
  })
}


function getShopsInfo(codes) {
  return Promise.all(codes.map(async code => await getShopInfo(code)))
}

async function getShopInfo(code, data=[], page=1) {
  let shop = await fetch(`https://www.gearbest.com/store/list?shop_code=${code}&page=${page}`)
  shop = await shop.json()
  if (shop.data.length && page < 10)
    shop = await getShopInfo(code, data.concat(shop.data), ++page)
  else
    return {
      shopCode: code,
      avgRating: calcAvg(data),
      data
    }
  return shop
}

function resetShopcodes() {
  chrome.storage.sync.set({ 'shop_codes': [] })
}

function calcAvg(data) {
  let total = data.reduce((total, item) => {
    let rating = item.agvRate
    return {
      count: rating ? ++total.count : total.count,
      sum: total.sum + rating
    }
  }, { count: 0, sum: 0 })
  return (total.sum / total.count).toFixed(1)
}