var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

var bodyParser = require("body-parser");
app.use(bodyParser.json()); //soporte para codificar json
app.use(bodyParser.urlencoded({extended: true })); //soporte para decodificar las url

var firebase = require("firebase");
firebase.initializeApp({
  serviceAccount: "NotificacionesProyect-f9ad39c78f32.json",
  databaseURL: "https://notificacionesproyect.firebaseio.com"
});

var FCM = require('fcm-push');

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/android', function(request, response) {
  response.render('pages/index');
});

//POST: https://safe-reef-52668.herokuapp.com/token-device
//token
//animal
var tokenDevicesURI = "token-device";
app.post("/" + tokenDevicesURI, function(request, response) {
	var token = request.body.token;
	var animal = request.body.animal;
	var db = firebase.database();
	var tokenDevices = db.ref(tokenDevicesURI).push();
	tokenDevices.set({
		token: token,
		animal: animal
	});
	
	var path = tokenDevices.toString();
	var pathSplit = path.split(tokenDevicesURI + "/");
	var idAutogenerado = pathSplit[1];
	
	var respuesta = generarRespuestaAToken(db, idAutogenerado);
	response.setHeader("Content-Type", "application/json");
	
	response.send(JSON.stringify(respuesta));
});

function generarRespuestaAToken(db, idAutogenerado) {
	var respuesta = {};
	var usuario = "";
	var ref = db.ref("token-device");
	ref.on("child_added", function(snapshot, prevChildKey) {
		usuario = snapshot.val();
		respuesta = {
			id: idAutogenerado,
			token: usuario.token,
			animal: usuario.animal
		};
	});
	return respuesta;
} 


//GET: https://safe-reef-52668.herokuapp.com/token-animal
//id
//animal
app.get("/toque-animal/:id/:animal", function(request, response) {
	var id = request.params.id;
	var animal = request.params.animal;
	
	var db = firebase.database();
	var ref = db.ref("token-device/" + id);
	
	var usuario = "";
	var respuesta = {};
	ref.on("value", function(snapshot) {
		usuario = snapshot.val();
		var mensaje = animal + " te dio un toque";
		enviarNotificacion(usuario.token, mensaje);
		respuesta = {
			id: id,
			token: usuario.token,
			animal: usuario.animal
		};
		response.send(JSON.stringify(respuesta));
	}, function (errorObject) {
		console.log("The read failed: " + errorObject.code);
		respuesta = {
			id: "",
			token: "",
			animal: ""
		};
		response.send(JSON.stringify(respuesta));
	});
});


function enviarNotificacion(tokenDestinatario, mensaje) {
	var serverKey = 'AIzaSyBAiqeVP1v7n53gqHLI9mM9fgxckJWeTek';
	var fcm = new FCM(serverKey);
	
	var message = {
		to: tokenDestinatario, // required fill with device token or topics
		collapse_key: '', 
		data: {},
		notification: {
			title: 'Notificacion desde servidor',
			body: mensaje,
			icon: "profile_icon",
			sound: "default",
			color: "#00BCD4"
		}
	};

	//callback style
	fcm.send(message, function(err, response){
		if (err) {
			console.log("Something has gone wrong!");
		} else {
			console.log("Successfully sent with response: ", response);
		}
	});
}


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


