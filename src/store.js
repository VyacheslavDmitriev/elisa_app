import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
      tables: {
        GroupsOfStockItemsList: null,
        StockItemsList: null
      },
      cart: null
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
        setCart( state, cartData ) {
          state.cart = cartData
        }
    }
  });