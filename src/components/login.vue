<template>
  <div class="login">
    <div class="header">
      <h1>
        <span :class="isLogin?'showHigh':''"
              @click="changeLogin">登录</span>
        <span :class="!isLogin?'showHigh':''"
              @click="changeRegister">注册</span>
      </h1>
      <el-button class="close"
                 type="text"
                 icon="el-icon-close"></el-button>
    </div>
    <div class="body">
      <el-form :model="form"
               status-icon
               :rules="rules"
               ref="form"
               class="form">
        <el-form-item prop="user">
          <el-input placeholder="请输入用户名"
                    v-model="form.user"
                    maxlength=15>
          </el-input>
        </el-form-item>
        <el-form-item prop="passwd">
          <el-input placeholder="请输入密码"
                    v-model="form.passwd"
                    type="password"
                    maxlength=18>
          </el-input>
        </el-form-item>
        <el-form-item prop="passwdAgain"
                      v-show="!isLogin">
          <el-input placeholder="请确认密码"
                    v-model="form.passwdAgain"
                    type="password"
                    maxlength=18>
          </el-input>
        </el-form-item>
        <!-- 验证码 -->
        <el-form-item v-show="!isLogin"
                      prop="captcha">
          <el-input placeholder="填写验证码"
                    v-model="form.captcha"
                    maxlength="4">
            <div class="captcha"
                 slot="suffix">
              <i class="el-icon-refresh"
                 @click="getCaptcha"></i>
              <span v-html="svgCaptcha"></span>
            </div>
          </el-input>
        </el-form-item>
        <el-form-item v-show="showEmail"
                      prop="email">
          <el-input placeholder="填写邮箱"
                    v-model="form.email"
                    maxlength="20">
          </el-input>
        </el-form-item>
        <!-- 重置找回密码 -->
        <el-form-item v-show="isLogin">
          <div class="form-control">
            <div class="form-control-left">
              <el-switch v-model="autoLogin"
                         active-color="#13ce66"
                         inactive-color="#eee">
              </el-switch>
              <span class="form-control-left-tip">七天自动登录</span>
            </div>
            <div class="form-control-right">
              <span class="high"
                    @click="reset">重置</span>
              <span> | </span>
              <span class="high">找回密码</span>
            </div>
          </div>
        </el-form-item>
        <el-form-item v-show="!isLogin">
          <div class="form-control">
            <div class="form-control-left">
              <el-switch v-model="showEmail"
                         active-color="#13ce66"
                         inactive-color="#eee">
              </el-switch>
              <span class="form-control-left-tip">绑定邮箱</span>
            </div>
            <div class="form-control-right">
              <span class="high"
                    @click="reset">重置</span>
              <span> | </span>
              <span class="high">找回密码</span>
            </div>
          </div>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item v-show="isLogin">
          <el-button class="login-btn"
                     type="success"
                     round>登录</el-button>
        </el-form-item>
        <el-form-item v-show="!isLogin">
          <el-button class="register-btn"
                     type="success"
                     round>注册</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Model, Component } from "vue-property-decorator";
import { Input, Button, Form, FormItem, Switch } from "element-ui";
import axios from "axios";
import config from "@/config/index.ts";

Vue.use(Input);
Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Switch);

