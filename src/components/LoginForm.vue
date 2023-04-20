<script>
import swal from 'sweetalert';
export default {
	data() {
		return {
			username: '',
			password: '',
			idCard: '',
			realname: '',
			newpassword: '',
			newpassword2: '',
			code: '',
			savepassword: '保存密码',
			generatedCode: '',
			showLogin: "show",
			showFind: "hide",
			showChange: "hide",
		}
	},
	mounted() {
		this.generateCode();
		this.getPassword();
	},
	methods: {
		Swal(theTitle, theText, theInfo) {
			swal({
				title: theTitle,
				text: theText,
				icon: theInfo,
				button: "好的"
			});
		},
		async login() {
			if (this.checkCode() == false) return;
			if (this.isValidUsername() == false) {
				this.Swal('错误', '用户名只能使用字母，数字和下划线!', 'error');
				return;
			}
			if (this.username == "" || this.password == "") {
				this.Swal('错误', '请输入用户名和密码!', 'error');
				return;
			}
			else {
				const result = await this.xlogin();
				if (result) {
					if (this.password == "123456") {
						this.Swal('注意', '请修改密码!', 'info');
						this.showLogin = "hide";
						this.showFind = "hide";
						this.showChange = "show";
						return;
					}
					this.Swal("成功", "您已成功登录", "success")
					window.open('/dashboard', '_self');
				}
			}

		},
		async xlogin() {
			const response = await fetch('https://www.fastmock.site/mock/190b43d54318fbf3326b993eb7ca66d0/login/api/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					username: this.username,
					password: this.password
				})
			})
			const data = await response.json();
			if (data.code == 200) {
				return true;
			} else {
				console.log(data);
				this.Swal("失败", data.code + ":" + data.desc, 'error');
				return false;
			}
		},
		isValidUsername() {
			const pattern = /^[a-zA-Z0-9_]+$/;
			return pattern.test(this.username);
		},
		isValidIDNumber() {
			const pattern = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
			return pattern.test(this.idCard);
		},
		generateCode() {
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
		checkCode() {
			if (this.code.toLowerCase() === this.generatedCode.toLowerCase()) {
				return true;
			} else {
				this.Swal('错误', '验证码错误!', 'error');
				this.generateCode();
				return false;
			}
		},
		savePassword() {
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
		getPassword() {
			if (this.$cookies.isKey('username') && this.$cookies.isKey('password')) {
				this.username = this.$cookies.get('username');
				this.password = this.$cookies.get('password');
				this.savepassword = '取消保存';
			} else {
				return;
				// 用户名和密码未保存
			}

		},
		switchShow(show) {
			this.showLogin = "hide";
			this.showFind = "hide";
			this.showChange = "hide";
			if (show == 'showLogin') this.showLogin = "show";
			if (show == 'showFind') this.showFind = "show";
			if (show == 'showChange') this.showChange = "show";
		},
		find() {  //点击忘记密码，确认信息
			this.switchShow('showFind');
		},
		async next() {  //点击下一步，修改密码
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
					this.Swal("成功", "修改成功，请等待管理员审核！", "success")
					this.idCard = '';
					this.realname = '';
					this.switchShow('showChange');
				}
			}
		},
		async xcheck() {
			const response = await fetch('', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					username: this.username,
					id_card: this.idCard,
					real_name: this.realname
				})
			})
			const data = await response.json();
			if (data.code == 200) {
				return true;
			} else {
				console.log(data);
				this.Swal("失败", data.code + ":" + data.desc, 'error');
				return false;
			}
		},
		change() {  //点击确认，回到登录界面
			if (this.newpassword == '' || this.newpassword2 == '') {
				this.Swal('错误', '请输入新密码!', 'error');
				return;
			}
			if (this.newpassword == '123456') {
				this.Swal('错误', '不可使用初始密码!', 'error');
				return;
			}
			if (this.newpassword === this.newpassword2) {
				this.Swal('成功', '修改请求已发送，请等待管理员审核!', 'success');
				this.password = '';
				this.code = '';
				this.newpassword = '';
				this.newpassword2 = '';
				this.generateCode();
				this.switchShow('showLogin')
			}
			else {
				this.Swal('错误', '两次密码输入不一致!', 'error');
			}
		},
	}
}
</script>


<template>
	<div id="signin">
		<div>
			<br>
			<h3 :class="showLogin">登录</h3>
			<h3 :class="showFind">验证信息</h3>
			<h3 :class="showChange">修改密码</h3>
			<input :class="showLogin" @keyup.enter="login" v-model="username" type="text" placeholder="请输入用户名">
			<input :class="showLogin" @keyup.enter="login" v-model="password" type="password" placeholder="请输入密码">
			<input :class="showLogin" style="width:150px;" @keyup.enter="login" type="text" v-model="code"
				placeholder="请输入验证码" />
			<canvas :class="showLogin" ref="canvas" @click="generateCode"></canvas>
			<button :class="showLogin" @click="login">登录</button>
			<span id="bcmm" :class="showLogin" @click="savePassword">{{ savepassword }}</span>
			<span id="wjmm" :class="showLogin" @click="find">忘记密码？</span>
			<input :class="showFind" @keyup.enter="next" v-model="username" type="text" placeholder="请输入用户名">
			<input :class="showFind" @keyup.enter="next" v-model="realname" type="text" placeholder="请输入真实姓名">
			<input :class="showFind" @keyup.enter="next" v-model="idCard" type="text" placeholder="请输入身份证号">
			<button :class="showFind" @click="next">下一步</button>
			<button :class="showFind" @click="switchShow('showLogin')">返回</button>
			<input style="margin-top: 30px;" :class="showChange" @keyup.enter="change" v-model="newpassword" type="password"
				placeholder="请输入新密码">
			<input style="margin-bottom: 30px;" :class="showChange" @keyup.enter="change" v-model="newpassword2"
				type="password" placeholder="请再次输入新密码">
			<button :class="showChange" @click="change">确认</button>
			<button :class="showChange" @click="switchShow('showFind')">返回</button>

		</div>
	</div>
</template>


<style>
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
	height: 335px;
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
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
</style>

