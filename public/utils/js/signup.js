(function(){
	//necessary variables & constants for our application
	const socket = io();
	const signupform = document.getElementById('new_user_form');
	const user_id = document.getElementById('user_id');
	const name = document.getElementById('name');
	const password = document.getElementById('password');
	var userDetails = {};
	//create account event from server
	socket.on('query account',function(data){
		if(data){
			window.location = 'profile.html?signup=';
		}else{
			alert('This user id is not available!');
		}
	});
	//when form is submitted by user
	signupform.addEventListener('submit',function(e){
		e.preventDefault();
		userDetails = {user_id:user_id.value,name:name.value,password:password.value,signup:true};
		socket.emit('sql connect',userDetails);
		user_id.value = '';
		name.value = '';
		password.value = '';
	});
	socket.on('server error',function(){
		alert("Error connecting to database!");
	});
}());