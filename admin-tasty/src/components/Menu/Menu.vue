<template>
  <div>
    <div>
      <el-select
        v-model="restaurant"
        filterable
        placeholder="请选择"
        @change="chooseFood"
      >
        <!-- 选择foods -->
        <el-option
          v-for="item in categories"
          :key="item.key"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
    </div>

    <!-- Menu表格 -->
    <div class="table-content">
      <el-table
        :data="foods"
        stripe
        style="width : 100%"
      >
        <el-table-column
          prop="name.zh-CN"
          label="菜品"
          width="auto"
        >
          <template slot="header">
            <span>菜品</span>
            <input
              v-model="keyword"
              placeholder="请输入关键字"
              class="search-input"
              @keyup.enter="search"
            ></input>
          </template>
        </el-table-column>
        <el-table-column
          prop="price"
          label="价格"
          width="auto"
        >
          <template slot-scope="scope">
            $ {{ scope.row.price | formatPrice }}
          </template>
        </el-table-column>
        <el-table-column
          prop="available"
          label="状态"
          width="auto"
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.available"
              active-color="#13ce66"
              :disabled="$checkRoles()"
              @change="changeSwitch(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-pagination
      background
      :style="{textAlign: 'center'}"
      :current-page="currentPage"
      :page-size="pageSize"
      :page-sizes="pageSizes"
      layout=" total, prev, pager, next, sizes"
      :total="count"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
  </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
export default {
   name:'Menu',
   /* 标准化价格 */
   filters:{
      formatPrice (price){
         price = (price / 100).toFixed(2);
         return price;
      }
   },
   data () {
      return {
         restaurant:'',
         name:[],
         currentPage:1,
         pageSizes:[ 10,20,30,40 ],
         pageSize:10,
         keyword:'',
         id:'',
         value:true
      };
   },
   computed: {
      ...mapState({
         'categories':state=>state.menu.categories,
         'foods':state=>state.menu.foods,
         'count':state=>state.menu.count,
      })
   },
   created () {
      this.getMenu();
   },
   methods:{
      ...mapActions([ 'getMenu','loadFoods','changeMenu' ]),
      /* 改变select的时候要将新的值传给vuex的actions */
      chooseFood (val){
         this.id = val;
         this.keyword = '';
         this.loadFoods({
            id:this.id,
            page:this.currentPage,
            limit:this.pageSize,
            keyword:this.keyword
         });
      },
      /* 分页 */
      handleCurrentChange (v){
         this.currentPage = v;
         this.loadFoods({
            id:this.id,
            page:this.currentPage,
            limit:this.pageSize,
            keyword:this.keyword
         });
      },
      handleSizeChange (v){
         this.pageSize = v;
         this.currentPage = 1;
         this.loadFoods({
            id:this.id,
            page:this.currentPage,
            limit:this.pageSize,
            keyword:this.keyword
         });
      },
      /* 搜索框匹配 */
      search (){
         this.loadFoods({
            id:this.id,
            page:this.currentPage,
            limit:this.pageSize,
            keyword:this.keyword
         });
      },
      changeSwitch (row){
         if(row.available === false){
            this.changeMenu({
               id:row._id,
               data:{
                  available:false
               }
            });
         }else{
            this.changeMenu({
               id:row._id,
               data:{
                  available:true
               }
            });
         }
      }
   }
};
</script>

<style lang="scss">

.table-content{
    margin-top : 50px;
}

.search-input{
  position : absolute;
  right : 0;
  height : 20px;
  border : 1px solid #ddd;
}
</style>