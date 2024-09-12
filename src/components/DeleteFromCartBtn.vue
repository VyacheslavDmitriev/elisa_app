<template>
	<button class="btn_radiuse unmembutton-order" @click="calculateCartSumm()">
	</button>
</template>

<script>
	import {updateTotal} from '../price_elisa.js'
	import {getCartSumDb} from '../price_elisa.js'
	export default {
		name: 'DeleteFromCartBtn',
		props: {
			uuidtoadd: null
		},
		data () {
			return {
				activeGroupUUID: null
			}
		},
		methods: {
			calculateCartSumm () {
				const answer1c = getCartSumDb ( this.uuidtoadd )
				// console.log(answer1c);
				this.$store.commit( 'setCart', answer1c.Products )
				updateTotal( this.$store.getters.CARTSUM() )
				this.$emit('deletefromcart')
			}
		}
	}
</script>

<style scoped>
</style>
