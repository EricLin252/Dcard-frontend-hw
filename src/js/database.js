import jsSHA from "jssha";

var data = [];
var dataEnd = false;
const citySet = {
	"所有城市": "",
	"臺北市": "Taipei",
	"新北市": "NewTaipei",
	"桃園市": "Taoyuan",
	"臺中市": "Taichung",
	"臺南市": "Tainan",
	"高雄市": "Kaohsiung",
	"基隆市": "Keelung",
	"新竹市": "Hsinchu",
	"新竹縣": "HsinchuCounty",
	"苗栗縣": "MiaoliCounty",
	"彰化縣": "ChanghuaCounty",
	"南投縣": "NantouCounty",
	"雲林縣": "YunlinCounty",
	"嘉義縣": "ChiayiCounty",
	"嘉義市": "Chiayi",
	"屏東縣": "PingtungCounty",
	"宜蘭縣": "YilanCounty",
	"花蓮縣": "HualienCounty",
	"臺東縣": "TaitungCounty",
	"金門縣": "KinmenCounty",
	"澎湖縣": "PenghuCounty",
	"連江縣": "LienchiangCounty"
};

const GetAuthorizationHeader = () => {
	let AppID = 'FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF';
	let AppKey = 'FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF';
	let GMTString = new Date().toGMTString();
	let ShaObj = new jsSHA('SHA-1', 'TEXT');
	ShaObj.setHMACKey(AppKey, 'TEXT');
	ShaObj.update('x-date: ' + GMTString);
	let HMAC = ShaObj.getHMAC('B64');
	let Authorization = 'hmac username="' + AppID + '", algorithm="hmac-sha1", headers="x-date", signature="' + HMAC + '"';

	return { 'Authorization': Authorization, 'X-Date': GMTString, 'Accept-Encoding': 'gzip'};
}

const fetchData = (amt, city) => {
	return new Promise((resolve, reject) => {
		if(dataEnd) resolve("dataEnd");

		if(city !== "") city = "/" + city;
		let requestURL	= "https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot"
		requestURL		+= city
		requestURL		+= "?$select=Name%2CDescription"
		requestURL		+= "&$top=" + amt;
		requestURL		+= "&$skip=" + data.length;
		requestURL		+= "&$format=JSON";
		console.log(requestURL);

		fetch(
			requestURL,
			{
				method: "GET",
				headers: GetAuthorizationHeader
			}
		)
		.then(result => {
			if(!result.ok) throw new Error(result.statusText);
			return result.json();
		})
		.then(result => {
			console.log("receive");
			data = data.concat(result);
			if(result.length < amt) dataEnd = true;
			resolve("Success");
		})
		.catch((err) => {
			console.log(err.code + ": " + err.message);
			reject("Failed");
		});
	});
}

const getData = () => {
	return data;
}

const getDataLen = () => {
	return data.length;
}

const clearData = () => {
	data = [];
	dataEnd = false;
}

const isDataEnd = () => {
	return dataEnd;
}

export default {citySet, getData, getDataLen, fetchData, clearData, isDataEnd}