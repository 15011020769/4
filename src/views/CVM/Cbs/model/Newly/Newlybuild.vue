<template>
  <div class="New">
    <el-dialog
      :visible.sync='NewDialog'
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      :show-close='false'
      center>
       <div slot="title" class="title-wrap">
        <span>购买数据盘</span>
        <i class="el-icon-close" @click="cancel"></i>
      </div>
      <div class="words">
        <p>1、仅支持同可用区挂载：弹性云盘可在同可用区的实例之间自由挂载、卸载，不支持跨可用区操作</p>
        <p>2、挂载后需初始化：购买后需要在控制台挂载到实例，并登录到实例进行初始化方可使用， 查看详情 </p>
      </div>
      <div class="configure">
        <ul>
          <li>
            <p>可用区</p>
            <div>
              <Available :AvailableArea='AvailableArea'
                v-on:changeArea="changeArea"
                :value.sync="selectedRegion"></Available>
            </div>
          </li>
          <li>
            <p>云硬盘类型</p>
            <div>
              <HardDiskType :DiskTypeArr='DiskTypeArr'
                v-on:changeType="changeType"
                :value.sync="selectedType"></HardDiskType>
            </div>
          </li>
          <li>
            <p>容量</p>
            <div>
              <div class="block">
                <el-slider :max='16000'
                  @change='slider'
                  :min='10'
                  :step="10"
                  v-model="slidervalue"
                  show-input>
                </el-slider>
              </div>
            </div>
          </li>
          <li>
            <p>快照</p>
            <div>
              <el-checkbox v-model="checked">使用快照创建云硬盘</el-checkbox>
            </div>
          </li>
          <li v-if="checked">
            <p></p>
            <div class="jingxiang">
              <el-select v-model="snapshotvalue"
                @change='changesnapshot'
                placeholder="请选择">
                <el-option v-for="item in snapshot"
                  :key="item.SnapshotId"
                  :label="`[${item.DiskSize}GB]${item.SnapshotId}|${item.SnapshotName}`"
                  :value="item.SnapshotId">
                </el-option>
              </el-select>
            </div>
          </li>
          <li>
            <p>硬盘名称</p>
            <div>
              <el-input v-model="inputName"
                placeholder="选填"
                size='mini'></el-input>
            </div>
          </li>
          <li>
            <p>所属项目</p>
            <div class="project-style">
              <el-select v-model="projectvalue"
                @change='changeproject'
                placeholder="请选择">
                <el-option v-for="item in projectList"
                  :key="item.projectInfo"
                  :label="item.projectName"
                  :value="item.projectId">
                </el-option>
              </el-select>
            </div>
          </li>
          <li>
            <p>标签</p>
            <div v-if="addto">
              <el-button type="text"
                size="mini"
                @click="Addto">添加</el-button>
            </div>
            <div v-if="addtable"
              class="addtable-style">

              <el-table :data="tableData"
                type=index
                style="width: 100%">
                <el-table-column prop=""
                  label="标签键"
                  width="200">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.KeysID"
                      @change='changeKeysID'
                      placeholder="请选择">
                      <el-option v-for="item in scope.row.a"
                        :key="item"
                        :label="item"
                        :value="item">
                      </el-option>
                    </el-select>
                    <p></p>
                  </template>
                </el-table-column>
                <el-table-column prop=""
                  label="标签值"
                  width="200">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.valueID"
                      @change='changeValue(scope.row.valueID,scope.$index)'
                      placeholder="请选择">
                      <el-option v-for="item in valueArr"
                        :key="item.TagValue"
                        :label="item.TagValue"
                        :value="item.TagValue">
                      </el-option>
                    </el-select>
                    <p></p>
                  </template>
                </el-table-column>
                <el-table-column prop=""
                  width="100"
                  label="操作">
                  <template slot-scope="scope">

                    <p>
                      <el-button type="text"
                        size="mini"
                        @click="deletel(scope.$index,scope.row)">删除</el-button>
                    </p>

                  </template>
                </el-table-column>
              </el-table>
              <el-button type="text"
                size="mini"
                class="addtable-style-p"
                @click="AddtoTr">添加</el-button> <span style="color:red"> 不可选相同标签健的相同标签值</span>

            </div>
          </li>
          <li>
            <p>计费模式</p>
            <div>
              <Billing :BillingArr='BillingArr'
                v-on:changeBilling='changeBilling'
                :value.sync="selectedBill"></Billing>
            </div>
          </li>
          <li>
            <p>购买数量</p>
            <div>
              <el-input-number v-model="num"
                @change="handleChange"
                :min="1"
                :max="50"
                label="购买数量"
                size="mini"></el-input-number>
            </div>
          </li>
          <li class="duration-style"
            v-show="showdur">
            <p>购买时长</p>
            <div>
              <Duration :DurationArr='DurationArr'
                class="Durstyle"
                v-on:changeDuration="changeDuration"
                :value.sync="selectedDuration">
              </Duration>
              <a @click="OtherDuration"
                v-if="Durationshow">其他时长</a>

            </div>
          </li>
          <li>
            <p>自动续费</p>
            <div>
              <el-checkbox v-model="Renewchecked">账户余额足够时，设备到期后按月自动续费</el-checkbox>
            </div>
          </li>
          <li>
            <p>费用</p>
            <div class="style-Price"
              v-if="Priceshow">
              <div class="display-line-p">
                <span v-if="this.OriginalPrice.OriginalPrice===this.OriginalPrice.DiscountPrice"
                  class="font-size-span">{{OriginalPrice.OriginalPrice}}<span> 元</span></span>
                <span v-if="this.OriginalPrice.OriginalPrice!==this.OriginalPrice.DiscountPrice"
                  class="font-size-span">{{OriginalPrice.DiscountPrice}}<span> 元</span>
                  <span class="color-span">{{OriginalPrice.OriginalPrice}}元</span>
                  </span>
              </div>

            </div>
            <div class="style-Price"
              v-if="Unitshow">
            <span class="font-size-span">  {{OriginalPrice.UnitPrice}}<span>元/小时</span></span>
            </div>
          </li>
        </ul>
      </div>

      <span slot="footer"
        class="dialog-footer">
         <el-button @click="Determine" type="primary">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>

      </span>
    </el-dialog>
  </div>
