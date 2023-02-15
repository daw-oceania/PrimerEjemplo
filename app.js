/*
	version con funciones reutilizables y aviso de todos los campos erróneos 
*/


//variable que lleva el número de intentos de envio del formulario.
var numintentos=0;
//array para almacenar los resultados de comprobar si los campos están bien formateados o no
var enviarform = []; 


window.addEventListener("DOMContentLoaded", iniciar);

function iniciar(){
	// Cuando el documento esté cargado asignaremos los eventos siguientes.
	// Al hacer click en el botón de enviar tendrá que llamar a la validación del miformulario.
	document.getElementById("btnEnviar").addEventListener('click',validar,false);
	
	// Asignamos que cuando pierda el foco el Nombre y los apellidos ponga en mayúsculas las Iniciales.
	document.getElementById("nombre").addEventListener('blur',iniciales,false);
	document.getElementById("apellidos").addEventListener('blur',iniciales,false);
}

function validar(eventopordefecto){	// En la variable que pongamos aquí gestionaremos el evento por defecto.
	document.getElementById("errores").innerHTML=""; //limpiamos el bloque de mensajes de error
	enviarform = []; //reiniciamos para el caso de volver a ejecutar la función validar

	enviarform.push (validarCamposTextoYEdad("0,1,2"));
	enviarform.push (validarEdad());
	enviarform.push (validarNIF());
	enviarform.push (validarEmail());
	enviarform.push (validarProvincia());
	enviarform.push (validarFecha());
	enviarform.push (validarTelefono());
	enviarform.push (validarHora());
	
	if (enviarform.indexOf(false) == -1){  //si no hay ningún valor a falso es que todos los campos están bien rellenados
		var resp = confirmarEnvio();
		if (resp) 
			return true;
		else{
			eventopordefecto.preventDefault();		
			return false;	
		}
	}else{
		numintentos++;
		document.getElementById("intentos").innerHTML = "** Número de intentos: " + numintentos + " **";
		// Cancelamos el evento de envío por defecto asignado al boton de submit enviar.
		eventopordefecto.preventDefault();		
		return false;	// Sale de la función devolviendo false.
	}
}

function iniciales(){
	var texto = this.value;
	if (texto){
		var separar = texto.split(" ");
		var resultado="";
		for (var i = 0; i < separar.length; i++) {
			var palabra = separar[i];
			palabra = palabra[0].toUpperCase() + palabra.substring(1,palabra.length);
			resultado += palabra;
			if(i<separar.length-1)
				resultado+=" ";
		}	
		this.value=resultado;
	}
}

function validarEdad(){
	var edad = formulario.edad.value.trim();
	edad = parseInt(edad);
	if(!(edad && edad>0 && edad<105)){
		document.getElementById("errores").innerHTML += "- Falta indicar una edad válida (1-104)<br>";
		document.getElementById("edad").className="error";
		return false;
	}
	return true;
}

// A esta función se le pasa el índice de los campos de texto que queremos que valide solamente si contienen
// o no contienen valores.
function validarCamposTextoYEdad(campos){
	var miformulario = document.getElementById("formulario");
	var camposchequear=campos.split(",");
	var validacionCamposTexto=true;

	for (var i=0; i<camposchequear.length; i++)	{
		// Eliminamos la clase error si es que estaba asignada a algún campo anteriormente.
		miformulario.elements[camposchequear[i]].className="";
		
		if (miformulario.elements[camposchequear[i]].type == "text" && (miformulario.elements[camposchequear[i]].value=="" || miformulario.elements[camposchequear[i]].value.trim().length == 0)) {
			document.getElementById("errores").innerHTML += "- El campo "+miformulario.elements[camposchequear[i]].name+" no puede estar en blanco<br />";
			miformulario.elements[camposchequear[i]].focus();
			miformulario.elements[camposchequear[i]].className="error";
			validacionCamposTexto = false;
		}
		// Chequeamos el campo edad.
		else if (miformulario.elements[camposchequear[i]].id=="edad") {
				//falta comprobar que la cadena no esta formada solo por espacios en blanco
				//if (miformulario.elements[camposchequear[i]].value.trim().length > 0){
				
				if (isNaN(miformulario.elements[camposchequear[i]].value) || miformulario.elements[camposchequear[i]].value <0 || miformulario.elements[camposchequear[i]].value >105 || miformulario.elements[camposchequear[i]].value.trim().length == 0) { 
					document.getElementById("errores").innerHTML += "- El campo: "+miformulario.elements[camposchequear[i]].name.toUpperCase()+" posee valores incorrectos<br />";
					miformulario.elements[camposchequear[i]].focus();
					miformulario.elements[camposchequear[i]].className="error";
					validacionCamposTexto = false;
				}
		}
	}
	return validacionCamposTexto;	 // Si sale de la función por aquí es que todos los campos de texto y la edad son válidos.
}

