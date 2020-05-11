# <span style="color:#008c8c">web开发日志</span>

## <span style="color:#c93756">2020/05/04</span> 

- #### 完成歌单详情页
- #### 左侧歌单图片描述
- #### 中部歌单歌曲列表
- #### 右侧歌单评论列表

## <span style="color:#c93756">2020/05/03</span> 

- #### 完成音乐歌单列表栏
- #### 根据窗口宽度生成相应的不同歌单数量
- #### 实现一些动画效果，优化体验
  - #### 鼠标移入放大，移除还原
  - #### 获取新的歌单数据，加入位移动画

## <span style="color:#c93756">2020/05/02</span> 

- #### 完成首页顶部图片，以及布局


## <span style="color:#c93756">2020/04/30</span> 

- #### 完成侧边菜单栏组件
- #### 鼠标划上去可以展开，移出可以收缩

## <span style="color:#c93756">2020/04/30</span> 

- #### 完成邮箱发送验证码功能
- #### 借助了nodemailer，很轻松完成邮件服务
- #### 完成发送邮件的样式，还是很不错的

    <div style="border: 10px solid #333;color: #676767;background-color: #333;width: 
    600px; margin: 0 auto; padding-bottom: 45px;position: relative; 
    ">
      <div style="height: 60px; background: #393d49; line-height:
    60px; color: #58a36f; font-size: 18px;padding:0 10px;display: flex;flex-direction: row;
    justify-content: space-between;">
        <span>wiselee社区 👻</span>
        <span>-----➢</span>
        <span>${sendInfo.user} 👻</span>
      </div>
      <div style="padding: 25px;background-color: #d3f1f1;border-radius: 30px 30px 0 30px;">
        <div>你好，${sendInfo.user}同学，重置链接的有效时间为30分钟，请在${sendInfo.expire}之前重置你的密码</div>
        <a href="${url}" style="padding: 10px 20px; color: #fff; 
    background: #009e94; display: inline-block;margin: 15px 0;">立即重置密码</a>
        <div style="padding: 5px;">如果本邮件不是本人操作，请切勿激活！否则你的邮箱会被他人绑定！！</div>
      </div>
      <div style=" background: #393d49; color: #58a36f;text-align: center; line-height: 45px; height: 45px; position:
          absolute; left: 0; bottom: 0;width: 100%;">系统邮件，切勿恢复</div>
    </div>

## <span style="color:#c93756">2020/04/30</span>  

- #### 完成登录、注册功能
- #### 借助element-ui，很轻松的完成样式、校验
- #### 我想还需要一个找回密码的功能，这样会好很多

## <span style="color:#c93756">2020/04/29</span>

- #### 起始，我的想法是做一个音乐、电影、小说之类的综合一体类的个人网站，把自己所学的东西一并融合在里面，像tensorFlow.js做一些语音控制、canvas实现一些令人惊叹的动画效果、数据统计做一些个性化推荐等等，当然这些要慢慢来。
- #### 技术上采用 vue + typescript + node这种技术栈快速开发出我想要的效果
- #### 这个网站我会比较细致的去搭建，提升体验效果，同时也将融入自己的一些设计、思考在里面，我希望能够令人愉快的体验
- #### 今天完成了大致的环境搭建，vue-cli3 + koa
