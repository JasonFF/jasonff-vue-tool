<template>
  <div class="app">
    <Button @click="openModal">open modal</Button>
    <Modal width="800" v-model="visible" title="Welcome">
      <div class="formModalContainer">
        <div class="uploadBox">
          <Upload class="uploadBtn" :format="['jpg','jpeg','png','gif']" :show-upload-list="false" multiple action="//jsonplaceholder.typicode.com/posts/">
            <Button type="ghost" icon="ios-cloud-upload-outline">上传图片</Button>
          </Upload>
          <div class="uploadTips">
            (允许上传2M以内的gif，jpeg，jpg，png图片，支持多张上传)
          </div>
        </div>
        <div class="uploadImageListBox">

          <div class="imageItemBox">
            <div class="itemHeader clearBoth">
              <div class="headerTitle">图片1</div>
              <Icon class="closeIcon" type="close"></Icon>
            </div>
            <div class="itemBody clearBoth">
              <div class="imgBox">
                <img :src="myimg" alt="">
              </div>
              <div class="itemFormBox">
                <div class="itemInput">
                  对应发货单号：
                  <Input class="inputBox" />
                  <span class="red">*</span>
                </div>
                <div class="btnBox">
                  <Button class="itemFormBtn">重新上传本张图片</Button>
                  <Button class="itemFormBtn">识别图中条形码</Button>
                  <Button class="itemFormBtn">修改</Button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Modal>

  </div>
</template>
<script>
  import imgUrl from 'assets/img/logo.png'
  console.log(imgUrl)

  export default {
    name: 'App',
    data() {
      return {
        visible: false,
        myimg: imgUrl
      }
    },
    methods: {
      openModal() {
        this.visible = true
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

  .imgBox {
    float: left;
    width: 150px;
  }

  .itemFormBox {
    float: left;
  }
</style>