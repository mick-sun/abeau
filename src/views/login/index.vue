<template>
  <div class="login">
    <el-form class="login-form" label-position="top" ref="form" :model="form" :rules="rules">
      <div class="login-title">登陆</div>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="login-btn" :loading="loading" type="primary" @click="onSubmit">登陆</el-button>
      </el-form-item>
    </el-form>
  </div>

</template>

<script lang="ts">
import Vue from 'vue'
import { Form } from 'element-ui'
import { login } from '@/services/user'

export default Vue.extend({
  name: 'LoginIndex',
  data () {
    return {
      form: {
        phone: '15510792995',
        password: '111111'
      },
      loading: false,
      rules: {
        phone: [
          {
            required: true,
            message: '请输入手机号码',
            trigger: 'blur'
          },
          {
            pattern: /^1\d{10}$/,
            message: '请输入正确的手机号',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 18,
            message: '密码长度为6-18个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    async onSubmit () {
      this.loading = true
      try {
        await (
          this.$refs.form as Form
        ).validate()

        const { data } = await login(this.form)
        if (data.state !== 1) {
          this.$message.error(data.message)
        } else {
          this.$store.commit('setUser', data.content)
          this.$router.push(this.$route.query.redirect as string || '/')
          this.$message.success('登陆成功')
        }
      } catch (e) {
        console.log(e)
      }

      this.loading = false
    }
  }
})
</script>

<style lang="scss" scoped>
.login {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  .login-form {
    background: #fff;
    padding: 30px;
    border-radius: 6px;
    width: 320px;
  }

  .login-btn {
    width: 100%;
  }

  .login-title {
    font-size: 24px;
    margin-bottom: 20px;
  }
}
</style>
