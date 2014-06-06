//////////////////////////
// Kael FW by Talles ^^ //
//////////////////////////


// salvar modelos de formatos json para importação
// formato do json modelo '[{"cod": "id", "vlw": "valor", "lbl":"label"}]'
function formatarjson(jsonentrada,jsonmodelo)
{
	var jsonsaida = '[{';
	//alert('x');
	$.each(jsonentrada, function(i, item) {	
		for (var key in item)
		{
			var index = 0;
			for (var key2 in jsonmodelo[0])
			{
				
				if(key2 == key)
				{
					if(index == 0){
						jsonsaida += '"'+jsonmodelo[0][key2]+'":"'+item[key]+'"';
					}else{
						jsonsaida += ',"'+jsonmodelo[0][key2]+'":"'+item[key]+'"';
					}
					
				}
				index = 1;
			}
		}
		if(i == (jsonentrada.length - 1))
		{
			//jsonsaida += '}';
		}else{
			jsonsaida += '},{';
		}
	});
		jsonsaida += '}]';
		return JSON.parse(jsonsaida);
}

////////////////////////////////////////////////////////






//////////// Executar comando no banco de dados no formato {comando1,comando2} ////////////

function exsql(json_comandos){
			//alert('aqui dentro de importar'+nometabela);
			//console.log(nometabela+' - '+urltabela+' - '.nomebd);
			var db = window.openDatabase(localStorage['bd_nomebd'], "1.0", localStorage['bd_nomebd'], 200000);
					//alert(urltabela);
						db.transaction( function populateDB(tx){
						
								$.each(json_comandos.comandos,function(index, value){
									console.log(value);
									tx.executeSql(value);	
									
								});
								
								 valores = '';
						},function erro(){  console.log( 'erro ao executar comando ')  }, function acerto(){   console.log('Comandos executados com sucesso')  } );		
}

//////////////////////////////////////////////////////////////////////////////////////////


