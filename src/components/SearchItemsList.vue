<template>
	<div class="">
		<div id="analsearchwrapper">
			<input id="analsearch" ref="searchinput" type="search" @keyup="getItemsList( searchStrInput )" v-model="searchStrInput" placeholder="Начните вводить название анализа...">
			<!-- <button @click="getItemsList( searchStrInput )">Найти</button> -->
		</div>
		<table class="analysestable">
			<tbody id="el-search-tb">
				<tr v-if="itemsList" class="el-header">
					<td class="tdinfo"></td>
					<td class="tdname" >Результат поиска:</td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
				</tr>			
				<tr class="analrow" v-for="item in itemsList" :key="item.id" @click="showCoordered(item.UUID)" :class="{elselected: selectedUUID==item.UUID}">
					<!-- <td class="tdcode">{{item.Code}}</td> -->
					<td class="tdinfo"></td>
					<td class="tdname">{{item.DescriptionForWeb? item.DescriptionForWeb: item.Description}}&nbsp;
						<span v-if="isComplex(item.NomenclatorialType)" class="complex small-label"> комплекс</span>&nbsp;
						<span v-if="item.DiscountDescription" class="vcomplexe small-label">по акции</span>&nbsp;
						<span v-if="item.ComplexUUIDs" class="vcomplexe small-label">дешевле в комплексе</span>&nbsp;
						<i class="far fa-question-circle" @click="showDetail(item)"></i>
					</td>
					<td class="tdoldprice"><template v-if="item.Price<item.PriceWithoutDiscount">{{item.PriceWithoutDiscount}}&#8381;</template></td>
					<td class="tdprice" :class="{discount:item.Price<item.PriceWithoutDiscount}">
						{{Math.floor(item.Price)}}<span class="rouble">&nbsp;&#8381;</span>
						<p v-if="!item.DiscountConditions&&item.DiscountPeriodTill&&item.Price<item.PriceWithoutDiscount">до {{new Date( Date.parse( item.DiscountPeriodTill ) ).toLocaleDateString().substring( 0, 10 )}}</p>
						<p v-if="item.DiscountConditions&&item.DiscountPeriodTill&&item.Price<item.PriceWithoutDiscount">{{item.DiscountConditions}}</p>
					</td>
					<td class="tdduration">~{{item.PeriodOfPerformance}}рд</td>
					<td class="tdmemorize"><AddToCartBtn :uuidtoadd="item.UUID"/></td>
				</tr>
			</tbody>
		<!-- </table>
		<table id="el-coordered-tb" class="analysestable">	 -->
			<tbody v-if="coorderedUUIDs" id="el-coordered-tb">
				<tr class="el-header">
					<td class="tdinfo"></td>
					<td class="tdname" >С выбранным исследованием часто назначают:</td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
				</tr>
				<tr class="analrow" v-for="item in coorderedItems" :key="item.id">
					<!-- <td class="tdcode">{{item.Code}}</td> -->
					<td class="tdinfo"></td>
					<td class="tdname">{{item.DescriptionForWeb? item.DescriptionForWeb: item.Description}}&nbsp;
						<span v-if="isComplex(item.NomenclatorialType)" class="complex small-label">комплекс</span>
						&nbsp;<i class="far fa-question-circle" @click="showDetail(item)"></i>
					</td>
					<td class="tdoldprice"></td>
					<td class="tdprice">{{Math.floor(item.Price)}} <span class="rouble">Р</span></td>
					<td class="tdduration">~{{item.PeriodOfPerformance}}рд</td>
					<td class="tdmemorize"><AddToCartBtn :uuidtoadd="item.UUID"/></td>
				</tr>
			</tbody>
		</table>
		<ModalFrame v-if="showModal" @close_me="showModal = false" :recaptcha-modal="false" :content-modal="contentModal" :button-modal="false" :input-modal="false"/>
	</div>
</template>

