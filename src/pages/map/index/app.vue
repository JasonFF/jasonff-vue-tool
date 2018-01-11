<template>
  <div id="app">
     <div class="mapContent">
            <div class="statisticsBox">
                <h3 class="title">
                    <i class="fa fa-bar-chart"></i> 
                    <span>全国统计</span>
                </h3>
                <div class="instrumentBox">
                    <div class="selectBox">
                        <span>仪器类型：</span>
                        <i-select size="small" style="width:150px">
                            <i-option value="beijing">New York</i-option>
                            <i-option value="shanghai" disabled>London</i-option>
                            <i-option value="shenzhen">Sydney</i-option>
                        </i-select>
                    </div>
                    <div class="selectBox">
                        <span>仪器名称：</span>
                        <i-select size="small" style="width:150px">
                            <i-option value="beijing">New York</i-option>
                            <i-option value="shanghai" disabled>London</i-option>
                            <i-option value="shenzhen">Sydney</i-option>
                        </i-select>
                    </div>
                </div>
                <div class="dataBox">
                    <div class="showItem" style="border-left: 1px solid #ddd">
                        <h4 class="title">总投放量</h4>
                        <div class="dataNumber">100台</div>
                    </div>
                    <div class="showItem">
                        <h4 class="title">在线</h4>
                        <div class="dataNumber">100台</div>
                    </div>
                    <div class="showItem">
                        <h4 class="title">离线</h4>
                        <div class="dataNumber">100台</div>
                    </div>
                    <div class="showItem">
                        <h4 class="title">故障</h4>
                        <div class="dataNumber">100台</div>
                    </div>
                </div>

            </div>
            <div id="map"></div>
        </div>
        <!-- <div class="test">
            <i-button @click="show">Click me!</i-button>
            <Modal v-model="visible" title="Welcome">Welcome to iView</Modal>
        </div> -->
  </div>
</template>

<script>
import logo from 'assets/img/logo.png'
import mapModule from './mapModule'

export default {
  data () {
    return {
      visible: false
    }
  },

  methods: {
    show () {
      this.visible = true
    }
  },
  mounted () {
    mapModule.baiduMapModule.init()
    mapModule.countryModule.init()
  }
}
</script>

<style lang="postcss">
  html,
        body {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
        }

        #app {
            width: 100%;
            height: 100%;
        }

        .mapContent {
            position: relative;
            width: 100%;
            height: 80%;
        }

        #map {
            width: 100%;
            height: 100%;
        }

        .statisticsBox {
            position: absolute;
            width: 100%;
            height: 70px;
            padding: 10px;
            background: rgba(14, 61, 105, 0.75);
            z-index: 9;
            color: #fff
        }

        .statisticsBox > .title {
            float: left;
            margin-top: 7px;
            font-size: 20px;
        }

        .instrumentBox {
            float: left;
            padding-top: 10px;
            margin-left: 30px;
        }

        .selectBox {
            display: inline-block;
            margin-left: 8px;
        }
        .dataBox {
            float: left;
            margin-left: 30px
        }
        .dataBox > .showItem {
            display: inline-block;
            width: 100px;
            text-align: center;
            border-right: 1px solid #ddd
        }
        .dataBox > .showItem > .title {
            font-weight: normal
        }
        .dataBox > .showItem > .dataNumber {
            font-size: 20px
        }
</style>
