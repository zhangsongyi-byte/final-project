<template>
  <div>
    <el-table
      :data="restList.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      border
      style="width : 100%"
    >
      <el-table-column
        fixed
        prop="name.zh-CN"
        label="名称"
        width="auto"
      >
      </el-table-column>
      <el-table-column
        prop="address.formatted"
        label="地址"
        width="auto"
      >
      </el-table-column>
      <el-table-column
        label="操作"
        width="auto"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            :disabled="$checkRoles()"
            @click="edit(scope.$index, scope.row)"
          >
            编辑
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="tags"
        label="标签"
        width="auto"
      >
        <template slot-scope="scope">
          <el-tag
            v-for="item in scope.row.tags"
            :key="item.name"
            type="info"
          >
            {{ item }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        width="auto"
        label="关闭状态"
      >
        <!--  slot-scope="scope" 这里取到当前单元格  -->
        <!-- scope.row 直接取到该单元格对象，即是tableData[scope.$index]  -->
        <!-- .isClosed 是对象里面的isClosed属性的值  -->
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isClosed"
            active-color="#13ce66"
            :disabled="$checkRoles()"
            @change="(v)=>{changeSwitch(v,scope.row._id)}"
          >
          </el-switch>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="page-size">
      <el-pagination
        background
        yout="total,prev, pager, next,jumper"
        :page-size="pageSize"
        :total="47"
        :data="restList.length"
        :current-page="currentPage"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      ></el-pagination>
    </div>
    <!-- 编辑模态框 -->
    <RestaurantModal
      :is-show="dialogFormVisible"
      :form="form"
      @close="closeRest"
    ></RestaurantModal>
  </div>
</template>

<script>
import RestaurantModal from './RestaurantModal/RestaurantModal';
import { mapActions, mapState } from 'vuex';
import _ from 'lodash';
export default {
   name:'Restaurant',
   components:{
      RestaurantModal
   },
   data () {
      return {
         value:true,
         pageSize:12,
         currentPage:1,
         dialogFormVisible:false,
         form:{}
      };
   },
   computed: {
      ...mapState({
         'restList':state=>state.restaurant.restList
      })
   },
   created () {
      this.setRest();
      this.getTags();

   },
   methods:{
      ...mapActions([
         'getTags','setRest'
      ]),
      /* 前端分页 */
      handleSizeChange (val){
         this.currentPage = 1;
         this.pageSize = val;
      },
      handleCurrentChange (val) {
         this.currentPage = val;
      },
      /* 点击编辑按钮 */
      edit (index,row){
         this.dialogFormVisible = true;
         this.form = _.cloneDeep(row);
      },
      closeRest (){
         this.dialogFormVisible = false;
      }
   }
};
</script>

<style lang="scss">
.page-size{
  margin :20px auto;
  text-align : center;
}
</style>