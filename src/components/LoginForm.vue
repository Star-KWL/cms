<script>
import swal from 'sweetalert';
export default {
	data() {
		return {
			username: '',
			password: '',
			idCard: '',
			truename: '',
			newpassword: '',
			newpassword2: '',
			code: '',
			generatedCode: '',
			showLogin: "show",
			showFind: "hide",
			showChange: "hide",
		}
	},
	mounted() {
		this.generateCode();
	},
	methods: {
		login() {
			if (this.checkCode() == false) return;
			if (this.isValidUsername() == false) {
				swal('错误', '用户名只能使用字母，数字和下划线!', 'error');
				return;
			}
			if (this.username == "" || this.password == "") {
				swal('错误', '请输入用户名和密码!', 'error');
			}
			else {
				if(this.password=="123456"){
					swal('注意', '请修改密码!', 'info');
					this.showLogin = "hide";
				    this.showFind = "hide";
				    this.showChange = "show";
					return;
				}
				//需要服务器验证
				swal('成功', '登陆成功!', 'success');
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
				swal('错误', '验证码错误!', 'error');
				this.generateCode();
				return false;
			}
		},
		find() {  //点击忘记密码，确认信息
			this.showLogin = "hide";
			this.showFind = "show";
			this.showChange = "hide";
		},
		next() {  //点击下一步，修改密码
			if (this.username == "" || this.idCard == "") {
				swal('错误', '请输入用户名和姓名!', 'error');
				return;
			}
			if (this.isValidIDNumber() == false) {
				swal('错误', '身份证格式错误!', 'error');
				return;
			}
			if (this.newpassword == "123456") {
				swal('错误', '不能和初始密码相同!', 'error');
				return;
			}
			else {
				//服务器接口
				this.idCard = '';
				this.truename = '';
				this.showLogin = "hide";
				this.showFind = "hide";
				this.showChange = "show";
			}


		},
		change() {  //点击确认，回到登录界面
			if(this.newpassword==''|| this.newpassword2==''){
				swal('错误', '请输入新密码!', 'error');
				return;
			}
			if(this.newpassword=='123456'){
				swal('错误', '不可使用初始密码!', 'error');
				return;
			}
			if(this.newpassword===this.newpassword2){
				swal('成功', '修改成功!', 'success');
				this.password = '';
				this.code = '';
				this.newpassword = '';
				this.newpassword2 = '';
				this.generateCode();
				this.showLogin = "show";
			    this.showFind = "hide";
			    this.showChange = "hide";
			}
			else{
				swal('错误', '两次密码输入不一致!', 'error');
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
			<span :class="showLogin" @click="find">忘记密码？</span>
			<input :class="showFind" @keyup.enter="next" v-model="username" type="text" placeholder="请输入用户名">
			<input :class="showFind" @keyup.enter="next" v-model="truename" type="text" placeholder="请输入真实姓名">
			<input :class="showFind" @keyup.enter="next" v-model="idCard" type="text" placeholder="请输入身份证号">
			<button :class="showFind" @click="next">下一步</button>
			<input :class="showChange" @keyup.enter="change" v-model="newpassword" type="password" placeholder="请输入新密码">
			<input :class="showChange" @keyup.enter="change" v-model="newpassword2" type="password" placeholder="请再次输入新密码">
			<button :class="showChange" @click="change">确认</button>

		</div>
	</div>
</template>

<style>
h3 {
	margin-top: 0px;
}

input {
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
	font-size: 16px;
	margin-bottom: 5px;
}

span {
	cursor: pointer;
}

span:hover {
	color: #41b883;
}

div#signin {
	text-align: center;
	background-color: aliceblue;
	border-radius: 20px;
	width: 300px;
	height: 320px;
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

button {
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

.swal-footer {
	text-align: center;
}

canvas {
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
.swal-button{
	padding: 0;
}
.hide{
	display: none;
}
</style>

