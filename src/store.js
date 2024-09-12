import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
      tables: {
        GroupsOfStockItemsList: null,
        StockItemsList: null
      },
      cart: { "#value": { TotalSum: 0, OrderedStockItems: [] } }
    },
    getters: {
      TABLEBYNAME: state => name => {
        return state.tables[name]
      },
      CARTSUM: state => sum => {
        sum = state.cart? state.cart['#value'].TotalSum : 0
        return sum 
      },
      CARTARR: state => arr => {
        arr = state.cart? state.cart['#value'].OrderedStockItems : []
        return arr
      }
    },
    mutations: {
        loadTable( state, tableData ) {
            state.tables[tableData.name] = tableData.table
        },
        setCart( state, cartArr ) {
			state.cart['#value'].TotalSum = 0
			state.cart['#value'].OrderedStockItems = []
			if ( cartArr )
				cartArr.forEach( uuid => {
					let product = state.tables.StockItemsList.find( element => { return element.UUID == uuid } )
					state.cart['#value'].OrderedStockItems.push( product )
					state.cart['#value'].TotalSum += product.Price
				});
        },
		// addToCart( state, uuid ) {
		// 	let product = state.tables.StockItemsList.find( element => { return element.UUID == uuid } )
		// 	state.cart['#value'].OrderedStockItems.push( product )
		// 	state.cart['#value'].TotalSum += product.Price
		// },
		emptyCart( state ) {
			state.cart = { "#value": { TotalSum: 0, OrderedStockItems: [] } }
		}
    }
  });