//valida la letra del dni
function dniValido(nif){
	var numero = nif.substring(0, nif.length-2);
	var letra = nif.charAt(nif.length-1);
	
	numero = parseInt(numero);
	
	var valida='TRWAGMYFPDXBNJZSQVHLCKET';

	if(valida.charAt(numero%23)==letra.toUpperCase())
		return true;
	return false;
}

function validarNIF(){
	// Eliminamos la clase error asignada al elemento fecha.
	document.getElementById("nif").className="";
	
	var nif = document.getElementById("nif").value.trim();
	// 8 números - Letra
	var patron = /^\d{8}-[A-Z]{1}$/;  //comparar con: /\d{8}-\D/
	if (patron.test(nif) && dniValido(nif))
		return true;
	else{
		document.getElementById("errores").innerHTML += "- Falta un NIF válido<br />";
		document.getElementById("nif").focus();
		document.getElementById("nif").className="error";
		return false;
	}
}


function validarEmail() {
/*
// Explicación de la Expresión Regular para validar el e-mail:

/^[a-zA-Z0-9._-]+  Indica que el e-mail debe comenzar con caracteres alfanuméricos, en 
mayúsculas o minúsculas, subrayados, puntos, etc.

@  Debe haber un símbolo de @ después de los caracteres iniciales.

[a-zA-Z0-9.-]+: Después de la arroba puede haber caracteres alfanuméricos. También puede
contener . y guiones -

\. Debe haber un punto después del segundo grupo de caracteres para separar los dominios y subdominios.

[a-zA-Z]{2,4}$/  Para terminar la dirección de e-mail debe terminar de 2 a 3 caracteres alfabéticos.

{2,4} indica el mínimo y máximo número de caracteres. Ésto permitirá dominio con 2,3 y 4 caracteres.
*/
	// Eliminamos la clase error asignada al elemento hora.
	document.getElementById("email").className="";

	var patron = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

	if (patron.test(document.getElementById("email").value))
		return true;
	else {
		document.getElementById("errores").innerHTML += "- El campo: E-MAIL está incorrecto.<br />";
		document.getElementById("email").focus();
		document.getElementById("email").className="error";
		return false;		
	}
}


function validarProvincia() {
	// Eliminamos la clase error asignada al elemento hora.
	document.getElementById("provincia").className="";
	
	// Comprueba que la opción seleccionada sea diferente a 0.
	// Si es la 0 es que no ha seleccionado ningún nombre de Provincia.
	if (document.getElementById("provincia").selectedIndex==0) {
		document.getElementById("errores").innerHTML += "- Debes seleccionar una PROVINCIA.<br />";
		document.getElementById("provincia").focus();
		document.getElementById("provincia").className="error";
		return false;
	}
	else
		return true;
}


function validarFecha() {
	// Eliminamos la clase error asignada al elemento fecha.
	document.getElementById("fecha").className="";

	// dd-mm-aaaa o bien dd/mm/aaaa
	var patron1 = /^\d{2}-\d{2}-\d{4}$/;
	var patron2 = /^\d{2}\/\d{2}\/\d{4}$/;
	if (patron1.test(document.getElementById("fecha").value) || patron2.test(document.getElementById("fecha").value))
		return true;
	else {
		document.getElementById("errores").innerHTML += "- Falta una fecha válida (dd/mm/aaaa) <br />";
		document.getElementById("fecha").focus();
		document.getElementById("fecha").className="error";
		return false;
	}
}

function validarTelefono() {
	// Eliminamos la clase error asignada al elemento telefono.
	document.getElementById("telefono").className="";
	
	// dd-mm-aaaa o bien dd/mm/aaaa
	var patron = /^\d{9}$/;
	if (patron.test(document.getElementById("telefono").value))
		return true;
	else {
		document.getElementById("errores").innerHTML += "- El campo: TELEFONO está incorrecto.<br />";
		document.getElementById("telefono").focus();
		document.getElementById("telefono").className="error";
		return false;
	}
}

function horaValida(horaSel){
	var hora = parseInt(horaSel.split(":")[0]);
	var minutos = parseInt(horaSel.split(":")[1]);
	var formato = document.forms["formulario"].formato.value;
	if(minutos>59)
		return false;
	if(formato=="12"){
		if(hora>12)
			return false;
	}else if(formato=="24"){
		if(hora>24)
			return false;
	}else{
		return false;
	}
	return true;
}

function validarHora() {
	// Eliminamos la clase error asignada al elemento hora.
	document.getElementById("hora").className="";
	
	// 4 números separados por :
	var patron = /^\d{2}:\d{2}$/;
	var horaVisita = document.getElementById("hora").value;
	
	if (patron.test(horaVisita)  && horaValida(horaVisita) )
		return true;
	else 	{
		document.getElementById("errores").innerHTML += "- El campo: HORA está incorrecto. <br />";
		document.getElementById("hora").focus();
		document.getElementById("hora").className="error";
		return false;
	}
}

function confirmarEnvio() {
	document.getElementById("errores").innerHTML="";
	var mivar= confirm("¿Deseas enviar el formulario?");
	return mivar;
}