/////////////////importar tabelas do sistema //////////////
  
	function importar_tabela_dohost(nometabela,urltabela){
		//alert('aqui dentro de importar'+nometabela);
		console.log(nometabela+' - '+urltabela+' - '+localStorage['bd_nomebd']);
		var db = window.openDatabase(localStorage['bd_nomebd'], "1.0", localStorage['bd_nomebd'], 200000);
				//alert(urltabela);
				$.getJSON(urltabela, function(data) {
						//console.log(urltabela);
						//alert('aqui');
						//console.log('DATA DO JSON !!! '+data);
						var stringx = '';
						var stringy = '';
						//console.log(data);
						var i=0;
						for (var key in data[1]) {
						  if(i==0){
							stringx = key+' unique';
							stringy = key;
						  }else{
							stringx += ', '+key;
							stringy += ', '+key;
						  }
						  i++;
						}
						db.transaction( function populateDB(tx){
							//	alert('Inserindo imoveis no BD local');
								tx.executeSql('DROP TABLE IF EXISTS '+nometabela);
								tx.executeSql('CREATE TABLE IF NOT EXISTS '+nometabela+' ('+stringx+')');	
								//alert(stringx);
							var valores = '';
							$.each(data,function(index, value){
				  
							 var flag2 = 0;
							 for (var key in value) {
							   if(flag2==0)
							 {
								  valores += value[key];
								  
							 }else
								 {
									  mystring = value[key]+'';      
									  mystring = mystring.replace(/"/g, "'");
									  valores += ', "'+mystring+'"';
								 }
									flag2++;
							 }
							 tx.executeSql('INSERT INTO '+nometabela+' ('+stringy+') VALUES ('+valores+')');
							 valores = '';
							 });	
						},function erro(){  alert( 'erro ao inserir dados dos(as) '+nometabela+' ')  }, function acerto(){   alert('Dados inseridos com sucesso '+nometabela)  } );
					
				}).error(function() { alert("error ao conectar com o host ! "); });
	}
	
//////////////////////////////////////////////////////////////////////////////////////////////



/////////////// retorna todos os dados da tabela /////////////////////

function listar_tabela(nometabela,callback)
	{

		var db = window.openDatabase(localStorage['bd_nomebd'], "1.0", localStorage['bd_nomebd'], 200000);
			db.transaction( function coletandovisitas(tx){
				tx.executeSql('SELECT * FROM '+nometabela+'', [], function percorrendolinhas(tx, results) {
					var len = results.rows.length;
					var array_retorno = new Array();
					for (var i=0; i<len; i++){
						 array_retorno[i] = results.rows.item(i);
					}
					callback(array_retorno);
				}, function err(){ alert('erro ao coletar') } );			
			},function erro(){ alert('erro ao coletar dados') }, function acerto(){ } );

	}


//////////////////////////////////////////////////////////////////////////




/////////////////////Executa comando where listando ////////////////

	function cdb(nometabela,dbwhere,dbclausula,callback)
	{
			nomebd = localStorage['bd_nomebd'];	
			var db = window.openDatabase(nomebd, "1.0", nomebd, 200000);
			db.transaction( function coletandovisitas(tx){
				var sql = 'SELECT * FROM '+nometabela+' WHERE ( '+dbwhere+' = '+dbclausula+' ) '; 
				console.log(sql);
				tx.executeSql( sql , [], function percorrendolinhas(tx, results){
					var len = results.rows.length;
					
					var array_retorno = new Array();
					for (var i=0; i<len; i++){
						 array_retorno[i] = results.rows.item(i);
					}
					console.log(array_retorno);
					callback(array_retorno);
				}, function err(){ alert('erro ao coletar , Importando Banco para sincronia ');
					//baixar_tudo();
				} );			
			},function erro(){  }, function acerto(){  } );
	}

////////////////////////////////////////////////////////////////////




////////////////// checa se existe conexão no aparelho //////////////

function checar_internet(){
		var networkState = navigator.network.connection.type;
		var states = {};
		states[Connection.UNKNOWN] = 'Unknown connection';
		states[Connection.ETHERNET] = 'Ethernet connection';
		states[Connection.WIFI] = 'WiFi connection';
		states[Connection.CELL_2G] = 'Cell 2G connection';
		states[Connection.CELL_3G] = 'Cell 3G connection';
		states[Connection.CELL_4G] = 'Cell 4G connection';
		states[Connection.NONE] = 'No network connection';
		//alert(states[networkState]);
		if((states[networkState] == 'No network connection') || (states[networkState] == 'Unknown connection')){
			//navigator.notification.alert(" Não foi detectado conexão com a internet ", null, "Conexão", "Prosseguir");
			console.log('conexao 0');
			return 0
		}
		else{
			console.log('conexao 1');
			return 1;	
		}
	
	}
//////////////////////////////////////////////////////////////////////



/////////////////////// faz o download de uma lista de imagens /////////////////

function download_lista_imagens(lista)
	{
			var numero;
			var flag = '';
			alert('salvando imagens, aguarde');	
			for (numero=1; numero <= lista.length; numero){
					if(flag != lista[numero]){
						downloadFile(lista[numero],function (retorno){
								if(retorno == 1){
									numero ++;
									flag = 0;
									console.log(numero);
									console.log(lista.length);
								}else{
									alert('else');
								}
						});	
					}
				if(numero == lista.length)
				{
						alert('imagens importadas');
				}
			}
	}

////////////////////////////////////////////////////////////////////////////////




//////////////////// download do arquivo para o sistema ////////////////////

function downloadFile(filepath,callback){
			var remoteFile = filepath;
	        var localFileName = remoteFile.substring(remoteFile.lastIndexOf('/')+1);
			 window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
		            fileSystem.root.getFile('itrestaurante/'+localFileName, {create: true, exclusive: false}, function(fileEntry) {
		                var localPath = fileEntry.fullPath;
		                if (device.platform === "Android" && localPath.indexOf("file://") === 0) {
		                }
		                var ft = new FileTransfer();
		                ft.onprogress = function(progressEvent) {
		            		if (progressEvent.lengthComputable) {
		            			var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
		            			console.log(perc + "% loaded...");
		            			if(perc == 100){
		            				callback(1);
		            			}
		            		}
		            	};
		                ft.download(remoteFile,
		                		localPath, function(entry) {
		                });
		            });
		        });			
}

