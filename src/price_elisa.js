export const getArrCookies = function  () {
	const strCookies = document.cookie.split('; ')
	var arrCookies = []
	strCookies.forEach( cStr => {
		arrCookies[cStr.split('=')[0]] = cStr.split('=')[1]
	})
	return arrCookies
}	

export const getCartCookies = function () {
	var cartStrUUIDs = localStorage.getItem( 'cart' )
	var arrCartUUIDs = []
	if ( cartStrUUIDs ) arrCartUUIDs = cartStrUUIDs.split('| ')
	return arrCartUUIDs
}
export const getCartSumDb = function  ( uuidtoadd = null ) {
	var cartLabel = document.getElementById( 'memory-price' )
	var answer1c = null
	var arrCartUUIDs = getCartCookies()

	// document.cookie = `cartsession=${Date.now()}; max-age=360000; path=/; SameSite=Strict`;
	localStorage.setItem( 'cartsession', Date.now() )
	// add item or remove item from cart
	if ( uuidtoadd == "clear") {
		arrCartUUIDs = []
		uuidtoadd = null
		cartLabel.innerText = 0
		// document.cookie = `cart_sum=0; max-age=360000; path=/; SameSite=Strict`
		localStorage.setItem( 'cart_sum', 0 )
	}
	if ( uuidtoadd && !arrCartUUIDs.find( item => { return item == uuidtoadd } ) ) arrCartUUIDs.push( uuidtoadd )
		else arrCartUUIDs = arrCartUUIDs.filter( item => item != uuidtoadd )
	console.log(`arrCookies ${arrCartUUIDs}, updated = ${uuidtoadd}, length`)  
	if ( arrCartUUIDs.length == 0 ) {
		// document.cookie = `cart=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/; SameSite=Strict`
		localStorage.setItem( 'cart', '' )
		// document.cookie = `cart_sum=0; max-age=360000; path=/; SameSite=Strict`
		localStorage.setItem( 'cart_sum', 0 )
		cartLabel.innerText = 0
	}
	// if ( arrCartUUIDs.length > 1 ) document.cookie = `cart=${ arrCartUUIDs.join( '| ')}; max-age=360000; path=/; SameSite=Strict`
	if ( arrCartUUIDs.length > 1 ) localStorage.setItem( 'cart', arrCartUUIDs.join( '| ') )
	// if ( arrCartUUIDs.length == 1 ) document.cookie = `cart=${ arrCartUUIDs[0] }; max-age=360000; path=/; SameSite=Strict`
	if ( arrCartUUIDs.length == 1 ) localStorage.setItem( 'cart', arrCartUUIDs[0] )
	
	var orderStockItems = []
	// console.log( arrCartUUIDs )    
	arrCartUUIDs.forEach( UUID => {
		orderStockItems.push( UUID )
	})

	if ( arrCartUUIDs.length >= 1 ) {
		answer1c = { "#value": { Products : orderStockItems } }
		return answer1c['#value']
	}
	else return []
	}
export const updateTotal = function ( sum ) {
	var cartLabel = document.getElementById( 'memory-price' )
	// document.cookie = `cart_sum=${ sum }; max-age=360000; path=/; SameSite=Strict`
	localStorage.setItem( 'cart_sum', sum )
	cartLabel.innerText = sum
}
export const getDownloadFile = async function  () {
	var answer1c = null
	var arrCartUUIDs = getCartCookies()
	console.log( arrCartUUIDs )     

	if ( arrCartUUIDs.length > 0 ) {
		var orderStockItems = []
		arrCartUUIDs.forEach( UUID => {
		orderStockItems.push( { "UUID": UUID } )
		})
		if ( arrCartUUIDs.length >= 1 ) {
			answer1c = await fetch('/web_services/get_referal_cart_db.php', {
			method: 'POST', // *GET, POST, PUT, DELETE, etc.
			mode: 'no-cors', // no-cors, cors, *same-origin
			cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
			credentials: 'same-origin', // include, *same-origin, omit
			redirect: 'follow', // manual, *follow, error
			referrer: 'no-referrer', // no-referrer, *client            
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify( {"OrderedStockItems": orderStockItems} )
		}).then( response => { return response.json() })
		return answer1c
		}
		else return null
	}
}