<script>
import swal from 'sweetalert';
export default {
	data() {
		return {
			username: '',  //用户名
			password: '',  //密码
			idCard: '',  //身份证
			realname: '',  //真实姓名
			newpassword: '',  //新密码
			newpassword2: '',  //新密码2
			code: '',  //输入的验证码
			savepassword: '保存密码',  //保存密码
			generatedCode: '',  //要求的验证码
			showLogin: true,  //是否显示登录界面
			showFind: false,  //验证界面
			showChange: false,  //修改界面
		}
	},
	mounted() {
		this.generateCode(); //获取验证码
		this.getPassword();  //获取保存的密码
	},
	methods: {
		Swal(theTitle, theText, theInfo) { //把swal的"OK"改成“好的”
			swal({
				title: theTitle,
				text: theText,
				icon: theInfo,
				button: "好的"
			});
		},
		async login() {  //登录方法，服务器端验证放在xlogin中
			if (this.username == "" || this.password == "") {
				this.Swal('错误', '请输入用户名和密码!', 'error');
				return;
			}
			if (this.checkCode() == false) return;
			else {
				//result是验证结果
				const result = await this.xlogin();
				if (result) {
					if (this.password == "123456") {
						this.Swal('注意', '请修改密码!', 'info');
						this.switchShow('showChange');
						return;
					}
					this.Swal("成功", "您已成功登录", "success");
					window.location.href="#dashboard";
				}
			}

		},
		async xlogin() {  //调用接口进行用户名和密码验证
			const response =
				// await fetch('https://www.fastmock.site/mock/190b43d54318fbf3326b993eb7ca66d0/login/api/login', {
				await fetch('http://6b1614f5.r3.cpolar.top/login', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						userName: this.username,
						passWord: this.password
					})
				})
			const data = await response.json();
			if (data.code == 1) {
				return true;
			} else {
				console.log(data);
				this.Swal("失败", data.code + ":" + data.message, 'error');
				return false;
			}
		},
		// isValidUsername() {
		// 	const pattern = /^[a-zA-Z0-9_]+$/;
		// 	return pattern.test(this.username);
		// },
		isValidIDNumber() {  //判断身份证号格式是否正确
			const pattern = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
			return pattern.test(this.idCard);
		},
		generateCode() {  //刷新验证码
			const canvas = this.$refs.canvas;
			const ctx = canvas.getContext('2d');
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
			let code = '';
			for (let i = 0; i < 4; i++) {
				const char = chars[Math.floor(Math.random() * chars.length)];
				code += char;
				ctx.font = `${canvas.height / 2}px Arial`;
				ctx.fillText(char, (canvas.width / 4) * i + 10, canvas.height / 1.5);
			}
			this.generatedCode = code;
		},
		checkCode() {  //校验验证码
			if (this.code.toLowerCase() === this.generatedCode.toLowerCase()) {
				return true;
			} else {
				this.Swal('错误', '验证码错误!', 'error');
				this.generateCode();
				return false;
			}
		},
		savePassword() {  //保存密码
			if (this.username == "" || this.password == "") {
				this.Swal('错误', '请输入用户名和密码!', 'error');
				return;
			}
			if (this.savepassword == '保存密码') {
				this.$cookies.set('username', this.username, '14d')
				this.$cookies.set('password', this.password, '14d')
				this.savepassword = '取消保存';
				this.Swal("成功", "您的用户名和密码已保存在本地!", "success");
			}
			else {
				this.$cookies.remove('username')
				this.$cookies.remove('password')
				this.savepassword = '保存密码';
				this.Swal("成功", "您保存的用户名和密码已清空!", "success");
			}

		},
		getPassword() {  //获取已保存的密码
			if (this.$cookies.isKey('username') && this.$cookies.isKey('password')) {
				this.username = this.$cookies.get('username');
				this.password = this.$cookies.get('password');
				this.savepassword = '取消保存';
			}
		},
		switchShow(show) {  //切换登录，验证，修改密码界面
			this.showLogin = false;
			this.showFind = false;
			this.showChange = false;
			if (show == 'showLogin') { this.showLogin = true; }
			if (show == 'showFind') { this.showFind = true; }
			if (show == 'showChange') { this.showChange = true; }
		},
		find() {  //点击忘记密码，确认信息
			this.switchShow('showFind');
		},
		async next() {  //点击下一步，验证身份证和姓名，进入修改密码界面
			if (this.username == "" || this.idCard == "") {
				this.Swal('错误', '请输入用户名和姓名!', 'error');
				return;
			}
			if (this.isValidIDNumber() == false) {
				this.Swal('错误', '身份证格式错误!', 'error');
				return;
			}
			if (this.newpassword == "123456") {
				this.Swal('错误', '不能和初始密码相同!', 'error');
				return;
			}
			else {
				//服务器接口
				const result = await this.xcheck();
				if (result) {
					this.Swal("成功", "验证成功!", "success")
					this.switchShow('showChange');
				}
				else {
					//报错信息在xcheck中处理，不在这里呈现
					return;
				}
			}
		},
		async xcheck() {  //校验身份证，姓名
			const response = await fetch('http://6b1614f5.r3.cpolar.top/verify', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					userName: this.username,
					idCard: this.idCard,
					realName: this.realname
				})
			})
			const data = await response.json();
			if (data.code == 1) {
				return true;
			} else {
				console.log(data);
				this.Swal("失败", data.code + ":" + data.message, 'error');
				return false;
			}

		},
		async change() {  //点击确认，向服务端发送修改密码请求，然后回到登录界面
			if (this.newpassword == '' || this.newpassword2 == '') {
				this.Swal('错误', '请输入新密码!', 'error');
				return;
			}
			if (this.newpassword == '123456') {
				this.Swal('错误', '不可使用初始密码!', 'error');
				return;
			}
			if (this.newpassword != this.newpassword2) {
				this.Swal('错误', '两次密码输入不一致!', 'error');
				return;
			}
			const isAuth = await this.xcheck(); //再次验证身份证和姓名，增加安全性
			if (isAuth) {
				const result = await this.xchange();
				if (result) {
					this.Swal('成功', '修改请求已发送，请等待管理员审核!', 'success');
					this.password = '';
					this.code = '';
					this.newpassword = '';
					this.newpassword2 = '';
					this.generateCode();
					this.switchShow('showLogin')
				}

			}
		},
		async xchange() {
			const response = await fetch('http://6b1614f5.r3.cpolar.top/updatePassword', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					userName: this.username,
					passWord: this.newpassword
				})
			})
			const data = await response.json();
			if (data.code == 1) {
				return true;
			} else {
				console.log(data);
				this.Swal("失败", data.code + " : " + data.message, 'error');
				return false;
			}

		},
	}
}
</script>


