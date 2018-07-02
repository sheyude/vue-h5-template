<template>
    <div class="main">
        <h1>\{{ msg }}</h1>
        <van-button type="primary">哈喽 你好！</van-button>
    </div>
</template>

<script>
import Vue from 'vue'
import { Button } from 'vant';
Vue.use(Button);
export default {
    data() {
        return {
            msg: "{{ author }}"
        }
    }
}
</script>

<style lang="less" scoped>
.main{
    text-align: center;
    h1{
        font-size: 16px;
    }
}
</style>