////////////////////////////////////////////////////////////////////////////////



	function recognizeSpeech() {
	
		//pagid = $.mobile.activePage.attr('id');
        var maxMatches = 5;
        var promptString = "Fale agora"; // optional
        var language = "pt-BR";                     // optional
        window.plugins.speechrecognizer.startRecognize(function(result){
		
			$(document).simpledialog2({  mode: 'button',
					headerText: 'Click One...',
					headerClose: true,
					buttonPrompt: 'Please Choose One',
					buttons : {
					  'OK': {
						click: function () { 
						  $('#buttonoutput').text('OK');
						}
					  },
					  'Cancel': {
						click: function () { 
						  $('#buttonoutput').text('Cancel');
						},
						icon: "delete",
						theme: "c"
					  }
					}
			});
        }, function(errorMessage){
        console.log("Error message: " + errorMessage);
        }, maxMatches, promptString, language);
		
	}

    // Show the list of the supported languages
    function getSupportedLanguages() {
        window.plugins.speechrecognizer.getSupportedLanguages(function(languages){
        // display the json array
        alert(languages);
        }, function(error){
        alert("Could not retrieve the supported languages : " + error);
        });
    }

	
	
	
//////////////////////////// FUNÇÕES COM ELEMENTOS HTML ///////////////////////////<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<___________________


///////////////////text field /////////////////

function editarit(id,valor,label)
{	
	if(valor != null)
	{
		$('#'+id).val(valor); 
	}
	if(label != null)
	{
		$('#'+id).parent().parent().find('label').html(label);
	}
}

function addit(idpai,id,nome,valor,labeltext)
{
	$('#'+idpai).append('<div data-role="fieldcontain"><label for="'+nome+'">'+labeltext+'</label><input type="text" name="'+nome+'" id="'+id+'"  value="'+valor+'" /></div>').trigger('create');	
}

/////////////////////////////////////////////


////////////////////radio button ////////////


// formato do json '[{"id": "radio-choice-1", "valor": "club", "label":"l1"},{"id": "radio-choice-2", "valor": "qaz" , "label":"l2"},{"id": "radio-choice-3", "valor": "jjjjjjj" , "label":"l3"}]'
function  editarrb(id,label,json)
{
	$('#'+id).find('legend').html(label);
	//'[{"id": "radio-choice-1", "valor": "club", "label":"l1"},{"id": "radio-choice-2", "valor": "qaz" , "label":"l2"},{"id": "radio-choice-3", "valor": "jjjjjjj" , "label":"l3"}]'
	$('#'+id).find('input').each(function (index) {
			if( json.length >= ( index +1 ))
			{
				console.log(json.length);
				console.log(index);
				$(this).val(json[index].valor);
				$(this).attr('id',json[index].id).trigger('create');
			}
	});
	$('#'+id).find('label').each(function (index) {
			if( json.length >= ( index +1 ))
			{
				//	$(this).html(json[index].label).trigger('create');
				$(this).children().html(json[index].label).trigger('create');
				//console.log($(this).find('span')[1].html('x'));
			}
	});
}

// formato do json '[{"id": "radio-choice-1", "valor": "club", "label":"l1"},{"id": "radio-choice-2", "valor": "qaz" , "label":"l2"},{"id": "radio-choice-3", "valor": "jjjjjjj" , "label":"l3"}]'
function addrb(idpai ,id, name, label, json)
{
	var retorno = '<fieldset data-role="controlgroup" id="'+id+'" ><legend>'+label+'</legend>';
	$.each(json, function(i, item) {
		retorno += '<input type="radio"  name="'+name+'" id="'+item.id+'" value="'+item.valor+'"/>';
		retorno += '<label for="'+item.id+'">'+item.label+'</label> ';
	});
	retorno += '</fieldset>';
		$('#'+idpai).append(retorno).trigger('create');
}

