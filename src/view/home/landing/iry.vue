<template>
  <div class="landingPage">
    <n-form :model="formValue"
            :rules="rules"
            ref="formRef">
      <n-card style="margin-bottom: 16px;">
        <n-tabs type="line"
                v-model:value="tabName">
          <n-tab-pane name="tiktok"
                      tab="抖音/头条"
                      display-directive="if">
            <div style="text-align:center;">
              <div class="content">
                <n-form-item label="头部代码"
                             path="headCode"
                             style="width:700px">
                  <n-input type="textarea"
                           v-model:value="formValue.headCode"
                           placeholder="输入头部代码" />
                </n-form-item>
                <n-form-item label="尾部代码"
                             path="footCode"
                             style="width:700px">
                  <n-input v-model:value="formValue.footCode"
                           placeholder="输入尾部代码" />
                </n-form-item>
              </div>
            </div>
          </n-tab-pane>
          <n-tab-pane name="kuaishou"
                      tab="快手">
            <div style="text-align:center;">快手无需点击转化代码</div>
          </n-tab-pane>
          <n-tab-pane name="gdt"
                      tab="广点通"
                      display-directive="if">
            <div style="text-align:center;">
              <div class="content">
                <div style="width:700px"></div>
                <n-form-item label="账号"
                             path="qq"
                             style="width:300px">
                  <n-input v-model:value="formValue.qq"
                           placeholder="输入广点通账号" />
                </n-form-item>
                <n-form-item label="ID/子账号"
                             path="uid"
                             style="width:300px">
                  <n-input v-model:value="formValue.uid"
                           placeholder="输入广点通ID/子账号" />
                </n-form-item>
                <n-form-item label="数据源"
                             path="udata"
                             style="width:300px">
                  <n-input v-model:value="formValue.udata"
                           placeholder="输入广点通数据源" />
                </n-form-item>
              </div>
            </div>
          </n-tab-pane>
        </n-tabs>
        <div style="text-align:center;">
          <div class="content">

            <n-form-item label="需求人"
                         path="name"
                         style="width:300px">
              <n-input v-model:value="formValue.name"
                       placeholder="输入需求人姓名" />
            </n-form-item>

            <n-form-item label="此人第几条需求"
                         path="index">
              <n-input-number placeholder="输入此人第几条需求"
                              v-model:value="formValue.index" />
            </n-form-item>

            <n-form-item label="页面"
                         path="page">
              <n-space>
                <n-select v-model:value="formValue.page"
                          filterable
                          placeholder="选择页面"
                          :options="pageList"
                          style="width:440px" />
                <n-button type="primary"
                          dashed
                          @click="getDemo('page')">查看页面DEMO</n-button>

              </n-space>
            </n-form-item>
            <n-form-item label="底图"
                         path="img">
              <n-space>
                <n-select v-model:value="formValue.img"
                          filterable
                          placeholder="选择底图"
                          :options="imgList"
                          style="width:440px" />
                <n-button type="info"
                          dashed
                          @click="getDemo('img')">查看图片DEMO</n-button>

              </n-space>
            </n-form-item>

            <n-form-item label="备案"
                         path="record">

              <n-input v-model:value="formValue.record"
                       placeholder="备案"
                       style="width:600px" />
              <n-space>
                <n-dropdown trigger="hover"
                            @select="handleSelect"
                            :options="recordOptions">
                  <n-button type="primary">快速选择</n-button>
                </n-dropdown>
              </n-space>
            </n-form-item>
            <!-- 底部按钮 -->
            <div class="footer">
              <n-button type="success"
                        @click="onSub"
                        :loading="btnLoading"
                        :disabled="btnLoading">一键生成落地页</n-button>
            </div>
          </div>
        </div>
      </n-card>
    </n-form>
    <!-- 抽屉 -->
    <n-drawer v-model:show="active.show"
              :width="502"
              placement="right">
      <n-drawer-content>
        <div class="draw_title">
          {{active.title}}
        </div>
        <iframe width="100%"
                height="100%"
                :src="active.url"
                frameborder="0"></iframe>
      </n-drawer-content>
    </n-drawer>
    <!-- 图片弹窗 -->
    <n-modal v-model:show="imgQuery.show">
      <n-card style="width: 600px;"
              :title="imgQuery.title"
              :bordered="false"
              size="huge">
        <template #header-extra>
          <n-icon size="30"
                  class="hove"
                  @click="imgQuery.show=false">
            <Close />
          </n-icon>
        </template>
        <div class="img_box">
          <img :src="imgQuery.url"
               alt="落地页底图"
               class="foot_img">
        </div>
      </n-card>
    </n-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRaw, watch, watchEffect } from "vue";
