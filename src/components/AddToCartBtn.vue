<template>
	<button class="btn_radiuse" :class="{ unmembutton: notInCart(uuidtoadd), membutton: !notInCart(uuidtoadd) }" @click="calculateCartSumm()">
	</button>
</template>

<script>
	import {getCartSumDb} from '../price_elisa.js'
	export default {
		name: 'AddToCartBtn',
		props: {
			uuidtoadd: null,
		},
		data () {
			return {
				arrCart: [],
				activeGroupUUID: null
			}
		},
		methods: {
			notInCart ( cartUUID ) {
				const item = this.arrCart.find( element => element.UUID == cartUUID )
				return item
			},
			async calculateCartSumm () {
				const answer1c = await getCartSumDb ( this.uuidtoadd )
				this.$store.commit( 'emptyCart' )
				answer1c.Products.forEach( uuid => {
					this.$store.commit( 'addToCart', uuid )
				});			
				this.arrCart = this.$store.getters.CARTARR()
			}
		},
		mounted () {
			this.arrCart = this.$store.getters.CARTARR()
		}
	}
</script>

<style scoped>
</style>