</template>

<script>
import Available from './AvailableArea' // 可用区组件
import HardDiskType from './HardDiskType' // 可用硬盘组件
import Billing from './Billing' // 计费模式组件
export default {
  props: ['NewDialog'],
  data () {
    return {
      num: 1, // 购买数量
      slidervalue: 10,
      selectedRegion: '', // 可用区选中样式判断
      selectedType: '', // 硬盘选中样式判断
      selectedBill: '', // 计费模式样式判断
      selectedCity: {}, // 可用区选中
      selectedDiskType: {}, // 硬盘选中
      selectedBilling: {}, // 计费模式选中
      AvailableArea: [], // 可用区列表
      DiskTypeArr: [], // 硬盘类型列表
      selectedDuration: '', // 时长样式判断
      selDuration: {}, // 默认选中时长
      DurationArr: [], // 时长按钮列表
      checked: false, // 快照选择框
      snapshotvalue: '', // 快照下拉
      projectvalue: 0, // 项目下拉
      inputName: '', // 硬盘名称
      BillingArr: [
        { type: 'PREPAID', label: '包年包月', value: 'Bo' },
        { type: 'POSTPAID_BY_HOUR', label: '按量计费', value: 'Bin' }
      ],
      BillType: '', // 计费模式得到值
      DurationNum: '', // 购买时长得到值
      OtherDura: false, // 其他时长
      Durationshow: true, // 显示隐藏其他时长按钮
      showdur: true, // 按量计费不显示时长
      Renewchecked: false, // 自动续费勾选
      OriginalPrice: '', // 原价
      Priceshow: true, // 价格显示隐藏
      Unitshow: false, // 价格显示隐藏
      parms: '', // 确定之后传参
      projectList: JSON.parse(localStorage.getItem('projectList')),
      snapshot: [], // 快照列表
      mirrorvalue: '', // 快照ID
      addto: true, // 标签文字
      addtable: false, // 标签表格
      tableData: [],
      KeysArr: [], // 标签健列表
      KeysID: '', // 选中标签健
      valueArr: [], // 标签值列表
      valueID: '', // 选中标签值
      keyValueArr: [] // 标签键和值
    }
  },
  components: { Available, HardDiskType, Billing }, // 注册组件
  created () {
    this.GetArea()
    this.GetBilling()
    this.GetDuration()
    this.TagKeys()
  },
  methods: {
    // 获取可用区
    GetArea () {
      var parms = {
        Version: '2017-03-12',
        Region: this.$cookie.get('regionv2')
      }
      this.axios
        .post('cvm/DescribeZones', parms)
        .then(data => {
          for (var i = 0; i < data.Response.ZoneSet.length; i++) {
            if (data.Response.ZoneSet[i].ZoneState === 'AVAILABLE') {
              this.AvailableArea.push(data.Response.ZoneSet[i])
            }
          }
          this.selectedRegion = this.AvailableArea[0].Zone
          this.value = this.selectedRegion
          this.selectedCity = this.AvailableArea[0]
        })
        .then(data => {
          this.GetDiskType()
          this.Getsnapshot()
        })
    },

    // 切换可用区
    changeArea (Avail) {
      this.DiskTypeArr = []
      this.selectedCity = Avail
      this.slidervalue = 10
      this.GetDiskType()
    },
    // 获取硬盘类型
    GetDiskType () {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      var parms = {
        Version: '2017-03-12',
        Region: this.$cookie.get('regionv2'),
        InquiryType: 'INQUIRY_CBS_CONFIG',
        'Zones.0': this.selectedCity.Zone,
        DiskChargeType: this.BillType
      }
      this.axios
        .post('cbs2/DescribeDiskConfigQuota', parms)
        .then(data => {
          var Aera = []
          for (var i = 0; i < data.Response.DiskConfigSet.length; i++) {
            if (data.Response.DiskConfigSet[i].Available === true) {
              Aera.push(data.Response.DiskConfigSet[i])
            }
          }
          this.DiskTypeArr = Aera
          this.selectedType = this.DiskTypeArr[0].DiskType
          this.value = this.selectedType
          this.selectedDiskType = this.DiskTypeArr[0]
        })
        .then(data => {
          this.inquiry()
          this.Getsnapshot()
          loading.close()
        })
    },
    // 切换硬盘类型
    changeType (type) {
      this.selectedDiskType = type
      if (this.selectedDiskType.DiskType === 'CLOUD_SSD') {
        if (this.slidervalue < 100) {
          this.slidervalue = 100
        }
      }
      this.Getsnapshot()
      this.inquiry()
    },
    // 计费模式默认值
    GetBilling () {
      this.selectedBill = this.BillingArr[0].value
      this.value = this.selectedBill
      this.selectedBilling = this.BillingArr[0]
      this.BillType = this.selectedBilling.type
    },
    // 切换计费模式
    changeBilling (Bill) {
      this.value = Bill.value
      this.BillType = Bill.type
      this.selectedBilling = Bill
      this.GetDiskType()
      if (this.BillType === 'POSTPAID_BY_HOUR') {
        this.showdur = false
      } else {
        this.showdur = true
      }
    },
    // 购买数量
    handleChange (value) {
      this.num = value
      this.inquiry()
    },
    // 购买时长
    GetDuration () {
      let DuraArr1 = [
        { type: '1', label: '1个月', value: 'BOB1' },
        { type: '2', label: '2个月', value: 'BOB2' },
        { type: '3', label: '3个月', value: 'BOB3' }
      ]
      let DuraArr2 = [
        { type: '4', label: '4个月', value: 'BOB4' },
        { type: '5', label: '5个月', value: 'BOB5' },
        { type: '6', label: '6个月', value: 'BOB6' },
        { type: '7', label: '7个月', value: 'BOB7' },
        { type: '8', label: '8个月', value: 'BOB8' },
        { type: '9', label: '9个月', value: 'BOB9' },
        { type: '10', label: '10个月', value: 'BOB10' },
        { type: '11', label: '11个月', value: 'BOB11' }
      ]

      let DuraArr3 = [
        { type: '12', label: '1年', value: 'BOA1' },
        { type: '24', label: '2年', value: 'BOA2' },
        { type: '36', label: '3年', value: 'BOA3' }
      ]

      let DuraArr4 = [
        { type: '48', label: '4年', value: 'BOA4' },
        { type: '60', label: '5年', value: 'BOA5' }
      ]
      if (this.OtherDura === false) {
        this.DurationArr = DuraArr1.concat(DuraArr3)
      } else {
        this.DurationArr = DuraArr1.concat(DuraArr2, DuraArr3, DuraArr4)
      }
      this.selectedDuration = this.DurationArr[0].value
      this.value = this.selectedDuration
      this.selDuration = this.DurationArr[0]
      this.DurationNum = this.selDuration.type
    },
    // 切换购买时长
    changeDuration (value) {
      this.selDuration = value
      this.value = this.selDuration.value
      this.DurationNum = this.selDuration.type
      this.inquiry()
    },
    // 其他时长
    OtherDuration () {
      this.Durationshow = false
      this.OtherDura = true
      this.DurationNum = this.DurationArr[0].type
      this.GetDuration()
      this.inquiry()
    },
    // 容量发生变化
    slider (value) {
      this.slidervalue = value
      this.inquiry()
    },

    // 询价
    inquiry () {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      if (this.BillType === 'POSTPAID_BY_HOUR') {
        this.Priceshow = false
        this.Unitshow = true
        var parms = {
          Version: '2017-03-12',
          Region: this.$cookie.get('regionv2'),
          DiskType: this.selectedDiskType.DiskType,
          DiskSize: this.slidervalue,
          DiskCount: this.num,
          DiskChargeType: this.BillType,
          ProjectId: this.projectvalue
        }
      } else if (this.BillType === 'PREPAID') {
        this.Priceshow = true
        this.Unitshow = false
        parms = {
          Version: '2017-03-12',
          Region: this.$cookie.get('regionv2'),
          DiskType: this.selectedDiskType.DiskType,
          DiskSize: this.slidervalue,
          DiskCount: this.num,
          DiskChargeType: this.BillType,
          ProjectId: this.projectvalue,
          'DiskChargePrepaid.Period': this.DurationNum
        }
      }
      this.axios.post('cbs2/InquiryPriceCreateDisks', parms).then(data => {
        this.OriginalPrice = data.Response.DiskPrice
        loading.close()
      })
    },
    // 切换项目
    changeproject (value) {
      this.projectvalue = value
      this.Getsnapshot()
    },
    // 查询快照列表
    Getsnapshot () {
      var parms = {
        Version: '2017-03-12',
        Region: this.$cookie.get('regionv2'),
        'Filters.0.Name': 'snapshot-state',
        'Filters.0.Values.0': 'NORMAL',
        'Filters.1.Name': 'zone',
        'Filters.1.Values.0': this.selectedCity.Zone,
        'Filters.2.Name': 'project-id',
        'Filters.2.Values.0': this.projectvalue,
        'Filters.3.Name': 'disk-usage',
        'Filters.3.Values.0': this.selectedDiskType.DiskUsage
      }
      this.axios.post('cbs2/DescribeSnapshots', parms).then(data => {
        console.log(data)
        this.snapshot = data.Response.SnapshotSet
      })
    },
    // 选择快照获取快照ID
    changesnapshot (value) {
      this.mirrorvalue = value
    },
    // 标签显示隐藏
    Addto () {
      this.tableData = []
      this.addto = false
      this.addtable = true
      this.AddtoTr()
    },
    // 添加标签行
    AddtoTr () {
      let obj = {
        a: this.KeysArr
      }
      this.tableData.push(obj)
    },
    // 删除标签行
    deletel (index, value) {
      this.tableData.splice(index, 1)
      if (this.tableData.length === 0) {
        this.tableData = [{}]
        this.keyValueArr = []
        this.addto = true
        this.addtable = false
      }
      for (var i = 0; i < this.keyValueArr.length; i++) {
        if (
          this.keyValueArr[i].key === value.KeysID &&
          this.keyValueArr[i].value === value.valueID
        ) {
          this.keyValueArr.splice(index, 1)
        }
      }
    },
    // 查询标签键
    TagKeys () {
      var parms = {
        Version: '2018-08-13',
        Region: this.$cookie.get('regionv2')
      }
      this.axios.post('tag2/DescribeTagKeys', parms).then(data => {
        this.KeysArr = data.Response.Tags
      })
    },
    // 选中标签键
    changeKeysID (value) {
      this.KeysID = value
      if (this.KeysID) {
        this.Getvalue()
      }
    },
    // 标签值
    Getvalue () {
      this.valueArr = []
      var parms = {
        Version: '2018-08-13',
        Region: this.$cookie.get('regionv2'),
        'TagKeys.0': this.KeysID
      }
      this.axios.post('tag2/DescribeTagValues', parms).then(data => {
        this.valueArr = data.Response.Tags
      })
    },
    // 选中标签值
    changeValue (value, index) {
      this.valueID = value
      var keyObj = {
        key: this.KeysID,
        value: this.valueID
      }
      this.keyValueArr.push(keyObj)
    },
    // 创建云硬盘所需的数据
    GetPrams () {
      this.parms = {
        Region: this.$cookie.get('regionv2'),
        selectedCity: this.selectedCity,
        selectedDiskType: this.selectedDiskType,
        selectedBilling: this.selectedBilling,
        DiskSize: this.slidervalue,
        DiskCount: this.num,
        ProjectId: this.projectvalue,
        DurationNum: this.DurationNum,
        Price: this.OriginalPrice
      }
      if (this.checked === true) {
        this.parms.mirrorvalue = this.mirrorvalue
        if (this.parms.mirrorvalue === '') {
          this.$message.error('未选择快照')
        }
      }
      if (this.inputName !== '') {
        this.parms.diskName = this.inputName
      }
      if (this.keyValueArr.length !== 0) {
        this.parms.keyValueArr = this.keyValueArr
      }

      if (this.Renewchecked === true) {
        this.parms['DiskChargePrepaid.RenewFlag'] = 'NOTIFY_AND_AUTO_RENEW'
      }
    },
    cancel () {
      // 取消
      this.$emit('close', false)
    },
    Determine () {
      this.GetPrams()
      this.$router.push({
        name: 'Cbs-check'
      })
      localStorage.setItem('CBS-parms', JSON.stringify(this.parms))

      // 确定
      this.$emit('close', false)
    }
  }
}
</script>

