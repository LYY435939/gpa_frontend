<template>
  <a-page-header
      style="border: 1px solid rgb(235, 237, 240)"
      title="用户列表"
      :sub-title="'共有 '+this.users[selSem-1].length+' 个学生'"
      @back="back"
  >
    <template #extra>
      <a-button type="default" shape="circle" size="small" style="cursor: pointer" @click="updateAll">
        <template #icon>
          <SyncOutlined/>
        </template>
      </a-button>
    </template>
    <a-layout-content>
      <div style="align-content: center">
        <el-scrollbar max-height="80vh" style="padding-top: 10px">
          <a-list item-layout="horizontal" size="large"
                  :data-source="this.users[selSem-1]">
            <template #renderItem="{ item }">
              <a-list-item style="padding: 8px 12px;cursor: pointer;" @click="this.getUserInfo(item)">
                <template #actions>
                  <RightOutlined/>
                </template>
                <a-list-item-meta>
                  <template #title>
                    {{ item }}
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </template>
          </a-list>
        </el-scrollbar>
      </div>
    </a-layout-content>
  </a-page-header>
  <a-pagination style="position:absolute;bottom:2vh;right:2vw;padding-top: 10px;max-width: 90vw"
                size="small" :pageSize="1"
                v-model:current="this.selSem"
                :total="this.users.length"
                :show-total="total => `共 ${total} 个学号段`"/>
</template>

<script>

import {defineComponent, ref} from "vue";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  MinusOutlined,
  QuestionOutlined,
  SyncOutlined,
  RightOutlined
} from "@ant-design/icons-vue";
import api from "../api/index";

export default defineComponent({
  components: {
    ArrowUpOutlined,
    ArrowDownOutlined,
    QuestionOutlined,
    MinusOutlined,
    SyncOutlined,
    RightOutlined
  },
  created() {
    this.getUserList();
  },
  data() {
    return {
      users: [['']],
      selSem: ref(1),
      maxLen: 1,
    }
  },
  methods: {
    getUserList() {
      let users = localStorage.getItem("users");
      if (users === null) {
        localStorage.clear();
        this.$router.push("/main");
      } else {
        this.users = JSON.parse(users).users;
      }
    },
    back() {
      localStorage.removeItem("admin");
      this.$router.go(-1);
    },
    getUserInfo(username) {
      this.$message.info("请求中，请等待")
      api.getUserScore({username: username}).then((response) => {
        if (response.data.success) {
          this.$message.success(response.data.message);
          localStorage.setItem(username, JSON.stringify(response.data.data));
          this.$router.push("/userinfo/" + username);
        } else {
          this.$message.error(response.data.message);
        }
      }).catch((error) => {
        this.$message.error(error.toString());
      })
    },
    updateAll() {
      let k = localStorage.getItem("key");
      if (k === null) {
        this.$message.error("缓存过期，请重新登录");
        this.back();
      }
      k = JSON.parse(k);
      api.loginMFA({
        username: k.username,
        password: k.password,
      }).then((response) => {
        if (response.data.success) {
          this.$message.success(response.data.message);
          localStorage.setItem("key", JSON.stringify({
            username: k.username,
            password: k.password
          }));
          if (response.data.code === 1001) {
            localStorage.setItem("admin", JSON.stringify({admin: true}));
            localStorage.setItem("users", JSON.stringify(response.data.data))
            this.getUserList();
          } else {
            this.$message.error("没有权限")
            this.back();
          }
        } else {
          this.$message.error(response.data.message);
          this.changeButtonState();
        }
      }).catch((error) => {
        this.$message.error(error.toString());
        this.changeButtonState();
      })
    },
  }
})
</script>


<style scoped>

</style>