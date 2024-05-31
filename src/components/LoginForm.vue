<template>
  <el-form
      ref="form"
      method="post"
      :model="form"
      :rules="rules"
      style="position: relative">
    <el-form-item label="学号" prop="username">
      <el-input
          v-model="form.username"
          type="text"
          placeholder="请输入学号"
          autocomplete="on"/>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input
          v-model="form.password"
          type="password"
          placeholder="请输入密码"
          autocomplete="on"/>
    </el-form-item>
    <el-button
        :class="load"
        type="primary"
        :loading="loading"
        @click="login(form)"
        style="box-shadow: var(--el-box-shadow-light);">登录
    </el-button>
    <el-form-item label="" prop="">
      <a-radio v-model:checked="checked" style="font-size: 10px;margin: 0 auto" @click="this.checked=!this.checked">
        我已知悉并同意
        <a @click="showModal" style="color:#0c63e4;text-decoration:underline !important ">《用户许可协议》</a>
        中的全部条款
      </a-radio>
    </el-form-item>

    <div style="margin-top: 10vh;text-align: center">
      <div style="font-size: 12px;line-height: 12px;height: 12px;text-align: center;"><span>version 5.1</span>
      </div>
      <div style="margin-top:10px;font-size: 12px;text-align: center;line-height: 12px;height: 12px"><a
          href="https://qm.qq.com/cgi-bin/qm/qr?k=cUShH33TC_MqqI8cYutgP3rwvm0nFwHQ&authKey=gAvVbn6CUjJ11cNwccOCV4i0QbGr4ilXsEoH6s6gJQcm4qBWoNjihHHMgjhoxiZ/&noverify=0&personal_qrcode_source=0">技术支持
        QQ群:759715594</a></div>
      <!--      <div style="margin-top:30px;font-size: 16px;text-align: center;line-height: 12px;height: 12px"><a-->
      <!--        href="https://qm.qq.com/cgi-bin/qm/qr?k=cUShH33TC_MqqI8cYutgP3rwvm0nFwHQ&authKey=gAvVbn6CUjJ11cNwccOCV4i0QbGr4ilXsEoH6s6gJQcm4qBWoNjihHHMgjhoxiZ/&noverify=0&personal_qrcode_source=0">技术支持-->
      <!--        QQ群:759715594</a></div>-->
    </div>
  </el-form>
  <a-modal v-model:visible="visible" title="用户许可协议" @ok="handleOk" @cancel="handleCancel"
           :closable="false"
           :maskClosable="false"
           ok-text="同意"
           cancel-text="不同意">
    <el-scrollbar max-height="90vw">
      <div style="text-indent:2em;">
        <p>
          本软件为作者西北工业大学李宇洋（即“软件权利人”）是以方便学生查询成绩为目的开发的非营利性软件，您在使用该软件之前必须仔细阅读《用户许可协议》，并保证您已经知悉和同意协议各项条款。</p>
        <p>本《用户许可协议》（以下简称“本协议”）是您与瓜大学分积（以下简称“iNWPU”）签订的关于本软件的用户使用许可协议。
          iNWPU在此特别提⽰您仔细阅读本协议中各条款，包括但不限于用户使用须知、法律责任与免责等。您的安装、使用⾏为将视为接受本协议。⼀旦安装或以任何⽅式使用本软件，即表⽰您已同意接受本协议的约束。如果您不同意本协议的条款，则不能获得安装、使用本软件的权利。</p>
        <p>本协议是您与iNWPU就您下载、安装、使用本软件所订⽴的协议。本协议约定与您关于本软件使用许可⽅⾯的权利义务。</p>
        <p>1、知识产权声明</p>
        <p>
          本软件由iNWPU开发或者由iNWPU获得软件权利人（以下简称“许可人”）许可。本软件的知识产权以及与本软件相关的所有信息内容，包括但不限于：⽂字表述及其组合、图标、图饰、图表、⾊彩、界⾯设计、版⾯框架、有关数据、印刷材料、电⼦⽂档等，均受著作权法和国际著作权条约以及其他知识产权法律、法规的保护，其知识产权均归iNWPU及其许可人所有。
        </p>
        <p>2、软件的许可</p>
        <p>
          （1）本协议未明示授权的其他一切权利均归iNWPU所有，如果您需要使本协议未授予的任何其他权利，须另行取得iNWPU的书面同意。</p>
        <p>
          （2）iNWPU许可您在⼿机上下载、安装、运⾏本软件。该许可是有限的、不可转让的、不可分许可的、可撤销的、⾮独占的、⾮排他的。</p>

        <p>3、使用限制</p>
        <p>
          您在遵守国家法律、法规、政策及本协议的前提下，可依本协议使用本软件。您⽆权也不得实施包括但不限于下列⾏为：</p>
        <p>本协议是您与iNWPU就您下载、安装、使用本软件所订⽴的协议。本协议约定与您关于本软件使用许可⽅⾯的权利义务。</p>
        <p>（1）删除本软件中的任何版权申明或提⽰以及任何其他信息、内容。</p>
        <p>（2）对本软件进⾏反向⼯程、反向汇编、反向编译等。</p>
        <p>（3）在本协议规定的条款之外，使用、复制、修改、租赁或转让本软件或其中的任⼀部份。</p>
        <p>（4）向第三人提供本软件，许可他人使用本软件或将本软件用于iNWPU禁止的⽬的（如商业⽬的等）。</p>
        <p>
          （5）对本软件的图像、⽂字等相关信息，擅⾃实施包括但不限于下列⾏为：使用、复制、修改、链接、转载、汇编、发表、出版、建⽴镜像站点、擅⾃借助本软件发展与之有关的衍生产品、作品及服务等。</p>
        <p>（6）利用本软件储存、发表、传播违反国家法律、法规以及国家政策规定的内容。</p>
        <p>（7）利用本软件储存、发表、传播侵害他人知识产权、商业秘密等合法权利的内容。</p>
        <p>（8）进⾏危害计算机⽹络安全的⾏为。</p>

        <p>4、服务的中止与终止</p>
        <p>
          （1）如果您存在发布违法信息、严重违背社会公德、以及其他违反法律禁止性规定的⾏为，iNWPU有权⽴即终止对您提供服务。</p>
        <p>（2）iNWPU根据本条约定中止或终止对您提供部分或全部服务的，将承担相应举证责任。</p>
        <p>
          （3）如果您存在访问异常状态，包括但不限于恶意访问、提交错误数据等行为，iNWPU将根据本条约定中止或终止对您提供部分或全部服务的。</p>
        <p>5、版本升级</p>
        <p>
          本软件将来是否提供升级版本将由iNWPU决定。如果本软件经iNWPU同意升级，除⾮升级版本有替代的软件许可协议，否则升级版本仍适用本协议。如果该软件标明为升级版本，您必须遵守本协议。</p>
        <p>6、法律责任</p>
        <p>（1）您同意，使用本软件的风险由您⾃⾏承担。</p>
        <p>
          （2）您认可，本软件可能受到各种安全问题的侵扰，如他人利用您的资料，造成现实生活中的骚扰。下载安装的软件中含有“特洛伊⽊马”等病毒，威胁到您的信息和数据的安全，继⽽影响本软件的正常使用等等。您应加强信息安全及信息资源的保护意识，要注意加强密码保护，以免遭致损失和骚扰。</p>
        <p>
          （3）本软件按“原样”授予许可。iNWPU及其许可人就本软件不提供任何明⽰的或默⽰的担保和保证，包括不对本软件的适销性、特定用途做任何明⽰或默⽰的保证，iNWPU及其许可人不就不侵犯第三⽅权利作任何保证。</p>
        <p>
          （4）在适用法律所允许的最⼤范围内，iNWPU及其许可人绝不就因使用或不能使用本软件所引起的或有关的任何直接的、间接的、意外的、特殊的、惩罚性的或其它任何损害（包括但不限于因人⾝伤害或财产损坏⽽造成的损害赔偿，因利润损失、营业中断、商业信息的遗失⽽造成的损害赔偿，因未能履⾏包括诚信或相当注意在内的任何责任致使隐私泄露⽽造成的损害赔偿，因疏忽⽽造成的损害赔偿，或因任何⾦钱上的损失或任何其它损失⽽造成的损害赔偿）承担赔偿责任，即使iNWPU及其许可人事先被告知该损害发生的可能性。iNWPU及其许可人承担的所有责任以您购买本软件所⽀付的价款为限。本条款在任何情况下都将有效。</p>
        <p>
          （5）⾮经iNWPU及其许可人授权的其它任何由本软件衍生的软件，均属⾮法。下载、安装、使用此类软件，将可能导致不可预知的风险，建议您不要轻易下载、安装、使用，由此产生的⼀切损失、损害以及法律责任与纠纷将由您承担责任，与iNWPU⽆关。</p>
        <p>（6）对于您违法或违反本协议⽽引起的⼀切责任，由您负全部责任，若导致iNWPU损失的，iNWPU有权要求您全额赔偿。</p>
        <p>7、权利终止</p>
        <p>
          iNWPU或其许可人有权随时中止或终止本协议。本协议终止后，您必须⽴即停止使用本软件，删除已经复制、安装的所有软件及相关资料。</p>
        <p>8、⽹络安全与隐私保护</p>
        <p>
          基于保护用户个人信息的基本原则，iNWPU将会采取合理的措施保护您的个人信息。除法律法规规定的情形外，未经您的许可iNWPU不会向第三⽅公开、透露用户个人信息。iNWPU对相关信息采用专业加密存储与传输⽅式，保障用户个人信息的安全。</p>
        <p>
          iNWPU将运用各种安全技术和程序建⽴完善的管理制度来保护您的个人信息，以免遭受未经授权的访问、使用或披露。iNWPU保证只使用下述存储空间及隐私权限：</p>
        <p>
          （1）iNWPU将只使用root/Android/data/com.example.inwpu中的存储文件及数据，拥有且只拥有对该目录的完全读写权限；</p>
        <p>（2）iNWPU使用的网络权限包括：查看设备网络状态、创建网络套接字、以加密的方式发送您的信息以查询数据；</p>
        <p>（3）iNWPU建议您使用西北工业大学校园网进行</p>
        <p>（4）iNWPU不会在任何存储介质上存储您通过iNWPU发送接收的个人信息；</p>
        <p>（5）iNWPU不会向任何其它非支持软件运行的设备发送与保存您的个人信息。</p>
        <p>未经您的同意，iNWPU不会向iNWPU以外的任何公司、组织和个人披露您的个人信息，但下列情况除外：</p>
        <p>（1）您或您的监护人授权iNWPU披露的；</p>
        <p>（2）有关法律要求iNWPU披露的；</p>
        <p>（3）司法机关或⾏政机关基于法定程序要求iNWPU提供的；</p>
        <p>（4）iNWPU为了维护⾃⼰合法权益⽽向⼄⽅提起诉讼或者仲裁时；</p>
        <p>（5）应您的监护人的合法要求⽽提供您的个人⾝份信息时。</p>
        <p>9、其他条款</p>
        <p>（1）本协议任何条款的部分或全部⽆效，不影响其它条款的效⼒。</p>
        <p>
          （2）本协议的解释、效⼒及纠纷的解决，适用于中华人民共和国法律。因本协议发生任何纠纷或争议，⾸先应友好协商解决，协商不成的，您在此完全同意将纠纷或争议提交上海仲裁委员会仲裁裁决，仲裁裁决是终局的，对双⽅具有约束⼒。仲裁的所有费用将由仲裁败诉⽅承担。</p>
        <p>（3）有关本软件的问题，您可发邮件给iNWPU咨询。邮件地址：<a>2327706652@qq.com</a>。
        </p>
      </div>
    </el-scrollbar>
  </a-modal>
  <a-modal
      :title="'输入发送至 '+this.securePhone+' 的验证码'"
      :visible="this.showCode"
      width="100%"
      @ok="this.verify"
      @cancel="this.showCode=false"
      okText="确定"
      cancelText="取消"
      destroyOnClose
      :closable="false"
      :maskClosable="false"
      :confirmLoading="this.code.load"
  >
    <el-form
        ref="code"
        method="post"
        :model="code"
        :rules="codeRule"
        style="position: relative">
      <el-form-item label="验证码" prop="code">
        <el-input
            v-model="code.code"
            type=""
            placeholder="请输入验证码"
            autocomplete="on"/>
      </el-form-item>
    </el-form>
  </a-modal>
