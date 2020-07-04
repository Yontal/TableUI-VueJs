<template>
    <div class="container">
        <div class="title">Table UI</div>
        <hr class="break" />
        <div class="menu">
            <div class="menuLeft">
                <div>Sorting by:</div>
                <button @click="firstColumn='product'" :class="buttonClass('product')">Product (100g)</button>
                <button @click="firstColumn='calories'" :class="buttonClass('calories')">Calories</button>
                <button @click="firstColumn='fat'" :class="buttonClass('fat')">Fat (g)</button>
                <button @click="firstColumn='carbs'" :class="buttonClass('carbs')">Carbs (g)</button>
                <button @click="firstColumn='protein'" :class="buttonClass('protein')">Protein (g)</button>
                <button @click="firstColumn='iron'" :class="buttonClass('iron')">Iron (%)</button>
            </div>
            <div class="menuRight">
                <button @click="deleteRows" :class="selectedRows.length > 0 ? 'activeButton' : 'disabledButton'"> Delete {{selectedRows.length > 0 ? ' ('+selectedRows.length + ')' : ''}} </button>
                <div class="dropdownWrapper">
                    <div class="disabledButton buttonWithIcon" @click="dropdownNumRowsToShow = !dropdownNumRowsToShow">{{linesToShow.quantity}} Per Page<span class="iconDown"></span></div>
                    <div v-if="dropdownNumRowsToShow" class="dropdown-open-lines-to-show">
                        <div class="link" @click="setLinestoShowQuantity(10)">10 per page</div>
                        <div class="link" @click="setLinestoShowQuantity(15)">15 per page</div>
                        <div class="link" @click="setLinestoShowQuantity(20)">20 per page</div>
                    </div>
                </div>
                <div><span class="iconLeft" @click="previousPage"></span></div>
                <div class="label">{{linesToShow.from+1}}-{{(linesToShow.from+linesToShow.quantity)>=dishes.length ? dishes.length : linesToShow.from+linesToShow.quantity}} of {{dishes.length}}</div>
                <div><span class="iconRight" @click="nextPage"></span></div>
                <div class="dropdownWrapper">
                    <div class="disabledButton buttonWithIcon" @click="dropdownColumnsActive = !dropdownColumnsActive">{{selectedColumns.length}} columns selected<span class="iconDown"></span></div>
                    <div v-if="dropdownColumnsActive" class="dropdown-open">
                        <div class="scrollWrapperMargin">
                            <div class="scrollWrapper">
                                <div class="dropdownColumnRow">
                                    <span :class="selectAllCheckboxClass()" @click="selectAllColumns"></span>
                                    <div>Select All</div>
                                </div>
                                <div class="dropdownColumnRow" v-for="(column, key) in allColumns" :key="key">
                                    <span :class="checkboxClass(column)" @click="toggleColumn(column)"></span>
                                    <div>{{column}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>      
        <table>
            <template v-for="(dish, key) in dishes">
                <thead v-if="key === 0" :key="dish.name">
                    <th class="checkboxInTable">
                        <span v-if="selectedRows.length !== dishes.length" class="iconCheckboxArea" @click="selectAllRows"></span>
                        <span v-if="selectedRows.length === dishes.length" class="iconCheckboxChecked" @click="selectAllRows"></span>
                    </th>
                    <template v-for="(val, name, index) in dish">
                        <th v-if="(firstColumn === name && selectedColumns.indexOf(name) !== -1)" :key="index">
                            <div class="sortLabel" @click="sortDishes">{{name}}
                                <span class="iconDownSort" v-if="sortOption === 'up'" @click="sortDishesDown"></span>
                                <span class="iconUpSort" v-if="sortOption === 'down'" @click="sortDishesUp"></span>
                            </div>
                        </th>
                    </template>
                    <template v-for="(val, name, index) in dish">
                        <th v-if="(firstColumn !== name && selectedColumns.indexOf(name) !== -1)" :key="index">{{name}}</th>
                    </template>
                    <th></th>
                </thead>
                <tr v-if="(key >= linesToShow.from && key <= (linesToShow.from + linesToShow.quantity-1))" :key="key">
                    <td class="checkboxInTable">
                        <span v-if="selectedRows.indexOf(dish.id) === -1" class="iconCheckboxArea" @click="selectedRows.push(dish.id)"></span>
                        <span v-if="selectedRows.indexOf(dish.id) !== -1" class="iconCheckboxChecked" @click="selectedRows.splice(selectedRows.indexOf(dish.id),1)"></span>
                    </td>
                    <template v-for="(val, name, index) in dish">
                        <td v-if="(firstColumn === name && selectedColumns.indexOf(name) !== -1)" :key="index">{{val}}</td>
                    </template>
                    <template v-for="(val, name, index) in dish">
                        <td v-if="(firstColumn !== name && selectedColumns.indexOf(name) !== -1)" :key="index">{{val}}</td>
                    </template>
                    <td class="deleteColumn">
                        <div class="dropdownWrapper">                            
                            <div class="iconTrashLabel" @click="requestConfirmationBeforeDeletion(dish.id)"><span class="iconTrash"></span>delete</div>
                            <div v-if="dropdownDeleteRow && dishIdToConfirmDeletion === dish.id" class="dropdown-open-confirm-deletion">
                                <div class="message">Are you sure you want to <strong>delete item</strong>?</div>
                                <div class=btnGroup>
                                    <div @click="cancelDeletion" class="disabledButton btnModal">Cancel</div>
                                    <div @click="confirmDeletion" class="activeButton btnModal">Confirm</div>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
            </template>
        </table>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import * as types from '../store/types'

export default {
    data(){
        return{
            selectedColumns: ["product", "calories", "fat", "carbs", "protein", "iron"],
            allColumns: ["product", "calories", "fat", "carbs", "protein", "iron"],
            linesToShow: {
                from: 0,
                quantity: 15
            },
            selectedRows: [],
            firstColumn: "product",
            dropdownColumnsActive: false,
            dropdownNumRowsToShow: false,
            dropdownDeleteRow: false,
            dishIdToConfirmDeletion: '',
            sortOption: '',
        }
    },
    computed:{
        ...mapGetters({
            dishes: types.GET_DISHES,
            error: types.GET_ERROR
        })
    },
    methods: {
        nextPage(){
            if(this.linesToShow.from + this.linesToShow.quantity < this.dishes.length){
                this.linesToShow.from += (this.linesToShow.quantity);
            }
        },
        previousPage(){
            if(this.linesToShow.from - this.linesToShow.quantity < 0){
                this.linesToShow.from = 0
            } else {
                this.linesToShow.from -= (this.linesToShow.quantity);
            }
        },
        selectRow(id){
            if(this.selectedRows.indexOf(id) != -1){
                this.selectedRows.splice(this.selectedRows.indexOf(id), 1);
            } else {
                this.selectedRows.push(id);
            }
        },
        selectAllRows(){
            if(this.selectedRows.length !== this.dishes.length){
                this.selectedRows = [];
                this.dishes.map(dish =>{
                    this.selectedRows.push(dish.id)
                })
            } else {
                this.selectedRows = []
            }
        },
        async deleteRows(){
            if(this.selectedRows.length === 0){return}
                this.$store.dispatch(types.UPDATE_ERROR, '')
                if(!confirm('Please confirm deletion')){
                    return;
                }
                await this.$store.dispatch(types.DELETE_DISHES, this.selectedRows)
                if(this.error === ''){
                    this.selectedRows = []
                } else {
                    alert(this.error)
                }
        },
        toggleColumn(name){
            if(this.selectedColumns.indexOf(name) !== -1){
                this.selectedColumns.splice(this.selectedColumns.indexOf(name), 1);
            } else {
                this.selectedColumns.push(name);
            }
        },
        selectAllColumns(){
            if(this.selectedColumns.length < this.allColumns.length){
                this.selectedColumns = [...this.allColumns]
            } else{
                this.selectedColumns = []
            }
        },
        sortDishesUp(){
            let arr = this.dishes.slice();
            arr.sort((a,b) => {
                if (a[this.firstColumn] > b[this.firstColumn]) return 1;
                if (a[this.firstColumn] == b[this.firstColumn]) return 0;
                if (a[this.firstColumn] < b[this.firstColumn]) return -1;
            })
            this.sortOption = 'up';
            this.$store.dispatch(types.UPDATE_DISHES, arr);
        },
        sortDishesDown(){
            let arr = this.dishes.slice();
            arr.sort((a,b) => {
                if (a[this.firstColumn] < b[this.firstColumn]) return 1;
                if (a[this.firstColumn] == b[this.firstColumn]) return 0;
                if (a[this.firstColumn] > b[this.firstColumn]) return -1;
            })
            this.sortOption = 'down';
            this.$store.dispatch(types.UPDATE_DISHES, arr);
        },
        sortDishes(){
            if(this.sortOption === '' || this.sortOption === 'up'){
                this.sortDishesDown();
            } else {
                this.sortDishesUp();
            }
        },
        buttonClass(currentColumn){ 
            return {
                button: true,
                activeButton: this.firstColumn === currentColumn ? true : false
            }
        },
        checkboxClass(currentColumn){
            return {
                iconCheckboxArea: this.selectedColumns.indexOf(currentColumn) === -1 ? true : false,
                iconCheckboxChecked: this.selectedColumns.indexOf(currentColumn) !== -1 ? true : false
            }
        },
        selectAllCheckboxClass(){
            return {
                iconCheckboxArea: this.selectedColumns.length < this.allColumns.length ? true : false,
                iconCheckboxChecked: this.selectedColumns.length === this.allColumns.length ? true : false
            }
        },
        setLinestoShowQuantity(num){
            this.linesToShow.quantity = num;
            this.dropdownNumRowsToShow = false;
        },
        requestConfirmationBeforeDeletion(id){
            this.dropdownDeleteRow = true;
            this.dishIdToConfirmDeletion = id;
        },
        async confirmDeletion(){
            this.$store.dispatch(types.UPDATE_ERROR, '')
            this.selectedRows = [];
            await this.$store.dispatch(types.DELETE_DISHES, [this.dishIdToConfirmDeletion])
                if(this.error === ''){
                    this.dishIdToConfirmDeletion = '';
                    this.dropdownDeleteRow = false;
                } else {
                    alert(this.error)
                }
        },
        cancelDeletion(){
            this.dishIdToConfirmDeletion = '';
            this.dropdownDeleteRow = false;
        }
    }    
}
</script>

<style scoped>
.container{
    width: 1140px;
}

.title{
    height: 40px;
    font-style: normal;
    font-weight: 600;
    font-size: 32px;
    line-height: 40px;
    color: #282136;
    margin: 8px;
    text-align: left;
}

.break{
    height: 1px;
    border: 0;
    background: #EDEDED;
    margin: 8px;
}

.menu{
    font-weight: 600;
    font-size: 14px;
    line-height: 24px;
    display: flex;
    margin-top: 8px;
    margin-bottom: 8px;
    align-items: center;
    justify-content: space-between;
}
.menuRight{
    display: flex;
    justify-content: flex-end;
}
.menuLeft{
    display: flex;
    justify-content: flex-start;
    align-items: center;
}
button{
    border: none;
    text-align: center;
    text-decoration: none;
    background-color: #F2F2F2;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 24px;
    display: inline-block;
    cursor: pointer;
    padding-top: 4px;
    padding-bottom: 5px;
    padding-left: 8px;
    padding-right: 8px;
    margin: 8px;
    margin-left: 0px;
    margin-right: 0px;
}
.activeButton{
    background: #00A11E;
    border-radius: 2px;
    color: white;
    margin-right: 6px;
}
.disabledButton{
    border: 1px solid #C6CBD4;
    border-radius: 2px;
    line-height: 24px;
    color: #C6CBD4;
    margin-right: 6px;
}

.menu-item{
    margin: 8px;
}
table{
    width: 1140px;
    border-collapse: collapse;
}
th{
    height: 49px;
    text-align: left;
    background: white;
    border-bottom: 1px solid #EDEDED;  
}
td{
    height: 49px;
    text-align: left;
    border: none;
}
.checkboxInTable{

    text-align: center !important;
    cursor: pointer;

}

tr:nth-child(even) {background: #FFF}
tr:nth-child(odd) {background: #F8F9FA;}
tr:hover{
    background: rgba(0, 161, 30, 0.07);
}
.iconDown{
    background: url('../assets/icons/Down.svg') no-repeat center;
    display: inline-block;
    width: 24px;
    height: 24px;
    margin-right: 4px;

}
.iconLeft{
    background: url('../assets/icons/Left.svg') no-repeat center;
    display: inline-block;
    width: 32px;
    height: 32px;
    margin-top: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #C6CBD4;
    border-radius: 2px;
    cursor: pointer;
}
.iconRight{
    background: url('../assets/icons/Right.svg') no-repeat center;
    display: inline-block;
    width: 32px;
    height: 32px;
    margin-top: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #C6CBD4;
    border-radius: 2px;
    cursor: pointer;
}
.iconCheckboxArea{
    background: url('../assets/icons/Checkbox-Off.svg') no-repeat center;
    display: inline-block;
    width: 14px;
    height: 14px;
    margin-right: 4px;
}
.iconCheckboxChecked{
    background: url('../assets/icons/Checkbox.svg') no-repeat center;
    display: inline-block;
    width: 14px;
    height: 14px;
    margin-right: 4px;
}
.iconUpSort{
    background: url('../assets/icons/up-arrow.svg') no-repeat center;
    display: inline-block;
    width: 14px;
    height: 14px;
    margin-right: 4px;
}
.iconDownSort{
    background: url('../assets/icons/down-arrow.svg') no-repeat center;
    display: inline-block;
    width: 14px;
    height: 14px;
    margin-right: 4px;
}
.deleteColumn{
    width: 100px;
    cursor: pointer;
}
.iconTrashLabel{
    display: none;
}
tr:hover .iconTrashLabel{
    display: block;
}
tr:hover .iconTrash{
    background: url('../assets/icons/Trash.svg') no-repeat center;
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-right: 4px;
}
.buttonWithIcon{
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 24px;
    padding-top: 4px;
    padding-bottom: 5px;
    padding-left: 20px;
    color: #5B5E77;
}
.dropdownWrapper{
    position: relative;
    margin: 8px;
}
.dropdown-open{
    position: absolute;
    width: 207px;
    height: 243px;
    bottom: 14px;
    background: #FFFFFF;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.16);
    border-radius: 4px;
    top: 40px;
}
.dropdown-open-lines-to-show{
    position: absolute;
    width: 150px;
    text-align: left;
    padding: 10px;
    top: 40px;
    background: #FFFFFF;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.16);
    border-radius: 4px;
}
.dropdown-open-confirm-deletion{
    position: absolute;
    width: 256px;
    height: 76px;
    padding: 20px;
    top: 40px;
    background: #FFFFFF;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.16);
    border-radius: 4px;
    z-index: 100;
}
.dropdownColumnRow{
    margin-left: 17px;
    margin-top: 15px;
    margin-right: 13px;
    text-align: left;
    display: flex;
    align-items: center;
    font-weight: normal;
}
.dropdownColumnRow:first-child{
    margin-top: 0px;
    font-weight: 600;
}
.scrollWrapper{
    max-height: 213px;
    overflow-y: auto;
    margin-right: 8px;
}
.scrollWrapperMargin{
    margin-top: 15px;
    margin-bottom: 15px;
}
.link{
    padding: 4px;
    cursor: pointer;
}
.link:hover{
    background: #F2F2F2;
}
.label{
    margin: 8px;
    line-height: 35px;
}
.message{
    font-size: 14px;
    margin: 8px;
    text-align: center;
    z-index: 101;
}
.btnGroup{
    display: flex;
    justify-content: space-evenly;
}
.btnModal{
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 24px;
    display: inline-block;
    cursor: pointer;
    text-align: center;
    margin: 8px;
    margin-left: 0px;
    margin-right: 0px;
    padding-top: 6px;
    border-radius: 4px;
    width: 78px;
    height: 32px;;
}
.sortLabel{
    cursor: pointer;
}
.scrollWrapper::-webkit-scrollbar              { /* 1 - скроллбар */ width: 4px;}
.scrollWrapper::-webkit-scrollbar-thumb        { /* 5 - ползунок */ border-radius: 4px; background-color: #D5DAE0;}

</style>