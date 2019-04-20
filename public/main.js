$(document).ready(function(){

	var socketString = 'http://localhost:3000?token=';

	if(sessionStorage.token)
		showDisplays();
	else
		login();

	//GET Login View
	function login() {
		$.ajax({
			'type': 'GET',
			'url': '/login',
			statusCode: {
				200: function(data){
					$(".content").empty();
					$(".content").append(data);
				}
			}
		})		
	}//END LOGIN


	//POST Login On Submit
	$(".content").on("submit", ".form-signin", function(event){
		console.log('submit')
		event.preventDefault();

		var username = $(".content").find("input#inputUser").val();
		var password = $(".content").find("input#inputPassword").val();

		var data = JSON.stringify({"username":username, "password":password});

		//console.log(data)

		$.ajax({
			'type': 'POST',
			'url': '/login',
			'contentType': 'application/json',
			'data': data,
			statusCode: {
				200: function(data){
					//console.log(data.token)
					sessionStorage.token = data.token;
					showDisplays();
					connectSocket();
				},
				403: function(data){
					$(".feedback").empty();
					$(".feedback").append("<h4>Wrong Credentials</h4>");
					$(".content").find("input#inputPassword").val('');
					$(".content").find("input#inputUser").val('');
				}
			}
		})

	})//END POST Login on Submit

	function showDisplays(){

		console.log('showDisplays')

		$(".feedback").empty()
		$(".content").empty()

		$.ajax({
			'type': 'GET',
			'url': '/displays',
			beforeSend: function(xhr){xhr.setRequestHeader("Authorization", sessionStorage.token);},
			statusCode: {
				200: function(data){
					$(".content").empty()
					$(".content").append(data)
					//connectSocket();
				},
				403: function(){
					login()
				}
			}

		})

	}//END showDisplays

	//Connect Socket function
	function connectSocket(){
		console.log(socketString)
		var socket = io(socketString + sessionStorage.token + '&room=web');
		socket.on('connect', function(){
			console.log('socket connect')
  		});
	}//end connectSocket

})//END MAIN







