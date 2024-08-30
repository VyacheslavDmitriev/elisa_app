export const getArrCookies = function  () {
	const strCookies = document.cookie.split('; ')
	var arrCookies = []
	strCookies.forEach( cStr => {
		arrCookies[cStr.split('=')[0]] = cStr.split('=')[1]
	})
	return arrCookies
}	

export const getCartCookies = function () {
	var cartStrUUIDs = getArrCookies()['cart']
	var arrCartUUIDs = []
	if ( cartStrUUIDs ) arrCartUUIDs = cartStrUUIDs.split('| ')
	return arrCartUUIDs
}
export const getCartSumDb = async function  ( uuidtoadd = null ) {
	var cartLabel = document.getElementById( 'memory-price' )
	var answer1c = null
	var arrCartUUIDs = getCartCookies()
	console.log( arrCartUUIDs )    
	document.cookie = `cartsession=${Date.now()}; max-age=360000; path=/`;
	// add item or remove item from cart
	if ( uuidtoadd == "clear") {
		arrCartUUIDs = []
		uuidtoadd = null
		cartLabel.innerText = 0
		document.cookie = `cart_sum=0; max-age=360000; path=/`
	}
	if ( uuidtoadd && !arrCartUUIDs.find( item => { return item == uuidtoadd } ) ) arrCartUUIDs.push( uuidtoadd )
	else arrCartUUIDs = arrCartUUIDs.filter( item => item != uuidtoadd )
	// console.log(`arrCookies ${arrCartUUIDs}, updated ${updatedArr} = ${uuidtoadd}`)  
	if ( arrCartUUIDs.length == 0 ) {
		document.cookie = `cart=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/`
		document.cookie = `cart_sum=0; max-age=360000; path=/`
		cartLabel.innerText = 0
	}
	if ( arrCartUUIDs.length > 1 ) document.cookie = `cart=${ arrCartUUIDs.join( '| ')}; max-age=360000; path=/`
	if ( arrCartUUIDs.length == 1 ) document.cookie = `cart=${ arrCartUUIDs[0] }; max-age=360000; path=/`

	var orderStockItems = []
	arrCartUUIDs.forEach( UUID => {
	orderStockItems.push( { "UUID": UUID } )
	})
	if ( arrCartUUIDs.length >= 1 ) {
		answer1c = await fetch('/web_services/get_calculation_cart_db.php', {
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
		if( answer1c['#value'].TotalSum ) {
			document.cookie = `cart_sum=${ answer1c['#value'].TotalSum }; max-age=360000; path=/`
			cartLabel.innerText = answer1c['#value'].TotalSum
		}
		return answer1c
	}
	else return null
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