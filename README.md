惠龙油气(原互惠互利加油站)Vue

### 打包发布测试环境 命令执行不需要密码 因为是以root用户为密钥  默认是root
```
./deploy t  
```
### 打包发布业务测试环境 命令执行不需要密码 因为是以root用户为密钥  默认是root
```
./deploy y  
```

 ### 打包发布生产环境  命令执行需要密码share 因为是以share用户为密钥,root密钥没用.
 ```
./deploy pz  
```

### 因为在main.js引入了hlet模块
```
import hlet from 'hlet'
Vue.use(hlet);
```
### 是通过index.html的script标签引入的
```
<script src="https://test.hletong.com/static/js/hletong-ui.common.js"></script>
```

### 很多公用的组件和写死的逻辑全放在common.js里,开发环境几乎不可用,因此至少将main.js,index.html已标记的两处,main.js里屏蔽,开发环境才可用
```
<template>
	<!-- <HletongLayout v-on:loginOut="loginOut"> -->
		<router-view></router-view>
	<!-- </HletongLayout> -->
</template>
```

### 另外注意页签组件HletongBreadcrumb,表格组件HletongTable本地开发时还是先用组件库heltable的,不要也是无法显示的
```
<HletongBreadcrumb :data="breadTitle"></HletongBreadcrumb>
<HletongTable></HletongTable>
```

### 总之对开发环境太不友好,我写的各个模块以后都要人肉式的修改,真恶心