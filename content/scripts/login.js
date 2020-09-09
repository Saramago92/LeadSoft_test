var authKey;
var statusCode;
var activeId = null;

async function makePostRequest() {
	var username = document.getElementById("userName").value;
	var password = document.getElementById("password").value;

	if(wrongPassword.style.display != "none"){
		wrongPassword.style.display = "flex";
	}

    params = {
  		"username": String(username),
  		"password": String(password)
	}

    let res = await axios.post('http://test.leadsoft.inf.br:5353/api/v1/Auth/LogIn', params);
    authKey = res.data.Result.Authorization;
    statusCode = res.data.HttpStatusCode;

    changeScreen();
    getAll();
}

function changeScreen(){
	if(statusCode == 200){
		if(firstContent.style.display === "none"){
			firstContent.style.display = "flex";
			secondContent.style.display = "none";
		}
		else {
			firstContent.style.display = "none";
			secondContent.style.display = "flex";
		}
	}
}

function toggleSmallBox(id){
	if(smallBox.style.display === "none"){
		smallBox.style.display = "flex"
		activeId = id;
	}
	else{
		smallBox.style.display ="none";
		activeId = null;
	} 
}

function toggleConfirmationBox(){
	if(confirmationBox.style.display === "none"){
		confirmationBox.style.display = "flex"
	}
	else{
		toggleSmallBox(null);
		confirmationBox.style.display = "none";
		refreshPage();
	} 
}

async function toggleIncludeBox(){
	var config = {
	  headers: {'Authorization': authKey}
	};

	if(includeBox.style.display === "none"){
		includeBox.style.display = "flex"
		
		if(activeId != null){
			let res = await axios.get('http://test.leadsoft.inf.br:5353/api/v1/People/' + activeId, config);

			document.getElementById("newName").value = res.data.Result.Name;
			document.getElementById("newSurname").value = res.data.Result.Surname;
			document.getElementById("newHeight").value = res.data.Result.Height;
			document.getElementById("newWeigth").value = res.data.Result.Weigth;
		}
		else{
			document.getElementById("newName").value = "";
			document.getElementById("newSurname").value = "";
			document.getElementById("newHeight").value = "";
			document.getElementById("newWeigth").value = "";
		}
	}
	else{
		includeBox.style.display = "none";
		refreshPage();
	} 
}

async function getAll(){
	var config = {
	  headers: {'Authorization': authKey}
	};
	let res = await axios.get('http://test.leadsoft.inf.br:5353/api/v1/People', config);
	for(var i = 0; i < res.data.Result.length; i++){

		id = res.data.Result[i].Id;

		let res2 = await axios.get('http://test.leadsoft.inf.br:5353/api/v1/People/' + id + '/IMC', config);

		var para = document.createElement("button");
		para.className = "wrapper";
		para.setAttribute("onClick","toggleSmallBox('" + String(id) + "')");
		para.click = toggleSmallBox;

		var nameNode = document.createElement("div");
		nameNode.className = "nameNode";
		var name = document.createTextNode(res.data.Result[i].Name + " " + res.data.Result[i].Surname);
		nameNode.appendChild(name);


		var ageNode = document.createElement("div");
		ageNode.className = "ageNode";
		var age = document.createTextNode(calculate_age(res.data.Result[i].DateOfBirth));
		ageNode.appendChild(age);

		var heightNode = document.createElement("div");
		heightNode.className = "heightNode";
		var height = document.createTextNode(res.data.Result[i].Height);
		heightNode.appendChild(height);

		var weigthNode = document.createElement("div");
		weigthNode.className = "weigthNode";
		var weigth = document.createTextNode(res.data.Result[i].Weigth);
		weigthNode.appendChild(weigth);

		var imcNode = document.createElement("div");
		imcNode.className = "imcNode";
		var imc = document.createTextNode(Math.round(1000 * res2.data.Result.IMC));
		imcNode.appendChild(imc);
		

		para.appendChild(nameNode);
		para.appendChild(ageNode);
		para.appendChild(heightNode);
		para.appendChild(weigthNode);
		para.appendChild(imcNode);

		var element = document.getElementById("grid");
		element.appendChild(para);
	}
}

function calculate_age(dateOfBirth) {
	var dob = new Date(dateOfBirth);
    var diff_ms = Date.now() - dob.getTime();
    var age_dt = new Date(diff_ms); 
  
    return Math.abs(age_dt.getUTCFullYear() - 1970);
}

function deleteButton(){
	toggleConfirmationBox();
}

async function deletePerson(){
	var config = {
	  headers: {'Authorization': authKey}
	};
	let res = await axios.delete('http://test.leadsoft.inf.br:5353/api/v1/People/'+ activeId, config);
	toggleConfirmationBox();
}

function refreshPage(){
	document.getElementById("grid").innerHTML = "";
	toggleSmallBox(null);
	getAll();
}

async function includeConfirm(){
	newName =  document.getElementById("newName").value;
	newSurname = document.getElementById("newSurname").value;
	newDob = document.getElementById("newDob").value;
	newWeigth =  document.getElementById("newWeigth").value;
	newHeight = document.getElementById("newHeight").value

	var config = {
	  headers: {'Authorization': authKey}
	};
	


	if(activeId === null){
		var params = {
			"name": newName,
			"surname": newSurname,
			"dateOfBirth": newDob,
			"weigth": newWeigth,
			"height": newHeight
		}

		let res = await axios.post('http://test.leadsoft.inf.br:5353/api/v1/People/', params, config);
	
		toggleIncludeBox();
	}
	else{

		var params = {
			"id": activeId,
			"name": newName,
			"surname": newSurname,
			"dateOfBirth": newDob,
			"weigth": newWeigth,
			"height": newHeight
		}


		let res = await axios.put('http://test.leadsoft.inf.br:5353/api/v1/People/' + activeId, params, config);
	
		toggleIncludeBox();
	}
}
