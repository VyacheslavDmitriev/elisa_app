<template>
	<button class="btn_radiuse unmembutton-order" @click="calculateCartSumm()">
	</button>
</template>

<script>
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
			async calculateCartSumm () {
				const answer1c = await getCartSumDb ( this.uuidtoadd )
				this.$store.commit( 'setCart', answer1c )
				this.$emit('deletefromcart')
			}
		}
	}
</script>

<style scoped>
</style>