<script>
	import ModalFrame from './ModalFrame.vue'
	import AddToCartBtn from './AddToCartBtn.vue'
	export default {
		name: 'SearchItemsList',
		components: {
			AddToCartBtn, ModalFrame
		},
		data () {
			return {
				selectedUUID: null,
				coorderedItems: [],
				coorderedUUIDs: null,
				coorderedList: null,
				searchStrInput: '',
				itemsList: null,
				showModal: false
			}
		},
		methods: {
			showCoordered( uuid ) {
				this.selectedUUID = uuid
				this.coorderedItems = []
				this.coorderedUUIDs = null
				let tmpElement = this.coorderedList.find( element => { return element.MainStockItemUUID == uuid })
				if ( tmpElement ) this.coorderedUUIDs = tmpElement.CoOrderedStockItems
				// console.log(tmpElement);
				this.getCoorderedItems( this.coorderedUUIDs )
			},
			async getCoorderedItemsList() {
				// eslint-disable-next-line
				if ( _coorderedItems && _coorderedItems["#value"].OperationResult ) {
					// eslint-disable-next-line
					this.coorderedList = _coorderedItems["#value"].CoOrderedMainStockItemsList
				}
			},
			isComplex ( complexType ) {
				return complexType == "КомплексЛабораторныхИсследований"
			},			
			showDetail ( detailContent ) {
				this.contentModal = detailContent
				this.showModal = true
			},
			getItemsList ( searchStr ) {
				this.coorderedItems = []
				this.coorderedUUIDs = null
				if ( searchStr.length < 3 ) { 
					this.itemsList = null
					return null
				}
				const itemsList = this.$store.getters.TABLEBYNAME( 'StockItemsList' )
				const lowerSearchStr = searchStr.toLowerCase()
				this.itemsList = itemsList.filter( itemToList => {
					return itemToList.Tags.toLowerCase().includes( lowerSearchStr ) ||
					itemToList.Description.toLowerCase().includes( lowerSearchStr ) ||
					itemToList.DescriptionForWeb.toLowerCase().includes( lowerSearchStr )
				})
				this.itemsList.forEach( element => {
					let count = 0
					if ( element.ComplexUUIDs && element.ComplexUUIDs.length ) {
						element.ComplexUUIDs.forEach( complexUUID => {
							if ( itemsList.find( complex => { return complex.UUID == complexUUID } ) ) count++
						})
					}
					if ( !count ) delete element.ComplexUUIDs
				});
				if ( this.itemsList &&  this.itemsList[0] ) this.selectedUUID = this.itemsList[0].UUID
				else  this.selectedUUID = null
				this.showCoordered( this.selectedUUID )
			},
			getCoorderedItems ( arrUUIDs ) {
				if ( Array.isArray( arrUUIDs ) ) {
					const listAll = this.$store.getters.TABLEBYNAME( 'StockItemsList' )
					arrUUIDs.forEach( arrUuid => {
						if ( this.itemsList.find( element => { return element.UUID == arrUuid.StockItemUUID } ) ) return
						let tmpElement = listAll.find( element => { return element.UUID == arrUuid.StockItemUUID } )
						if ( tmpElement ) this.coorderedItems.push( tmpElement  )
					})
					if ( window.screen.width > 1024 ) this.coorderedItems.splice( 15 )
					else this.coorderedItems.splice( 5 )
				}
			}
			// wasEnterPressed ( event ) {
			// 	if ( event.key === 'Enter' ) this.getItemsList( this.searchStrInput )
			// }
		},
		async mounted() {
			let params = new URLSearchParams(document.location.search.substring(1))
			await this.getCoorderedItemsList()
			if ( params.get('str') ) this.searchStrInput =  params.get('str')
			this.getItemsList( this.searchStrInput )
			this.$nextTick( function() { let t = document.getElementById('analsearch'); t.focus() })
		}
	}
</script>

<style scoped>
</style>