<style lang="scss">
.New {
  .el-dialog__header {
    text-align: left;
    font-weight: bold;
  }
   .title-wrap {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    span {
      font-weight: bolder;
    }
    i {
      font-size: 16px;
      font-weight: 900;
      cursor: pointer;
    }
  }
  .el-dialog__body {
    font-size: 12px;
    .words {
      color: #003b80;
      border: 1px solid #97c7ff;
      background: #e5f0ff;
      padding: 10px 30px 10px 20px;
    }
    .configure {
      ul {
        li {
          display: flex;
          padding: 10px 0;
          p {
            width: 100px;
          }
          .jingxiang {
            .el-input--suffix .el-input__inner {
              width: 300px;
              height: 30px;
            }
            .el-input__suffix {
              right: -140px;
            }
          }
          .project-style {
            .el-input--suffix .el-input__inner {
              width: 170px;
              height: 30px;
            }
            .el-input__suffix {
              right: -30px;
            }
          }
          .addtable-style {
            border: 1px solid #ccc;
            .el-input--suffix .el-input__inner {
              width: 180px;
              height: 25px;
            }
            .el-input__suffix {
              right: -40px;
            }
            .addtable-style-p {
              padding: 10px;
            }
          }
          a {
            padding-left: 20px;
            cursor: pointer;
          }
          .block {
            width: 520px;
          }
        }
        .duration-style {
          display: flex;
          p {
            width: 15%;
          }
          div {
            width: 85%;
          }
        }
      }
      .Durstyle {
        display: inline;
      }
      .style-Price {
        color: #ff7a22;
        .font-size-span {
          font-size: 24px;
        }
        .color-span{
          padding-left: 10px;
          color: #a2a2a2;
          text-decoration:line-through
        }
        span {
          font-size: 16px;
        }
      }
    }
  }
  .el-select-dropdown__list {
    width: 300px;
  }
}
</style>
