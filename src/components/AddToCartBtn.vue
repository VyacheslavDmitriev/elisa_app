<template>
	<button class="btn_radiuse" :class="{ unmembutton: notInCart(uuidtoadd), membutton: !notInCart(uuidtoadd) }" @click="calculateCartSumm()">
	</button>
</template>

<script>
	import {updateTotal} from '../price_elisa.js'
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
				this.$store.commit( 'setCart', answer1c.Products )		
				this.arrCart = this.$store.getters.CARTARR()
				updateTotal( this.$store.getters.CARTSUM() )
			}
		},
		mounted () {
			this.arrCart = this.$store.getters.CARTARR()
		}
	}
</script>

<style scoped>
</style>
