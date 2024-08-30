<template>
	<div class="">
		<table class="analysestable">
			<tbody>
				<tr class="analrow"
					:class="{complexrow:isComplex(item.UUID), elchild:isComplexPart(item.UUID)&&!item.double, eldouble:item.double}"
					v-for="item in arrCart" :key="item.id">
					<!-- <td class="tdcode">{{item.Code}}</td> -->
					
					<td class="tdname" :class="{elchild:isComplexPart(item.UUID)&&!item.double}" @click="showDetail(item)">{{item.DescriptionForWeb? item.DescriptionForWeb: item.Description}}&nbsp;
						<span v-if="item.double" class="eldouble small-label">дублируется в комплексе</span>&nbsp;
						<span v-if="isComplexPart(item.UUID)&&!item.double" class="vcomplexe small-label">в комплексe</span>&nbsp;
						<span v-if="isComplex(item.UUID)" class="complex small-label">комплекс</span>
					</td>
					<td class="tdoldprice">{{oldPrice( item.UUID, item.Price )}}</td>
					<td class="tdprice" :class="discountPrice( item.UUID, item.Price )? 'discount':''" >{{newPrice( item.UUID, item.Price )}} <span class="rouble">Р</span></td>
					<td class="tdduration">~{{item.PeriodOfPerformance}}рд</td>
					<td class="tdmemorize"><DeleteFromCartBtn v-if="(!isComplexPart(item.UUID)||item.double)&&!additionalNomenclatorial( item.UUID )" :uuidtoadd="item.UUID" @deletefromcart="getItemsList()"/></td>
				</tr>
				<tr class="analrow">
					<!-- <td class="tdcode"></td> -->
					
					<td class="tdname">Итого:</td>
					<td class=""></td>
					<td class="tdprice">{{cartSum()}} <span class="rouble">Р</span></td>
					<td class="tdduration"></td>
					<td class="tdmemorize"><button class="button button-orange-border smallbutton" @click="clearCart()">Очистить</button></td>
				</tr>
				<tr class="analrow">
					<!-- <td class="tdcode"></td> -->
					
					<td class="tdname" colspan="2"><button @click="printReferal" class="button btn_radiuse button-green full-width">Сохранить PDF</button></td>
					
					<td class="tdprice"></td>
					<td class="tdduration"></td>
					<td class="tdmemorize"></td>
				</tr>
			</tbody>
		</table>
		<ModalFrame v-if="showModal" @close_me="showModal = false" :recaptcha-modal="false" :content-modal="contentModal" :button-modal="false" :input-modal="false"/>			
	</div>
</template>

<script>
	import {getCartSumDb} from '../price_elisa.js'
	import {getDownloadFile} from '../price_elisa.js'
	import ModalFrame from './ModalFrame.vue'
	import DeleteFromCartBtn from './DeleteFromCartBtn.vue'
	export default {
		name: 'CartItemsList',
		components: {
			DeleteFromCartBtn, ModalFrame
		},
		data () {
			return {
				itemsList: null,
				arrCart: [],
				ownres: [],
				showModal: false,
				downloadFile: null
			}
		},
		methods: {
			additionalNomenclatorial ( typeUUID ) {
				const predict = this.itemsList.find( (element) => {
						return element.UUID == typeUUID;
					});
				return predict?.NomenclatorialType == "ДополнительнаяУслугаЗабораБиоматериала"
			},
			periodOfPerformance (UUID) {
				const item = this.itemsList.find( (element) => {
					return element.UUID == UUID;
				});
				return item.PeriodOfPerformance;
			},
			isComplex (complexUUID) {
				const item = this.itemsList.find( (element) => {
					return element.UUID == complexUUID;
				});
				return item.NomenclatorialType == "КомплексЛабораторныхИсследований";
			},
			// complexPart (complexUUID) {
			// 	const item = this.arrCart.find( (element) => {
			// 		return element.UUID == complexUUID;
			// 	});
			// 	return item.OwnerUUID;
			// },			
			isComplexPart (UUID) {
				const item = this.arrCart.find( (element) => {
					return element.UUID == UUID&&element.OwnerUUID!==undefined
				})
				return item
			},
			showDetail ( detailContent ) {
				this.contentModal = detailContent
				this.showModal = true
			},			
			cartSum () {
				return this.$store.getters.CARTSUM()
			},
			oldPrice (priceUUID, price) {
				var item = this.itemsList.find( (element) => {
					return element.UUID == priceUUID;
				});
				return item.Price > price ? Math.floor(item.Price) : '';
			},
			newPrice (priceUUID, price) {
				var item = this.arrCart.find( (element) => {
					return element.UUID == priceUUID;
				});
				return item.Sum < price ? Math.floor(item.Sum) : Math.floor(price);
			},
			discountPrice (priceUUID, price) {
				var item = this.itemsList.find( (element) => {
					return element.UUID == priceUUID;
				});
				return item.Price > price;
			},
			getItemsList () {
				this.arrCart = []
				var tmpCart = this.$store.getters.CARTARR();
				function isDouble( uuid ) {
					const item1 = tmpCart.find( element => { return element.UUID == uuid && element.OwnerUUID} )
					const item2 = tmpCart.find( element => { return element.UUID == uuid && !element.OwnerUUID} )
					// console.log(item1);
					// console.log(item2);
					return item1!==undefined && item2!==undefined
				}
				this.itemsList = this.$store.getters.TABLEBYNAME('StockItemsList');
				this.arrCart.push(...tmpCart.filter( (element) => {
					return !element.OwnerUUID && !this.isComplex( element.UUID );
					})
				)
				this.ownres = tmpCart.filter( (element) => { return this.isComplex( element.UUID ) } )
				this.ownres.forEach( (element) => {
					this.arrCart.push(element);
					this.arrCart.push(...tmpCart.filter( (child) => { return child.OwnerUUID == element.UUID } ) )
				});
				// this.arrCart = this.arrCart.filter( element => { return ( isDouble( element.UUID ) && element.OwnerUUID ) || !isDouble( element.UUID ) } )
				this.arrCart.forEach( element => {
					if ( isDouble( element.UUID ) && !element.OwnerUUID ) element.double = true
					if ( !isDouble( element.UUID ) ) element.double = false
				})
			},											
			async clearCart () {
				await getCartSumDb ( "clear" )
				this.$store.commit( 'setCart', null )
				this.getItemsList()
			},
			async printReferal() {
				this.downloadFile = await getDownloadFile()
				if ( this.downloadFile['result'] ) {
					window.open('/web_services'+ this.downloadFile.urls[0], '_blank')
					// this.clearCart()
				}
			}
		},
		created () {
			this.getItemsList()
		}
	}
</script>

<style scoped>
</style>
