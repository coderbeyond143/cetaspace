(function(){
	//necessary variables & constants for our application
	const socket = io();
	const signinform = document.getElementById('signin_form');
	const username = document.getElementById('username');
	const password = document.getElementById('password');
	var userDetails = {};
	signinform.addEventListener('submit',function(e){
		e.preventDefault();
		userDetails = {user_id:username.value,password:password.value,signin:true};
		socket.emit('sql connect',userDetails);
		username.value = '';
		password.value = '';
	});
	socket.on('query account',function(data){
		if(data){
			window.location = 'utils/html/profile.html?signin=';
		}else{
			alert('This user id is not in the database');
		}
	});
	socket.on('server error',function(){
		alert("Error connecting to database!");
	});
}());