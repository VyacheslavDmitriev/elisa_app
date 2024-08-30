<template>
    <div class="modal_background">
        <div class="modal_container">
            <div class="modal_header">
               <h1>{{contentModal.DescriptionForWeb}}</h1><span class="modal_container_close" @click="$emit('close_me')">&times;</span>
            </div>
            <div class="modal-container-content">
                <div class="analleftcol">
					<div v-if="complexes.length" class="in-complexes">
						Возможно заказать в комплексах:&nbsp;					
						<button v-for="item in complexes" :key="item.id" class="sortopt" @click="goComplex(item.uuid)">{{item.complexName}}</button>
					</div>
					<div class="analfulltext" v-html="detailHTML"></div>
				</div>
                <div class="analrightcol">
                    <div class="analinfo">
                        <div class="analinforow">
                            <span class="analinfoheader">Стоимость:</span>&nbsp;{{contentModal.Price}}<span class="rouble">Р</span>
                        </div>
                        <div class="analinforow">
                            <span class="analinfoheader">Срок исполнения:</span>&nbsp;{{contentModal.PeriodOfPerformance}}рд
                        </div>
                        <div class="analinforow">
                            <span class="analinfoheader">Материал:</span>&nbsp;{{contentModal.Biomaterial.Description}}
                        </div>
                        <hr>
                        <div class="analinforow">
                            <span class="analinfoheader">Артикул:</span>&nbsp;{{contentModal.Code}}
                        </div>
                        <hr>
                        <div class="analinforow" v-if="contentModal.NomenclatorialCode">
                            <span class="analinfoheader">Код в едином реестре медицинских услуг:</span>&nbsp;{{contentModal.NomenclatorialCode}}
                        </div>
                        <div class="analinforow">
                            <span class="analinfoheader">Категории:</span>&nbsp;
                        </div>
                        <div class="analinforow" v-for="uuid in contentModal.ParentUUIDs" :key="uuid.id">
                            <a :href="'/analizy/'" class="analcathref">{{parentName(uuid)}}</a>
                        </div>
						<br>                                                              
                    </div>
                </div>
            </div>            
            <input v-if="inputModal" type="text" />
            <button v-if="buttonModal" value="Button"/>
			<button @click="$emit('close_me')" class="sortopt">Закрыть</button>
        </div>
    </div>
</template>
<script>

export default {
    name: 'ModalFrame',
    props: ['contentModal', 'buttonModal','recaptchaModal', 'inputModal'],
    data() {
        return {
			complexes: [],
            token: "",
            gresponse: null
        }
    },
	mounted: function () {
		if ( this.contentModal.ComplexUUIDs ) {
			this.contentModal.ComplexUUIDs.forEach( element => {
				const nameComplex = this.complexName ( element )
				if ( nameComplex ) this.complexes.push( { complexName: nameComplex, uuid:element } )
			});
		}
	},
    computed: {
        detailHTML () {
            var tmpHTML = document.createElement('html')
			tmpHTML.innerHTML = this.contentModal.DetailedDescriptionForWeb
			const collectionEl = tmpHTML.getElementsByTagName('body')
            return collectionEl[0].innerText
        }
    },
    methods: {
        parentName (ParentUUID) {
            const groupList = this.$store.getters.TABLEBYNAME( 'GroupsOfStockItemsList' )
			return groupList.find( itemToList => { return itemToList.UUID == ParentUUID }).Description
        },
		complexName ( uuid ) {
			const itemsList = this.$store.getters.TABLEBYNAME( 'StockItemsList' )
			const predict = itemsList.find( element => element.UUID == uuid )
			if ( predict ) return predict.Description
			else return 
		},
		goComplex ( uuid ) {
			document.location = '/analizy/?mode=search&str=' + this.complexName( uuid )
		}
    }
}
</script>
<style scoped>
    .modal_background{
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 20;
        background-color: rgba(128, 128, 128, .5);
    }
    .modal_container{
        background-color: #fff;
        border-radius: 10px;
        padding: 1vmax;
        animation-name: modalopen;
        animation-duration: 1s;
        z-index: 25;
        max-width: 90vw;
        max-height: 85vh;
        overflow-y: scroll;
        overflow-x: hidden;
    }
    .modal_header{
        display: flex;
        justify-content: space-between;
    }
    .modal_container_close{
        font-size: 2em;
        color: rgb(48, 45, 45);
        cursor: pointer;
    }
    .modal_container_close:hover{
        color: rgb(109, 46, 46);
        cursor: pointer;
    }
    @keyframes modalopen{
        from{ opacity: 0; }
        to{ opacity: 1; }
    }
</style>