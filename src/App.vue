<template>
	<div id="elisa-price">
		<button v-for="mode in modeList" :key="mode.id" @click="(currMode = mode)" class="sortopt" :class="{activated: currMode.mode == mode.mode}">{{mode.name}}</button>
		<!-- <div id="cart-container"> {{cartSum}} <span class="rouble">Р</span></div> -->
		<!-- <h3>{{currMode.name}}</h3> -->
		<span>&nbsp;Дата актуальности цен:&nbsp;{{dateFrom}}</span>
		<span id="memory-price"></span>
		<SearchItemsList v-if="loadedStockItemsList && currMode.mode == 'search'" />
		<CartItemsList v-if="cartSum && loadedStockItemsList && currMode.mode == 'cart'" />
		<p v-if="!cartSum && loadedStockItemsList && currMode.mode == 'cart'">В вашей корзине пусто</p>
		<GroupsOfStockItemsList v-if="loadedCart && loadedStockItemsList && currMode.mode == 'price'" :rootGroups="rootGroupsOfStock" />
	</div>
</template>

<script>
	import {getCartSumDb} from './price_elisa.js'
	import GroupsOfStockItemsList from './components/GroupsOfStockItemsList.vue'
	import CartItemsList from './components/CartItemsList.vue'
	import SearchItemsList from './components/SearchItemsList.vue'
	export default {
		name: 'App',
		components: {
			GroupsOfStockItemsList, CartItemsList, SearchItemsList
		},
		data () {
			return {
				dateFrom: '',
				modeList:[{"name":"Каталог", "mode":"price"}, {"name":"Поиск", "mode":"search"}, {"name":"Корзина", "mode":"cart"}],
				currMode: {"name":"Каталог", "mode":"price"},
				loadedStockItemsList: false,
				groupsOfStock: null,
				rootGroupsOfStock: null,
				loadedCart: false
			}
		},
		methods: {
			async getStockItemsList() {
				// eslint-disable-next-line
				this.dateFrom = _dateTime.substring( 0, 16 )
				// eslint-disable-next-line
				this.$store.commit( 'loadTable', { name: 'GroupsOfStockItemsList', table: _tableItems['#value'].GroupsOfStockItemsList})
				// eslint-disable-next-line
				this.$store.commit( 'loadTable', { name: 'StockItemsList', table: _tableItems['#value'].StockItemsList})
				this.loadedStockItemsList = true
			},
			getInitCart () {
				const answer1c = getCartSumDb (  )
				if ( answer1c )  {

					this.$store.commit( 'setCart', answer1c.Products )
					this.loadedCart = true
				}
				// this.loadedCart = true
			}
		},
		watch: {
			loadedStockItemsList: function () {
				this.groupsOfStock = this.$store.getters.TABLEBYNAME( 'GroupsOfStockItemsList' )
				this.rootGroupsOfStock = this.groupsOfStock.filter( rootGroup => { return rootGroup.ParentUUID == "00000000-0000-0000-0000-000000000000" })
			}
		},
		computed: {
			cartSum () {
				return this.$store.getters.CARTSUM()
			}
		},
		async mounted () {
			await this.getStockItemsList()
			this.getInitCart()
			let params = new URLSearchParams(document.location.search.substring(1))
			if( params.get('mode') ) this.currMode = this.modeList.find( mode => { return mode.mode == params.get('mode')} )
		}
	}
</script>

<style>
</style>
