const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mysql = require('mysql');
const PORT = process.env.PORT || 397;
var DATA = {}, SIGNUP = {};
var CONNECT = true;
var table_name = 'userDetails';
var ID;
var conn = mysql.createConnection({
	host:"remotemysql.com",
	user:"ycHtDZ4jPb",
	password:"0ObsckPY9n",
	database:"ycHtDZ4jPb",
	multipleStatements:true
});
//connection to database
conn.connect(function(err){
	if(err){
		CONNECT = false;
		console.log('errr connecting to dataabase!');
	}
});
//default route
app.get('/',function(req,res){
	res.sendFile(__dirname+'/public/home.html');
});
//middleware
app.use(express.static('public'));
//listen to defined port on server
http.listen(PORT,function(){
	console.log('Listening on port '+ PORT);
});
//for every new connection
io.on('connection',function(socket){
//****************************************************************************************//
	console.log('new socket connected!');

	//create new account
	socket.on('sql connect',function(data){
		console.log(data);
		socket.join(data.user_id);
		var query;
		if(CONNECT){
			console.log('connected to sql database!');			
			if(data.signin){
				query = "SELECT * FROM "+table_name+" WHERE user_id='"+data.user_id+"'";
			}else if(data.signup){
				SIGNUP = data;
				query = "INSERT INTO "+table_name+"(user_id,name,password) VALUES('"+data.user_id+"','"+data.name+"','"+data.password+"')";
			}else if(data == 'globaluserlist'){
				query = "SELECT user_id FROM "+table_name;
			}
			//querying to database
			conn.query(query,function(err,result){
			if(err){
				console.log(err);
				socket.emit('create account',false);
			}else{
				//when user attempts to signin
				if(result.length > 0 && data.signin){
					socket.emit('query account',true);
					DATA = result;
				}else if(result.affectedRows){
					socket.emit('query account',true);
					DATA = SIGNUP;
				}else if(result.length > 0 && data == 'globaluserlist'){
					socket.emit('global user list',result);
				}
				else{
					socket.emit('query account',false);
				}
			}
			});
		}else{
			socket.emit('server error');
		}
	});
	//****************************************************************************************//
	socket.on('show profile',function(data){
		if(DATA.user_id){
			ID = DATA.user_id;
		}else{
			ID = DATA[0].user_id;
		}
		socket.isOnline = true;
		socket.join(ID);
		socket.emit('profile data',DATA);
	});
	//****************************************************************************************//
	socket.on('chat request',function(data){
		socket.broadcast.to(data).emit('confirm chat request',ID);
	});
});
