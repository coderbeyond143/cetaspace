(function(){
	//variables
	const socket = io();	
	var profile_name = document.getElementById('profile_name');
	var bio = document.getElementById('bio');
	var friends = document.getElementById('friends');
	var globalusersbtn = document.getElementById('globalusersbtn');
	//load profile data from server
	window.onload = function(){
		socket.emit('show profile');
	};
	socket.on('profile data',function(data){
		if(data.signup){
			profile_name.innerHTML = data.name;
			bio.innerHTML = data.user_id;
		}else{
			profile_name.innerHTML = data[0].name;
			bio.innerHTML = data[0].user_id;
		}
	});
	//list all the users
	globalusersbtn.addEventListener('click',function(){
		socket.emit('sql connect','globaluserlist');
		this.style.display = 'none';
	});
	socket.on('global user list',function(data){
		console.log(data);
		for(var i = 0; i < data.length; i++){
			var li = document.createElement('li');
			var btn = document.createElement('button');
			btn.innerHTML = data[i].user_id;
			btn.setAttribute('id',data[i].user_id);
			btn.addEventListener('click',function(e){
				socket.emit('chat request',e.target.id);
			});
			li.appendChild(btn);
			globalusers.appendChild(li);
		}

	});
	//confirm chat request
	socket.on('confirm chat request',function(data){
		var request = confirm(data+' send you a chat request!');
		if(request){
			
		}
	});
	socket.on('server error',function(){
		alert("Error connecting to database!");
	});
}());