<template>
  <div>
    <el-date-picker
      v-model="value"
      type="daterange"
      align="right"
      unlink-panels
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      :picker-options="pickerOptions"
      @change="changeDate"
    >
    </el-date-picker>
    <div class="topChart">
      <div
        id="lineChart"
        :style="{width: '800px', height: '300px'}"
      ></div>
      <div
        id="pieChart"
        :style="{width: '800px',height:'250px'}"
      ></div>
    </div>
    <div class="downChart">
      <div
        id="pieOptions"
        :style="{width: '800px', height: '300px'}"
      ></div>
    </div>
  </div>
</template>

<script>
import Moment from 'moment';
import { extendMoment } from 'moment-range';
const moment = extendMoment(Moment);
import _ from 'lodash';
import { order } from '@/request/order.js';

export default {
   name:'Order',
   data () {
      return {
         /* 折线图数据 */
         xAxisData:[],
         seriesData:[],
         /* 开始时间和结束时间 */
         start:'',
         end:'',
         pickerOptions: {
            shortcuts: [ {
               text: '最近一周',
               onClick (picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                  picker.$emit('pick', [ start, end ]);
               }
            }, {
               text: '最近一个月',
               onClick (picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                  picker.$emit('pick', [ start, end ]);
               }
            }, {
               text: '最近三个月',
               onClick (picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                  picker.$emit('pick', [ start, end ]);
               }
            } ]
         },
         value:'',
         /* 订单饼图数据 */
         timePie: [],
         /* 消费饼图数据 */
         customerPie: [],
         /* 接收请求接口返回的订单量 */
         orderList:[]
      };
   },
   methods: {
      /* 时间选择器发生改变的时候 */
      async changeDate (val){
         this.start = moment(val[0]).format('YYYY-MM-DD');
         this.end = moment(val[1]).format('YYYY-MM-DD');
         /* 获取新的x轴数据 */
         this.getAxisData(this.start,this.end);
         /* 请求接口 */
         const result = await order({ start:this.start,end:this.end });
         this.orderList = result.list;
         this.allData();
         this.loadLine();
         this.loadPie();
         this.loadDownPie();
         /* 清空上一次的数据，不然会叠加 */
         this.xAxisData = [];
         this.seriesData = [];
         this.orderList = [];
         this.customerDate = [];
         this.timePie = [];
         this.customerPie = [];
      },
      /* 折线图 */
      loadLine (){
         // 基于准备好的dom，初始化echarts实例
         let line = this.$echarts.init(document.getElementById('lineChart'));
         // 指定图表的配置项和数据
         const option = {
            xAxis: {
               data: this.xAxisData
            },
            yAxis: {
               type:'value'
            },
            series: [ {
               type: 'line',
               data: this.seriesData
            } ]
         };
         // 使用刚指定的配置项和数据显示图表
         line.setOption(option);
      },
      /* 订单情况饼图 */
      loadPie (){
         // 基于准备好的dom，初始化echarts实例
         let pie = this.$echarts.init(document.getElementById('pieChart'));
         // 指定图表的配置项和数据
         const option = {
            series: [ {
               type: 'pie',
               data: this.timePie
            } ]
         };
         // 使用刚指定的配置项和数据显示图表
         pie.setOption(option);
      },
      /* 消费情况饼图 */
      loadDownPie (){
         // 基于准备好的dom，初始化echarts实例
         let downPie = this.$echarts.init(document.getElementById('pieOptions'));
         // 指定图表的配置项和数据
         const option = {
            series: [ {
               type: 'pie',
               data: this.customerPie
            } ]
         };
         // 使用刚指定的配置项和数据显示图表
         downPie.setOption(option);
      },
      /* x轴数据 */
      getAxisData (start,end){
         const startTime = new Date(start);
         const endTime = new Date(end);
         /* 日期范围，moment-range取两个值的差值 */
         const rangeTime = moment.range(startTime,endTime);
         /* 将类数组对象转化成一个数组 */
         let date = Array.from(rangeTime.by('day', { step: 1 }));
         /* 将item的时间标准化===>x轴的时间 */
         _.forEach(date,(item)=>{
            this.xAxisData.push(moment(item).format('YYYY-MM-DD'));
         });
      },
      /* line，pie数据的整合 */
      allData (){
         /* 根据时间 line数据 */
         const cloneByTime = this.orderList;
         const groupByTime = this.xAxisData;
         const timeCount = _.groupBy(cloneByTime, (item)=>{
            /* item是每一个订单 */
            return moment(item.createdAt).format('YYYY-MM-DD');
         });
         /* seriesData是每一个日期对应的Y轴的值 */
         this.seriesData = _.map(groupByTime,(item)=>{
            /* item是x轴的日期 */
            return timeCount[item] ? timeCount[item].length : 0;

         });
         /* 根据时间 pie数据 */
         let total = this.orderList.length;
         let percent = '0%';
         _.map(this.seriesData ,(item,index)=>{
            if(item !== 0){
               percent = (Math.round(item / total * 10000) / 100.00) + '%';
            }
            this.timePie.push({
               name: this.xAxisData[index] + ' : ' + this.seriesData[index] + ' (' + percent + ')',
               value: this.seriesData[index]
            });
         });

         /* 根据顾客整合 pie数据 */
         const cloneByCustomer = this.orderList;
         /* 顾客姓名 */
         const customerName = [];
         _.forEach(cloneByCustomer, (item)=>{
            if(item.user !== null){
               if(!_.includes(customerName,item.user.username)){
                  customerName.push(item.user.username);
               }
            }else{
               if(!_.includes(customerName,undefined)){
                  customerName.push(undefined);
               }
            }
         });
         /* 购买数量 */
         const customerCount = _.groupBy(cloneByCustomer, (item)=>{
            if(item.user !== null){
               return item.user.username;
            }
         });
         const customerData = _.map(customerName,(item)=>{
            return customerCount[item] ? customerCount[item].length : 0;

         });
         /* 将购买数量转为百分比 */
         let customerPercent = '0%';
         _.map(customerData ,(item,index)=>{
            if(item !== 0){
               customerPercent = (Math.round(item / total * 10000) / 100.00) + '%';
            }
            /* customerPie显示的是顾客姓名：购买百分比的形式 */
            this.customerPie.push({
               name: customerName[index] + ' : ' + customerData[index] + ' (' + customerPercent + ')',
               value: customerData[index]
            });
         });

      }
   },
};
</script>

<style lang="scss">
.topChart{
   display : flex;
}
.downChart{
   width : 800px;
   margin : 30px auto;
}
</style>