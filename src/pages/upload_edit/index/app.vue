<template>
  <div class="app" style="padding: 30px 50px">
    <div style='width: 800px;border: 1px solid #ddd;padding:20px 30px'>
      <div class="formModalContainer">
        <div class="radioBox">
          <RadioGroup v-model="hasOrder">
            <Radio :label="1" @click.native="changeReceipt(0)">有签收单</Radio>
            <Radio @click.native="changeReceipt(1)" :label="0">无签收单（ 无需上传签收单 ）</Radio>
          </RadioGroup>
        </div>
        <div v-if="hasOrder!=0" class="uploadBox">
          <Upload class="uploadBtn" :format="['jpg','jpeg','png','gif']" :show-upload-list="false" multiple :on-success="uploadSuccess"
            :action="uploadUrl">
            <Button type="ghost" icon="ios-cloud-upload-outline">新增图片</Button>
          </Upload>
          <div class="uploadTips">
            (允许上传2M以内的gif，jpeg，jpg，png图片，支持多张上传)
          </div>
        </div>
        <div v-for="item in list" :key="item.id" class="imageItemBox">
          <div class="itemHeader clearBoth">
            <div class="headerTitle">{{item.title}}</div>
            <Icon class="closeIcon" @click.native="deleteImg(item)" type="close"></Icon>
          </div>
          <div class="itemBody clearBoth">
            <div class="imgBox">
              <img :src="item.imgUrl" alt="">
            </div>
            <div class="reloadBox">
              <Upload class="uploadBtn" :format="['jpg','jpeg','png','gif']" :show-upload-list="false" multiple :on-success="uploadSuccess"
                :action="`${BASEURL}/receipt/uploadFile?imgId=${item.id}`">
                <Button type="ghost" icon="ios-cloud-upload-outline">更换图片</Button>
              </Upload>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
  import {
    BASEURL,
    getOrderNum,
    getItem,
    deleteImg,
    noReceipt,
    parseUrl
  } from './util';
  import Vue from 'vue'


  export default {
    name: 'App',
    data() {
      return {
        orderNum: getOrderNum(),
        BASEURL: BASEURL,
        hasOrder: 1,
        list: [
          //   {
          //   id: 1,
          //   title: '图片1',
          //   orderNum: '12312312312',
          //   status: 0,
          //   img: '',
          // }
        ],
        uploadUrl: `${BASEURL}/receipt/uploadFile?deliveryOrderNum=${getOrderNum()}`,
        pageIndex: 1,
        totalCount: 0,
        pageSize: 5,
        checkedItem: {}
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      changeReceipt(status) {
        if (status == 1) {
          this.$Modal.confirm({
            title: '确认',
            content: '<p>无签收单将删除所有照片。</p>',
            onOk: () => {
              noReceipt(this.orderNum, 1).then(res => {
                if (res.result == 0) {
                  this.init()
                }
              })
            },
            onCancel: () => {
              this.hasOrder = 1
            }
          });
        } else {
          noReceipt(this.orderNum, status).then(res => {
                if (res.result == 0) {
                  this.init()
                }
              })
        }
        
        
      },
      uploadSuccess() {
        this.init()
        this.$Message.success('上传成功')
      },
      init() {
        getItem(this.orderNum).then(res => {
          this.list = res.imgsList
          if (res.receivestatus == 2) {
            this.hasOrder = 0
          } else {
            this.hasOrder = 1
          }
          
        })
      },
      deleteImg(item) {
        this.$Modal.confirm({
          title: '确认删除',
          content: '<p>确认要删除么？</p>',
          onOk: () => {
            deleteImg(item.id, item.imgUrl).then(res => {
              if (res.result == 0) {
                this.$Message.success('删除成功')
              } else {
                this.$Message.error('删除失败')
              }
              this.init()
            })
          },
          onCancel: () => {

          }
        });

      }
    }
  }
</script>
<style lang="less" scoped>
  .uploadBox {
    margin: 20px 0;
    &:after {
      content: '';
      display: block;
      clear: both
    }
  }

  .uploadBtn {
    float: left
  }

  .uploadTips {
    margin-left: 10px;
    line-height: 30px;
    float: left;
    color: #999;
  }

  .uploadImageListBox {
    margin-top: 20px;
  }

  .clearBoth {
    &:after {
      content: '';
      display: block;
      clear: both;
    }
  }

  .headerTitle {
    float: left;
  }

  .closeIcon {
    float: right
  }

  .itemBody {
    padding: 10px 30px;
  }

  .checkBox {
    float: left;
    width: 5%;
    padding-top: 30px;
  }

  .imgBox {
    float: left;
    width: 20%;
    height: 100%;
    overflow: hidden;
    text-align: center;
    img {
      width: 100px;
      height: 100px;
      border: 1px solid #ddd;
    }
  }

  .itemInput {
    position: relative;
  }

  .itemFormBox {
    float: left;
    width: 75%;
    height: 100%;
    padding: 10px 30px;
  }

  .inputBox {
    display: inline-block;
    width: 50%;
  }

  .red {
    color: orangered
  }

  .green {
    color: green
  }

  .statusInfo {
    position: absolute;
    right: 30px;
    top: 6px;
  }

  .btnBox {
    margin-top: 20px;
    .itemFormBtn {
      width: 130px;
      margin-right: 5px;
    }
  }

  .imageItemBox {
    border-bottom: 1px dashed #ddd;
    padding: 10px 0;

  }

  .uploadImageListBox {
    border-top: 1px solid #ddd;
    padding: 10px 0;
  }

  .closeIcon {
    font-size: 16px;
    transition: all 0.3s ease;
    cursor: pointer;
    &:hover {
      color: #999;
    }
    &:active {
      color: #333;
    }
  }

  .formModalFooter {
    text-align: right;
  }

  .finishBtn {
    margin-left: 20px;
  }

  .pageBox {
    padding: 20px 0;
    text-align: right;
    border-bottom: 1px dashed #ddd;
  }
</style>