<template>
	<Transition name="slide-up">
		<div id="signin" v-show="showLogin">
			<div>
				<br>
				<h3>登录</h3>
				<input @keyup.enter="login" v-model="username" type="text" placeholder="请输入用户名">
				<input @keyup.enter="login" v-model="password" type="password" placeholder="请输入密码">
				<input style="width:150px;" @keyup.enter="login" type="text" v-model="code" placeholder="请输入验证码" />
				<canvas ref="canvas" @click="generateCode"></canvas>
				<button @click="login">登录</button>
				<span id="bcmm" @click="savePassword">{{ savepassword }}</span>
				<span id="wjmm" @click="find">忘记密码？</span>
			</div>
		</div>
	</Transition>
	<Transition name="slide-up">
		<div id="signin" v-if="showFind">
			<div>
				<br>
				<h3>验证信息</h3>
				<input @keyup.enter="next" v-model="username" type="text" placeholder="请输入用户名">
				<input @keyup.enter="next" v-model="realname" type="text" placeholder="请输入真实姓名">
				<input @keyup.enter="next" v-model="idCard" type="text" placeholder="请输入身份证号">
				<button @click="next">下一步</button>
				<button @click="switchShow('showLogin')">返回</button>
			</div>
		</div>
	</Transition>
	<Transition name="slide-up">
		<div id="signin" v-if="showChange">
			<div>
				<br>
				<h3>修改密码</h3>
				<input style="margin-top: 30px;" @keyup.enter="change" v-model="newpassword" type="password"
					placeholder="请输入新密码">
				<input style="margin-bottom: 30px;" @keyup.enter="change" v-model="newpassword2" type="password"
					placeholder="请再次输入新密码">
				<button @click="change">确认</button>
				<button @click="switchShow('showFind')">返回</button>
			</div>
		</div>
	</Transition>
</template>


<style scoped>
h3 {
	margin-top: 0px;
}

input {
	border-radius: 20px;
	display: inline-block;
	width: 250px;
	height: 40px;
	line-height: 40px;
	margin: 0 auto;
	margin-bottom: 15px;
	outline: none;
	border: 1px solid #888;
	padding: 10px;
	box-sizing: border-box;
}

button {
	display: block;
	width: 250px;
	height: 40px;
	line-height: 40px;
	margin: 0 auto;
	border: none;
	background-color: #41b883;
	color: #fff;
	font-size: 18px;
	margin-bottom: 10px;
	transition: all 0.2s ease-in-out;
	border-radius: 20px;
}

button:hover {
	background-color: #2fd188;
	transform: scale(1.1);
	cursor: pointer;
}

button:active {
	background-color: #277351;
	transform: scale(1.1);
}

span {
	width: 115px;
	height: 30px;
	font-size: 16px;
	line-height: 30px;
	display: inline-block;
	color: #fff;
	background-color: #41b883;
	border-radius: 20px;
	transition: all 0.2s ease-in-out;
}

span:hover {
	cursor: pointer;
	background-color: #2fd188;
	transform: scale(1.1);
}

div#signin {
	text-align: center;
	background-color: aliceblue;
	border-radius: 20px;
	width: 300px;
	height: 336px;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	/* margin-top: -150px;
    margin-left: -168px; */
	box-shadow: 0px 16px 32px 0px rgba(0, 0, 0, 0.2);
}

body {
	background:
		linear-gradient(-180deg, #BCC5CE 0%, #929EAD 98%),
		radial-gradient(at top left, rgba(255, 255, 255, 0.30) 0%, rgba(0, 0, 0, 0.30) 100%);
	background-blend-mode: screen;
}

html,
body {
	height: 100%;
}

.swal-footer {
	text-align: center;
}

canvas {
	border-radius: 20px;
	width: 80px;
	height: 40px;
	text-align: right;
	margin-top: 0px;
	margin-left: 20px;
	border: 1px solid #888;
	box-sizing: border-box;
	background-color: #fff;
	cursor: pointer;

	vertical-align: middle;
	/* 千万别删这个 */
}

.swal-button {
	padding: 0;
}

.hide {
	display: none;
}

#bccm {
	margin-right: 20px;
}

#wjmm {
	margin-left: 20px;
}

.slide-up-enter-active,
.slide-up-leave-active {
	transition: all 0.45s ease-out;
}

.slide-up-enter-from {
	opacity: 0;
	/* transform: translateY(100px);
  transform: scale(0.3); */
}

.slide-up-leave-to {
	opacity: 0;
	/* transform: translateY(-100px);
  transform: scale(1.2); */
}
</style>

