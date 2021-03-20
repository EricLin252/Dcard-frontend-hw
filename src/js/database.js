import jsSHA from "jssha";

//data: 目前已載入的景點資料array
var data = [];
//dataEnd: 紀錄目前是否已讀到資料的結尾
var dataEnd = false;
//citySet: 所有可選都市的 (中文: request key) 對應集合
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

//GetAuthorizationHeader: 產生fetch所需的header
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

//fetchData: 根據所需資料筆數與都市名fetch資料，並加入data尾端，return回一個promise
//amt: 此次需要載入的資料筆數
//city: 此次要載入的目標都市(若為所有都市則為"")
const fetchData = (amt, city) => {
	return new Promise((resolve, reject) => {
		//若已經沒有更多資料能讀了，直接return一個resolve promise
		if(dataEnd) resolve("DataEnd");

		//將參數結合入request中
		if(city !== "") city = "/" + city;
		let requestURL	= "https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot"
		requestURL		+= city
		requestURL		+= "?$select=Name%2CDescription"
		requestURL		+= "&$top=" + amt;
		requestURL		+= "&$skip=" + data.length;
		requestURL		+= "&$format=JSON";
		console.log(requestURL);

		//開始fetch
		fetch(
			requestURL,
			{
				method: "GET",
				headers: GetAuthorizationHeader
			}
		)
		.then(result => {
			//檢查連線是否有問題，若無問題，就轉換為json格式
			if(!result.ok) throw new Error(result.statusText);
			return result.json();
		})
		.then(result => {
			console.log("receive");
			//將新獲取的資料append進data尾端
			data = data.concat(result);
			//若獲取資料筆數比要求的原筆數少，表示已至結尾
			if(result.length < amt) dataEnd = true;
			resolve("Success");
		})
		.catch((err) => {
			console.log(err.code + ": " + err.message);
			reject("Failed");
		});
	});
}

//getData: 返回目前已讀取資料
const getData = () => {
	return data;
}
//clearData: 清除所有已讀取資料
const clearData = () => {
	data = [];
	dataEnd = false;
}
//isDataEnd: 返回dataEnd
const isDataEnd = () => {
	return dataEnd;
}

export default {citySet, getData, fetchData, clearData, isDataEnd}