@Component({
  data() {
    var validateUser = (rule: any, value: string, callback: any) => {
      if (!value.length) {
        callback(new Error("请输入用户名"));
      } else if (value.length <= 4) {
        callback(new Error("用户名长度小于四，重新输入"));
      } else {
        callback();
      }
    };
    var validatePasswd = (rule: any, value: string, callback: any) => {
      if (!value.length) {
        callback(new Error("请输入密码"));
      } else if (value.length <= 4) {
        callback(new Error("密码长度小于四，重新输入"));
      } else if (this.$data.form.passwdAgain.length) {
        (this.$refs.form as any).validateField("passwdAgain");
      } else {
        callback();
      }
    };
    var validatePasswdAgain = (rule: any, value: string, callback: any) => {
      if (!value.length) {
        callback(new Error("请输入密码"));
      } else if (value !== this.$data.form.passwd) {
        callback(new Error("两次密码不一致"));
      } else {
        callback();
      }
    };
    var validateCaptcha = (rule: any, value: string, callback: any) => {
      if (!value.length) {
        callback(new Error("需要填写验证码"));
      } else if (value.length !== 4) {
        callback(new Error("验证码错误"));
      } else {
        callback();
      }
    };
    return {
      // 表单校验
      rules: {
        user: [{ validator: validateUser, trigger: "blur" }],
        passwd: [{ validator: validatePasswd, trigger: "blur" }],
        passwdAgain: [{ validator: validatePasswdAgain, trigger: "blur" }],
        captcha: [{ validator: validateCaptcha, trigger: "blur" }]
      }
    };
  },
  created() {
    (this as Login).getCaptcha();
  }
})
export default class Login extends Vue {
  // 切换登录、注册
  private isLogin: boolean = true;
  // 七天自动登录
  private autoLogin: boolean = false;
  // 表单信息
  private form = {
    user: "",
    passwd: "",
    passwdAgain: "",
    captcha: "",
    email: ""
  };
  // svg验证码
  private svgCaptcha = "";
  // 是否绑定邮箱
  private showEmail = false;
  /**
   * 切换登录、注册
   */
  changeRegister() {
    this.reset();
    this.isLogin = false;
  }
  changeLogin() {
    this.reset();
    this.isLogin = true;
  }
  /**
   * 获取验证码
   */
  getCaptcha() {
    axios.get(`${config.host}getcaptcha`).then(res => {
      if (res.status == 200 && res.data.code == 200) {
        this.svgCaptcha = res.data.data;
      }
    });
  }
  /**
   * 重置表单信息
   */
  reset() {
    (this.$refs.form as any).resetFields();
  }
}
</script>

<style lang="stylus">
@import '~@/config/color'
.login
  width 384px
  padding-top 10px
  padding-bottom 20px
  box-shadow 0 12px 24px 0 rgba(28, 31, 33, 0.1)
  border-radius 12px
  background-color $theme
  color $color
  .header
    position relative
    padding 0 20px 25px
    h1
      font-size 16px
      line-height 49px
      font-weight 700
      height 49px
      span
        float left
        width 80px
        text-align center
        height 49px
        line-height 49px
        cursor pointer
      span:hover
        color red
      span:hover:after
        content ' '
        width 16px
        height 4px
        line-height 4px
        background #f20d0d
        border-radius 2px
        display block
        margin 0 auto
      .showHigh
        color red
      .showHigh:after
        content ' '
        width 16px
        height 4px
        line-height 4px
        background #f20d0d
        border-radius 2px
        display block
        margin 0 auto
    .close
      padding 0
      margin 0
      position absolute
      top 17px
      right 20px
      font-size 21px
      color $color
      transition all 0.2s
    .close:hover
      color #f20d0d
      transform scale(1.5)
  .body
    padding 0 32px
    .el-input__inner
      box-shadow 0 12px 24px 0 rgba(28, 31, 33, 0.1)
      border-radius 8px 8px 0 8px
      letter-spacing 3px
      font-family 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif
    .el-form-item__error
      letter-spacing 3px
      padding-left 3px
    .form-control
      display flex
      flex-direction row
      justify-content space-between
      font-size 14px
      .form-control-left
        display flex
        flex-direction row
        align-items center
        .form-control-left-tip
          margin-left 5px
      .form-control-right
        display flex
        flex-direction row
        align-items center
        .high
          cursor pointer
          margin 0 5px
        .high:hover
          color #f20d0d
    .login-btn
      width 100%
      background-color #13ce66
      border-color #13ce77
      transition transform 0.3s
    .login-btn:hover
      transform translate3d(2px, 2px, 0)
    .register-btn
      width 100%
      background-color #f20d0d
      border-color #f20d0d
      transition transform 0.3s
    .register-btn:hover
      transform translate3d(2px, 2px, 0)
    .captcha
      position absolute
      right 0
      top 0
      width 130px
      height 100%
      display flex
      flex-direction row
      justify-content flex-end
      align-items center
      margin-right 20px
      i
        font-size 18px
        font-weight 700
        margin-right 5px
        cursor pointer
        transition transform 0.3s
      i:hover
        transform rotate(360deg)
      span
        width 100px
        height 35px
        margin-bottom 5px
</style>