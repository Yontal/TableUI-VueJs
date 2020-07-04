import Vue from "vue";
import Vuex from "vuex";
import * as types from "./types";
import * as API from "../API/request";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    dishes: [],
    error: '',
  },
  mutations: {
    [types.MUTATE_DISHES]: (state, payload) => {
      state.dishes = payload;
    },
    [types.MUTATE_ERROR]: (state, payload) => {
      state.error = payload;
    }
  },
  actions: {
    [types.PULL_DISHES]: ({ commit }) => {
      API.getProducts()
        .then((res) => {
          commit(types.MUTATE_DISHES, res);
        })
        .catch((err) => alert('Loading failed. Please try refresh page'));
    },
    [types.DELETE_DISHES]: async ({ commit, state }, dishesToDelete) => {
      API.deleteProducts()
      .then(res => {
        let newDishes = state.dishes.slice();
        state.dishes.forEach((element) => {
          if (dishesToDelete.indexOf(element.id) !== -1) {
            newDishes.splice(newDishes.indexOf(element), 1);
          }
        });
        commit(types.MUTATE_DISHES, newDishes);
      })
      .catch(err => {
        commit(types.MUTATE_ERROR, 'Deletion failed. Try once again');
      })
    },
    [types.UPDATE_DISHES]: ({ commit }, payload) => {
      commit(types.MUTATE_DISHES, payload);
    },
    [types.UPDATE_ERROR]: ({ commit }, payload) => {
      commit(types.MUTATE_ERROR, payload);
    }
  },
  getters: {
    [types.GET_DISHES]: (state) => {
      return state.dishes;
    },
    [types.GET_ERROR]: (state) => {
      return state.error;
    }
  },
});