import { useMessage } from "naive-ui";
import { Close } from "@vicons/ionicons5";
import Api from "../../../api/api";
import pyTran from "../../../lib/vue-py";
export default defineComponent({
  setup() {
    const formRef = ref();
    const message = useMessage();
    // tab默认名字
    const tabName = ref("tiktok");
    // 数据初始
    const formInitValue = {
      name: "",
      index: 1,
      page: "",
      img: "",
      record: "",
      // 抖音头部代码
      headCode: "",
      // 抖音尾部
      footCode: "",
      // 广点通账号
      qq: "",
      // 广点通子账号
      uid: "",
      // 广点通数据源
      udata: "",
    };
    // 按钮loading
    const btnLoading = ref(false);
    // 数据
    const formValue = ref({ ...formInitValue });
    // 校验
    const rules = {
      name: {
        required: true,
        message: "请输入需求人姓名",
        trigger: "blur",
      },
      index: {
        required: true,
        message: "请输入此项为第几条需求",
        type: "number",
        trigger: "blur",
      },
      page: {
        required: true,
        message: "请选择需要生成的页面",
        trigger: "change",
      },
      img: {
        required: true,
        message: "请选择图片（将作为页面底图）",
        trigger: "change",
      },
      record: {
        required: true,
        message: "请输入备案信息",
        trigger: "blur",
      },
      headCode: {
        required: true,
        message: "请输入头部代码",
        trigger: "blur",
      },
      footCode: {
        required: true,
        message: "请输入尾部代码",
        trigger: "blur",
      },
      qq: {
        required: true,
        message: "请输入qq",
        trigger: "blur",
      },
      uid: {
        required: true,
        message: "请输入ID/子账号",
        trigger: "blur",
      },
      udata: {
        required: true,
        message: "请输入数据源",
        trigger: "blur",
      },
    };
    // 页面列表
    const pageList = ref([
      {
        value: "page1",
        label: "长按经典版",
        url: "https://g.meitegou.com/boxes/ggchb/douyin_iry_yxh20_1231_1.php",
      },
      {
        value: "page2",
        label: "长按蓝色弹窗版本（快手不可用）",
        url: "https://g.meitegou.com/boxes/gcb/template_iry_longclick.php",
      },
      {
        value: "page3",
        label: "点击去微信1",
        url: "https://g.meitegou.com/boxes/gcb/template_iry_jianbian.php",
      },
      {
        value: "page4",
        label: "点击去微信2",
        url: "https://g.meitegou.com/boxes/gcb/template_iry_red_btn.php",
      },
      {
        value: "page5",
        label: "点击去微信3",
        url: "https://g.meitegou.com/boxes/gcb/template_iry_white_btn.php",
      },
      {
        value: "page6",
        label: "袁姗姗版长按（快手选择时会自动变成长按底部去微信上报）",
        url: "https://g.meitegou.com/boxes/ggchb/douyin_iry_wyl20_1208_1.php",
      },
      {
        value: "page7",
        label: "医生问答",
        url: "https://b.meitegou.com/boxes/ggchb/douter_iry_thl20_1202_1.php",
      },
      {
        value: "page8",
        label: "袁姗姗简洁版弹窗（快手选择时会自动变成长按底部去微信上报）",
        url: "https://g.meitegou.com/boxes/ggchb/test_iry_ym20_1116.php",
      },
    ]);
    // 抽屉
    const active = reactive({
      show: false,
      title: "落地页预览",
      url: "",
    });
    // 图片弹窗参数
    const imgQuery = reactive({
      show: false,
      title: "落地页预览",
      url: "",
    });

    // 图片列表
    const imgList = ref([
      {
        value: "images/iry_nj.jpg",
        label: "单品",
        url: "https://g.meitegou.com/boxes/ggchb/images/iry_nj.jpg",
      },
      {
        value: "images/iry_gn.jpg",
        label: "套装",
        url: "https://g.meitegou.com/boxes/ggchb/images/iry_gn.jpg",
      },
      {
        value: "images/iry_dgfyy_xg.png",
        label: "冻干粉",
        url: "https://g.meitegou.com/boxes/ggchb/images/iry_dgfyy_xg.png",
      },
      {
        value: "images/iry_shkymm.jpg",
        label: "小布丁",
        url: "https://g.meitegou.com/boxes/ggchb/images/iry_shkymm.jpg",
      },
      {
        value: "images/iry_dtyy.jpg",
        label: "多肽原液",
        url: "https://g.meitegou.com/boxes/ggchb/images/iry_dtyy.jpg",
      },
      {
        value: "images/iry_yssblue_201111.jpg",
        label: "袁姗姗蓝色",
        url: "https://g.meitegou.com/boxes/ggchb/images/iry_yssblue_201111.jpg",
      },
      {
        value: "images/iry_ysswblue_201111.jpg",
        label: "袁姗姗浅蓝色",
        url: "https://g.meitegou.com/boxes/ggchb/images/iry_ysswblue_201111.jpg",
      },
      {
        value: "images/footer_iry_200112.jpg",
        label: "净痘凝胶",
        url: "https://g.meitegou.com/boxes/ggchb/images/footer_iry_200112.jpg",
      },
    ]);
    // 查看demo按钮
    function getDemo(msg: string) {
      if (!(msg === "page" || msg === "img")) return;
      if (formValue.value[msg]) {
        if (msg === "page") {
          active.show = true;
          let data = pageList.value.filter((item) => {
            return item.value === formValue.value[msg];
          });
          active.url = data[0].url;
          active.title = data[0].label.split("（")[0];
        } else {
          imgQuery.show = true;
          let params = imgList.value.filter((item) => {
            return item.value === formValue.value[msg];
          });
          imgQuery.url = params[0].url;
          imgQuery.title = params[0].label;
        }
      } else {
        // message.warning('...')
        message.error(
          "请选择一个" + (msg === "page" ? "页面" : "图片") + "demo"
        );
      }
    }
    // 备案列表
    const recordOptions = ref([
      {
        label: "广州凡岛网络科技有限公司ICP备案证书号:粤ICP备12025057号",
        key: "fandow",
      },
      {
        label: "广州慕可生物科技有限公司ICP备案证书号:粤ICP备15113972号",
        key: "muke",
      },
      {
        label: "广州欣芝妍化妆品有限公司ICP备案证书号:粤ICP备16044651号",
        key: "xzy",
      },
      {
        label: "广州小希网络科技有限公司ICP备案证书号:粤ICP备17015040号",
        key: "xiaoxi",
      },
      {
        label: "杭州绿点网络科技有限公司ICP备案证书号:浙ICP备16005060号",
        key: "ludian",
      },
      {
        label: "广州橙子网络科技有限公司ICP备案证书号:粤ICP备15051995号",
        key: "origin",
      },
    ]);
    // 备案选择
    function handleSelect(key: string, item: { label: string }) {
      console.log(key);
      console.log(item);
      formValue.value.record = item.label;
    }
    // 提交
    function onSub() {
      // console.log("提交");
      formRef.value.validate((errors: boolean) => {
        if (!errors) {
          // message.success("验证成功");
          message.success('提交成功，正在为您生成落地页，请耐心等待！')
          btnLoading.value = true;
          Api.getPage({
            type: tabName.value,
            page: formValue.value.page,
          })
            .then((res: any) => {
              btnLoading.value = false;
              //判断名字是否为中文决定是否转化
              let name = formValue.value.name;
              if (isChinese(name)) {
                name = pyTran.chineseToPinYin(name);
              }
              // console.log(this.activeName, result.data);
              let page = res.data;
              page = page.replace(/@footimg@/g, formValue.value.img);
              page = page.replace(/@put@/g, formValue.value.record);
              if (tabName.value === "tiktok") {
                page = page.replace(/@top@/g, formValue.value.headCode);
                page = page.replace(/@bottom@/g, formValue.value.footCode);
              } else if (tabName.value === "kuaishou") {
                console.log('快手')
              } else if (tabName.value === "gdt") {
                page = page.replace(/@qq@/g, formValue.value.qq);
                page = page.replace(/@uid@/g, formValue.value.uid);
                page = page.replace(/@udata@/g, formValue.value.udata);
              }

              // 落地页生成
              var a = document.createElement("a");
              var url = window.URL.createObjectURL(
                new Blob([page], {
                  type: "",
                })
              );
              let activeName = tabName.value;
              a.href = url;
              a.download =
                activeName +
                "_iry" +
                "_" +
                name +
                getDate() +
                "_" +
                formValue.value.index +
                ".php";
              a.click();
              console.log(a)
              window.URL.revokeObjectURL(url);
              formValue.value.index++;
            })
            .catch(() => {
              btnLoading.value = false;
            });
        } else {
          console.log(errors);
          message.error("您还有未填写的项目！");
        }
      });
    }
    // tab切换
    function onTab() {
      console.log(tabName.value);
      console.log("重置数据");
      formValue.value = { ...formInitValue };
      formRef.value.restoreValidation();
    }
    // 监听变化重置数据
    watch(tabName, () => {
      if (tabName.value) {
        onTab();
      }
    });
    /* 
    主要是一些方法
    */
    //拿到时间得出链接命名年份日期部分
    function getDate() {
      let date = new Date();
      let year = String(date.getFullYear());
      year = year.substring(year.length - 2);
      let month = PrefixInteger(String(date.getMonth() + 1));
      let day = PrefixInteger(String(date.getDate()));
      return year + "_" + month + day;
    }
    function PrefixInteger(str: string) {
      let lengths = str.length;
      if (lengths < 2) {
        return "0" + str;
      } else {
        return str;
      }
    }
    //判断是否为中文

    function isChinese(temp: string) {
      var re = /[^\u4E00-\u9FA5]/;
      if (re.test(temp)) return false;
      return true;
    }
    return {
      btnLoading,
      onTab,
      formRef,
      tabName,
      formValue,
      rules,
      pageList,
      getDemo,
      active,
      imgList,
      imgQuery,
      recordOptions,
      handleSelect,
      onSub,
    };
  },
  components: {
    Close,
  },
});
</script>

<style lang="less" scoped>
@deep:~ '>>>';
.landingPage {
  max-width: 1000px;
  margin: 0 auto;
  overflow: hidden;
  // text-align:center
}
:deep(.draw_title) {
  color: rgb(0, 128, 0);
  padding-bottom: 1rem;
  font-size: 1.5rem;
}
.content {
  display: inline-block;
  // width: auto;
  text-align: left;
  margin: 0 auto;
}
:deep(.foot_img) {
  width: 100%;
}
a {
  text-indent: none;
}
:deep(.hove) {
  cursor: pointer;
}
.footer {
  text-align: center;
}
</style>