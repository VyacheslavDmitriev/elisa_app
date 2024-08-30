<template>
	<div class="catlevel-container">
		<div class="catlevel cursor" :class="{selectedRow: showItems}" @click="setSelfActive">{{group.Description}} <span v-if="group.Description=='Врачебный приём'" class="small-label vcomplexe">Обследования и процедуры</span></div>
		<template v-if="showItems">
			<div class="group-list-inner" v-for="item in groupList" :key="item.id" :data="item.UUID">
				<ItemsOfGroup :group="item" @set-active-group="activeGroupUUID=$event" :activeItem="item.UUID == activeGroupUUID"/>
			</div>
			<table class="analysestable">
				<tbody>
					<tr class="analrow" v-for="item in itemsList" :key="item.id">
						<!-- <td class="tdcode">{{item.Code}}</td> -->
						<!-- <td class="tdinfo"></td> -->
						<td class="tdname" @click="showDetail(item)">{{item.DescriptionForWeb? item.DescriptionForWeb: item.Description}}&nbsp;
							<span v-if="isComplex(item.NomenclatorialType)" class="complex small-label"> комплекс</span>&nbsp;
							<span v-if="item.DiscountDescription" class="vcomplexe small-label">по акции</span>&nbsp;
							<span v-if="item.ComplexUUIDs" class="vcomplexe small-label">дешевле в комплексе</span>
						</td>
						<td class="tdoldprice"><template v-if="item.Price<item.PriceWithoutDiscount">{{item.PriceWithoutDiscount}}&#8381;</template></td>
						<td class="tdprice" :class="{discount:item.Price<item.PriceWithoutDiscount}">
							{{Math.floor(item.Price)}}<span class="rouble">&nbsp;&#8381;</span>
							<p v-if="!item.DiscountConditions&&item.DiscountPeriodTill&&item.Price<item.PriceWithoutDiscount">до {{new Date(Date.parse(item.DiscountPeriodTill)).toLocaleDateString().substring( 0, 10 )}}</p>
							<p v-if="item.DiscountConditions&&item.DiscountPeriodTill&&item.Price<item.PriceWithoutDiscount">{{item.DiscountConditions}}</p>
						</td>
						<td class="tdduration">~{{item.PeriodOfPerformance}}рд</td>
						<td class="tdmemorize"><AddToCartBtn v-if="!additionalNomenclatorial( item.NomenclatorialType )" :uuidtoadd="item.UUID"	/></td>
					</tr>
				</tbody>
			</table>
		</template>
		<ModalFrame v-if="showModal" @close_me="showModal = false" :recaptcha-modal="false" :content-modal="contentModal" :button-modal="false" :input-modal="false"/>
	</div>
</template>

<script>
import AddToCartBtn from './AddToCartBtn.vue'
import ModalFrame from './ModalFrame.vue'

export default {
	name: 'ItemsOfGroup',
	components: {
		AddToCartBtn,
		ModalFrame
	},
	props: {
		group: null,
		activeItem: {
			type: Boolean,
			default: false
		}
	},
	data () {
		return {
			showModal: false,
			contentModal: '',
			itemsList: null,
			groupList: null,
			showItems: this.activeItem,
			activeGroupUUID: null
		}
	},
	methods: {
		isComplex ( complexType ) {
			return complexType == "КомплексЛабораторныхИсследований"
		},
		additionalNomenclatorial ( typeUUID ) {
			return typeUUID == "ДополнительнаяУслугаЗабораБиоматериала" || typeUUID == "ВрачебныйПрием"
		},
		setSelfActive () {
			this.showItems = !this.showItems
		},
		showDetail ( detailContent ) {
			// var tmpHTML = document.createElement('html')
			// tmpHTML.innerHTML = detailContent.DetailedDescriptionForWeb
			// var collectionEl = tmpHTML.getElementsByTagName('body')
			this.contentModal = detailContent //collectionEl[0].innerText
			this.showModal = true
		},
		getItemsList () {
			const needGroup = this.group.UUID
			
			const groupList = this.$store.getters.TABLEBYNAME( 'GroupsOfStockItemsList' )
			this.groupList = groupList.filter( itemToList => { return itemToList.ParentUUID == needGroup })
			
			const fullList = this.$store.getters.TABLEBYNAME( 'StockItemsList' )
			this.itemsList = fullList.filter( itemToList => { return itemToList.ParentUUIDs?.includes( needGroup ) })
			this.itemsList.forEach( element => {
				let count = 0
				if ( element.ComplexUUIDs && element.ComplexUUIDs.length ) {
					element.ComplexUUIDs.forEach( complexUUID => {
						if ( fullList.find( complex => { return complex.UUID == complexUUID } ) ) count++
					})
				}
				if ( !count ) delete element.ComplexUUIDs
			});
		}
	},
	watch: {
		showItems: function () {
			this.$emit( 'set-active-group', this.group.UUID)
			if ( !this.itemsList || !this.groupList ) this.getItemsList()
			if ( !this.showItems ) this.activeGroupUUID = null
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