///////////////////////////////////////////////////////////


////////////// check box /////////////////




// formato do json '[{"id": "radio-choice-1", "valor": "club", "nome" : "nome1","label":"l1"},{"id": "radio-choice-2", "valor": "qaz" , "nome" : "nome1", "label":"l2"},{"id": "radio-choice-3", "valor": "jjjjjjj" , "nome" : "nome1", "label":"l3"}]'
function editarcb(id,label,json)
{
	$('#'+id).find('legend').html(label);
	//'[{"id": "radio-choice-1", "valor": "club", "label":"l1"},{"id": "radio-choice-2", "valor": "qaz" , "label":"l2"},{"id": "radio-choice-3", "valor": "jjjjjjj" , "label":"l3"}]'
	$('#'+id).find('input').each(function (index) {
			if( json.length >= ( index +1 ))
			{
				console.log(json.length);
				console.log(index);
				$(this).val(json[index].valor);
				$(this).attr('nome',json[index].nome);
				$(this).attr('id',json[index].id).trigger('create');
			}
	});
	$('#'+id).find('label').each(function (index) {
			if( json.length >= ( index +1 ))
			{
				$(this).children().html(json[index].label).trigger('create');
			}
	});
}

// formato do json '[{"id": "radio-choice-1", "valor": "club", "nome" : "nome1","label":"l1"},{"id": "radio-choice-2", "valor": "qaz" , "nome" : "nome1", "label":"l2"},{"id": "radio-choice-3", "valor": "jjjjjjj" , "nome" : "nome1", "label":"l3"}]'
function addcb(idpai ,id, label, json)
{
	var retorno = '<fieldset data-role="controlgroup" id="'+id+'" ><legend>'+label+'</legend>';
	$.each(json, function(i, item) {
		retorno += '<input type="checkbox"  name="'+item.nome+'" id="'+item.id+'" value="'+item.valor+'"/>';
		retorno += '<label for="'+item.id+'">'+item.label+'</label> ';
	});
	retorno += '</fieldset>';
		$('#'+idpai).append(retorno).trigger('create');
}

///////////////////////////////////////////////////////


////////////// Select box /////////////////


// formato do json '[{ "valor": "club", "nome" : "nome1" "},{ "valor": "club2", "nome" : "nome2" "},{ "valor": "club3", "nome" : "nome3" "}]'
function editarsb(id,label,json)
{
	$('#'+id).find('label').html(label);
	//'[{"id": "radio-choice-1", "valor": "club", "label":"l1"},{"id": "radio-choice-2", "valor": "qaz" , "label":"l2"},{"id": "radio-choice-3", "valor": "jjjjjjj" , "label":"l3"}]'
	$('#'+id).find('option').each(function (index) {
			if( json.length >= ( index +1 ))
			{
				//console.log(json.length);
				//console.log(index);
				$(this).val(json[index].valor);
				$(this).html(json[index].nome);
			}
	});
	
}

// formato do json '[{"id": "radio-choice-1", "valor": "club", "nome" : "nome1","label":"l1"},{"id": "radio-choice-2", "valor": "qaz" , "nome" : "nome1", "label":"l2"},{"id": "radio-choice-3", "valor": "jjjjjjj" , "nome" : "nome1", "label":"l3"}]'
function addsb(idpai ,id, label, nome, json)
{
	var retorno = '<label for="'+id+' class="select">'+label+'</label>';
	retorno += '<select name="'+nome+'" id="'+id+'">';
	$.each(json, function(i, item) {
		retorno += '<option value="'+item.valor+'"> '+item.nome+' </option>';
	});
	retorno += '</select>';
		$('#'+idpai).append(retorno).trigger('create');
}

/////////////////////////////////////////////