</template>

<script>
import api from "../api/index";
import encrypt from "../utils/crypt"

export default {
  name: "LoginForm",
  data() {
    return {
      labelCol: {span: 4, offset: 4},
      wrapperCol: {span: 2},
      visible: false,
      checked: true,
      publicKey: "",
      form: {
        username: "",
        password: ""
      },
      rules: {
        username: [{
          required: true,
          validator: validatorAccountNumber,
          trigger: ['blur'],
        }],
        password: [{
          required: true,
          message: "请输入密码",
          trigger: ['blur'],
        }]
      },
      codeRule: {
        code: [{
          required: true,
          pattern: /^\d{4}$/,
          message: "验证码位数不正确",
          trigger: ['blur', 'change']
        }],
      },
      load: "no_load",
      loading: false,
      code: {
        code: "",
        load: false,
      },
      securePhone: "",
      showCode: false,
    }

  },
  created() {

    let key = localStorage.getItem("key");
    if (key !== null) {
      key = JSON.parse(key);
      this.form.username = key.username;
      this.form.password = key.password;
    }
  },
  methods: {
    verify() {
      this.$refs["code"].validate((valid) => {
        if (valid) {
          this.$message.info("请求中，请等待");
          this.code.load = true;
          api.verify({
            code: this.code.code,
          }).then((response) => {
            if (response.data.success) {
              this.$message.success(response.data.message);
              localStorage.setItem("gpa", JSON.stringify(response.data.data));
              localStorage.setItem("key", JSON.stringify({
                username: this.form.username,
                password: this.form.password
              }));
              this.code.load = false;
              this.showCode = false;
              this.$router.push("/main");
            } else {
              this.$message.error(response.data.message);
              this.code.load = false;
              this.showCode = false;
            }
          }).catch((error) => {
            this.$message.error(error.toString());
            this.code.load = false;
            this.showCode = false;
          })
        }
      })
    },
    login() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.checked) {
            this.changeButtonState();
            this.$message.info("请求中，请等待");
            if (this.form.password.indexOf("__RSA__") !== 0) {
              this.form.password = "__RSA__" + encrypt.encrypt(this.form.password)
            }
            api.loginMFA({
              username: this.form.username,
              password: this.form.password,
            }).then((response) => {
              if (response.data.success) {
                this.$message.success(response.data.message);
                localStorage.setItem("key", JSON.stringify({
                  username: this.form.username,
                  password: this.form.password
                }));
                if (response.data.code === 1001) {
                  localStorage.setItem("admin", JSON.stringify({admin: true}));
                  localStorage.setItem("users", JSON.stringify(response.data.data))
                  this.$router.push("/admin");
                } else {
                  localStorage.setItem("gpa", JSON.stringify(response.data.data));
                  this.$router.push("/main");
                }
              } else {
                if (response.data.code === 304) {
                  this.$message.warning(response.data.message);
                  this.securePhone = response.data.data.securePhone;
                  this.showCode = true;
                  this.changeButtonState();
                } else {
                  this.$message.error(response.data.message);
                  this.changeButtonState();
                }
              }
            }).catch((error) => {
              this.$message.error(error.toString());
              this.changeButtonState();
            })
          } else {
            this.$message.error("请先勾选同意用户许可协议");
          }
        } else {
          this.$message.error("请检查输入");
        }
      })
    },
    getScore() {

    },
    changeButtonState() {
      if (this.loading) {
        this.loading = false;
        this.load = "no_load";
      } else {
        this.loading = true;
        this.load = "loading";
      }
    },
    showModal() {
      this.visible = true;
    },
    handleOk() {
      this.visible = false;
      this.checked = true;
    },
    handleCancel() {
      this.visible = false;
      this.checked = false;
    },
  }
}
// 判断学号是否正确
const validatorAccountNumber = (rule, value, callback) => {
  if (!value) {
    return callback(new Error("请输入学号信息"));
  } else {
    let isId = /^\d{10}$/.test(value);
    if (isId) {
      callback();
    } else {
      return callback(new Error('学号格式不正确'));
    }
  }
}
</script>

<style scoped>
.no_load {
  margin-left: 50%;
  margin-top: 30px;
  align-content: center;
  position: absolute;
  left: -30px;
}

.loading {
  margin-left: 50%;
  margin-top: 30px;
  align-content: center;
  position: absolute;
  left: -40px;
}


</style>