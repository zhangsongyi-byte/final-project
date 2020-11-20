<template>
  <div>
    <!-- 编辑模态框 -->
    <el-dialog
      :title="title[`${lang}`]"
      :visible.sync="showModal"
      :close="closeModal"
    >
      <el-form :model="form">
        <!-- 餐馆名称 -->
        <el-form-item>
          <el-input
            v-model="name[`${lang}`]"
            autocomplete="off"
          >
            <el-select
              slot="prepend"
              v-model="lang"
              style="width :100px"
              value="zh-CN"
              placeholder="中文"
            >
              <el-option
                label="中文"
                value="zh-CN"
              ></el-option>
              <el-option
                label="英文"
                value="en-US"
              ></el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <!-- 标签 -->
        <el-form-item>
          <el-select
            v-model="tag"
            filterable
            allow-create
            default-first-option
            @change="addTags"
          >
            <el-option
              v-for="item in tags"
              :key="item.value"
              :label="item.label"
              :value="item"
            ></el-option>
          </el-select>
          <el-tag
            v-for="item in showTags"
            :key="item.value"
            effect="plain"
            class="restTags"
            size="small"
            closable
            @close="deleteTags(item)"
          >
            <!-- 显示大写的标签名 -->
            {{ item.toUpperCase() }}
          </el-tag>
        </el-form-item>
        <el-card class="box-card">
          <h4>{{ usTime }}</h4>
        </el-card>
      </el-form>
      <div
        v-for="(item,index) in hours"
        :key="index"
        style="margin-top :20px; text-align :center;"
      >
        <!-- 开门时间 -->
        <el-input
          :model="item.day"
          style="width : 100px"
          :disabled="true"
          :placeholder="item.day"
        >
        </el-input>
        <el-time-picker
          v-model="item.time"
          arrow-control
          is-range
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          placeholder="选择时间范围"
        >
        </el-time-picker>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="closeModal">
          取 消
        </el-button>
        <el-button
          type="primary"
          @click="saveRest"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import timezone from 'moment-timezone';
import _ from 'lodash';
import { modify } from '../../../request/restaurant';
import { mapActions, mapState } from 'vuex';
export default {
   name:'RestaurantModal',
   props:{
      isShow:{
         type:Boolean,
         required:true
      },
      form:{
         type:Object,
         required:true
      }
   },
   data () {
      return {
         language:[
            { value:'zh-CN',label:'中文' },
            { value:'en-US',label:'英文' }
         ],
         title:'',
         lang:'zh-CN',
         name:'',
         usTime:'',
         tag:'noodle',
         showTags:[],
         hours:[],
         newHours:[],
         id:'',
         showModal:false
      };
   },
   computed: {
      ...mapState({
         'tags':state => state.tag.tags
      })
   },
   watch:{
      isShow (v){
         console.log(v);
         this.showModal = v;
      },
      form (row){
         if(row !== undefined){
         /* 深拷贝，不然title和name绑定的值会一起变 */
            this.title = JSON.parse(JSON.stringify(row.name));
            this.name = JSON.parse(JSON.stringify(row.name));
            /* 编辑的时候，显示该餐馆正确的标签 */
            this.showTags = row.tags;
            this.id = row._id;
            /* 显示开门时间 */
            this.showDays(row.hours);
         }
      }
   },
   created () {
      /* 时间计时器 */
      // eslint-disable-next-line no-unused-vars
      let timer = setInterval(() =>{
         const date = new Date();
         this.usTime = timezone.tz(date,'America/New_York').format('YYYY-MM-DD HH:mm:ss dddd');
      }, 1000);
   },
   destroy () {
      // eslint-disable-next-line no-undef
      clearInterval(timer);
   },
   methods: {
      ...mapActions([ 'modifyRest' ]),
      // 选择tags后，添加tags
      addTags (val){
         if (!_.includes(this.showTags,val)) {
            this.showTags.push(val);
         }
      },
      // splice方法删除标签 splice(要删除的位置，要删除的个数，要新替换的内容)
      deleteTags (value){
         console.log(this.showTags.indexOf(value));
         this.showTags.splice(this.showTags.indexOf(value), 1);
      },
      // 显示日期
      showDays (hours){
         const weekDay = [ '星期一','星期二','星期三','星期四','星期五','星期六','星期日' ];
         this.hours = _(weekDay).map((v,index)=>{
            const start = _.get(hours[index], 'start');
            const end = _.get(hours[index], 'end');
            return{
               day:v,
               time : [
                  timezone().startOf('day').add(start,'minutes').toDate(),
                  timezone().startOf('day').add(end,'minutes').toDate()
               ]

            };
         }).value();
         console.log('xxxxx',this.hours);
         this.newHours = hours;
      },
      /* 改变开门时间 */
      changeTime (v,index){
         const start = this.getMinute(v[0]);
         const end = this.getMinute(v[1]);

         this.newHours[index].start = start;
         this.newHours[index].end = end;

         console.log('start',start);
      },
      getMinute (time){
         return timezone(time).hours() * 60 + timezone(time).minute();
      },
      /* 控制开关门时间 */
      async changeSwitch (v,id){
         let closed = v ? { clodes:true } : null;
         const data = await modify({
            id,
            data:{ closed }
         });
         console.log('rest data',data);
      },
      /* 保存模态框修改的数据 */
      saveRest (){

         const data = {
            id:this.id,
            data:{
               name:this.name,
               tags:this.showTags,
               hours:this.newHours
            }
         };
         this.modifyRest(data);
         this.closeModal();
      },
      closeModal (){
         this.$emit('close');
      }
   },
};
</script>

<style lang="scss">

</style>