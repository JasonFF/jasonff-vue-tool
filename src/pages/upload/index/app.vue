<template>
  <div class="app" style="padding: 30px 50px">
    <div style='width: 800px;border: 1px solid #ddd;padding:20px 30px'>
      <div class="formModalContainer">
        <div class="uploadBox">
          <Upload class="uploadBtn" :format="['jpg','jpeg','png','gif']" :show-upload-list="false" :on-success='uploadSuccess' multiple
            :action="uploadUrl">
            <Button type="ghost" icon="ios-cloud-upload-outline">上传图片</Button>
          </Upload>
          <div class="uploadTips">
            (允许上传2M以内的gif，jpeg，jpg，png图片，支持多张上传)
          </div>
        </div>
        <div class="uploadImageListBox">
          <h3 style="font-size: 14px">
            已上传待关联图片
          </h3>
          <div v-for="item in list" :key="item.id" class="imageItemBox">
            <div class="itemHeader clearBoth">
              <div class="headerTitle">{{item.title}}</div>
              <Icon class="closeIcon" @click.native="deleteItem(item)" type="close"></Icon>
            </div>
            <div class="itemBody clearBoth">
              <div class="checkBox">
                <Checkbox :disabled="!item.status" size="large" @on-change="checkItem(item)" :value="!!checkedItem['$'+item.id]"></Checkbox>
              </div>
              <div class="imgBox">
                <img :src="item.img" alt="">
              </div>
              <div class="itemFormBox">
                <div class="itemInput">
                  对应发货单号：
                  <div class="inputBox">
                    <Input clearable :disabled="!item.canEdit" v-model="item.orderNum" />
                  </div>
                  <span class="red">*</span>
                  <div v-if="!item.status" class="statusInfo red">无对应发货编号</div>
                  <div v-else class="statusInfo green">有对应发货编号</div>
                </div>
                <div class="btnBox">
                  <Upload class="uploadBtn" :format="['jpg','jpeg','png','gif']" :on-success="reloadSuccess(item)" :show-upload-list="false" multiple
                    :action="`${uploadUrl}?imgId=${item.id}`">
                    <Button class="itemFormBtn">重新上传本张图片</Button>
                  </Upload>
                  <Button class="itemFormBtn" @click.native="parseQrcode(item)">识别图中条形码</Button>
                  <Button class="itemFormBtn" v-if="!item.canEdit" @click.native="change(item)">修改</Button>
                  <Button class="itemFormBtn" v-if="item.canEdit" type="success" @click.native="saveItem(item)">保存</Button>
                </div>
              </div>
            </div>
          </div>
          <div class="pageBox">
            <Page :current="pageIndex" @on-change="changePage" :page-size="pageSize" :total="totalCount"></Page>
          </div>

        </div>
        <div class="formModalFooter">
          <span>(注意：点击提交后，上传关联签收单才真正完成)</span>
          <Button class="finishBtn" @click.native="submit" type="success">提交选中的条目(已选中{{checkedList.length}}条)</Button>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
  import {
    action,
    BASEURL,
    getPics,
    parseQrcode,
    editItem,
    deleteItem,
    submit
  } from './util';
  import Vue from 'vue'


  export default {
    name: 'App',
    data() {
      return {
        BASEURL: BASEURL,
        list: [
          //   {
          //   id: 1,
          //   title: '图片1',
          //   orderNum: '12312312312',
          //   status: 0,
          //   img: '',
          // }
        ],
        uploadUrl: `${BASEURL}/receipt/uploadFile`,
        pageIndex: 1,
        totalCount: 0,
        pageSize: 5,
        checkedItem: {}
      }
    },
    mounted() {
      this.init()
    },
    computed: {
      checkedList() {
        let result = []
        Object.keys(this.checkedItem).forEach(it => {
          if (this.checkedItem[it]) {
            result.push(this.checkedItem[it])
          }
        })
        return result
      }
    },
    methods: {
      init() {
        getPics({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }).then(res => {
          this.totalCount = res.iTotalDisplayRecords
          this.list = res.dataList.map(it => {
            return {
              id: it.id,
              title: it.deptName,
              img: it.imgUrl,
              orderNum: it.deliveryOrderNumInput,
              status: it.deliveryOrderNum,
              canEdit: false
            }
          })
        })
      },
      parseQrcode(item) {
        parseQrcode(item.img).then(res => {
          if (!res || res.result == 1) {
            return this.$Message.error('修改失败')
          }
          item.orderNum = res.deliveryOrderNumInput
          item.status = res.deliveryOrderNum
        })
      },
      change(item) {
        item.canEdit = true
      },
      changePage(page) {
        this.pageIndex = page
        this.init()
      },
      saveItem(item) {
        editItem({
          id: item.id,
          orderNum: item.orderNum
        }).then(res => {
          if (!res) {
            return this.$Message.error('修改失败')
          }
          if (res.result == 1) {
            return this.$Message.error('修改失败')
          } else {
              item.id = res.id,
              item.title = res.deptName,
              item.img = res.imgUrl,
              item.orderNum = res.deliveryOrderNumInput,
              item.status = res.deliveryOrderNum,
              item.canEdit = false
            return this.$Message.success('修改成功')
          }
        })
      },
      deleteItem(item) {
        this.$Modal.confirm({
          title: '确认删除',
          content: '<p>确认要删除么？</p>',
          onOk: () => {
            deleteItem({
              id: item.id,
              imgUrl: item.img
            }).then(res => {
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

      },
      uploadSuccess(res) {
        this.init()
      },
      reloadSuccess(item) {
        return res => {
          item.id = res.id,
          item.title = res.deptName,
          item.img = res.imgUrl,
          item.orderNum = res.deliveryOrderNumInput,
          item.status = res.deliveryOrderNum,
          item.canEdit = false
        }
      },
      submit() {
        submit(this.checkedList.map(it => {
          return {
            id: it.id,
            imgUrl: it.img,
            deliveryOrderNumInput: it.orderNum
          }
        })).then(res => {
          if (res.result == 0) {
            this.$Message.success('提交成功')
          } else {
            this.$Message.error('提交失败')
          }
        })
      },
      checkItem(item) {
        const pre = this.checkedItem[`$${item.id}`]
        if(pre) {
         Vue.set(this.checkedItem, `$${item.id}`, null)
        } else {
          Vue.set(this.checkedItem, `$${item.id}`, item)
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  .formModalContainer {}

  .uploadBox {
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