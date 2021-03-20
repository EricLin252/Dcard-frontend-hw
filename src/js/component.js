import React, {Component} from 'react';
import "../css/component.css"
import db from "./database"

//Block: 景點欄位
class Block extends Component{
	//state.openContent: 紀錄block的content開啟狀態
	//props.spotName: 此景點的名字
	//props.content: 此景點的詳述
	constructor(props){
		super(props);
		this.setContent = this.setContent.bind(this);
		this.setDropdown = this.setDropdown.bind(this);
		this.state = {
			openContent: false
		}
	}

	//setDropdown: 控制block的content開啟
	setDropdown(){
		this.setState({
			openContent: !this.state.openContent
		});
	}

	//setContent: 根據此景點是否存在Description，決定是否產生content區塊
	setContent(){
		let output = [];
		if(this.props.content){
			output.push(
				//content開啟圖示
				<div key="dropdown" className="dropdownBtn">{(this.state.openContent)? "▲":"▼"}</div>
			);
			output.push(
				//content
				<div key="content" className={"blockContent" + (this.state.openContent? " showContent":"")}>{this.props.content}</div>
			);
		}
		return output;
	}

	render(){
		return(
			<div className="block" onClick={this.setDropdown}>
				<p className="blockTitle">{this.props.spotName}</p>
				{this.setContent()}
			</div>
		);
	}
}

//List: 整個景點列表
class List extends Component{
	//state.loading: 紀錄目前資料庫存取情況(true: 正在讀取, false: 讀取完成)
	//props.selectCity: 紀錄目前列表應顯示都市名("": 所有都市)
	constructor(props){
		super(props);
		this.checkScroll = this.checkScroll.bind(this);
		this.setBlocks = this.setBlocks.bind(this);
		this.state = {
			loading: true
		}
	}

	//checkScroll: 每次List滑動時呼叫，確認是否滑到底了
	checkScroll(event){
		let el = event.currentTarget;
		let scrollTop = el.scrollTop;
		let windowHeight = el.clientHeight;
		let scrollHeight = el.scrollHeight;

		if(scrollHeight - (windowHeight + scrollTop) < 1){
			//確定已滑到底，將狀態設為讀取中
			this.setState({
				loading: true
			});
		}
	}

	//componentDidMount: 網頁初始讀入後，需要讀取一次資料
	componentDidMount(){
		this.loadData();
	}

	//componentDidUpdate: 網頁重新渲染，決定是否新讀取資料
	componentDidUpdate(prevProps, prevState){
		//當更改選取都市，將資料清空，將列表滑動至頂部，並設為讀取中狀態
		if(prevProps.selectCity !== this.props.selectCity){
			db.clearData();
			document.getElementById("list").scrollTop = 0;
			this.setState({
				loading: true
			});
		}
		//當loading從false更改為true時，主動更新資料
		else if(prevState.loading !== this.state.loading){
			if(prevState.loading === false) this.loadData();
		}
	}

	//loadData: 讀取資料，讀取完成後將loading設為false
	loadData(){
		//從選取都市名中，新多讀取30筆
		db.fetchData(30, this.props.selectCity)
		.then((val) => {
			//val: 讀取結果("Success": 成功讀取, "Failed": 讀取失敗, "DataEnd": 此都市沒有更多資料了)
			console.log(val);
			this.setState({
				loading: false
			});
		});
	}

	//setBlocks: 根據目前讀取入的資料產生每個景點的block
	setBlocks(){
		let data = db.getData();
		console.log(data);
		let output = [];
		for(let i = 0; i < data.length; ++i){
			output.push(<Block
				key={i}
				spotName={data[i].Name}
				content={data[i].Description}
			/>);
		}
		return output;
	}

	render(){
		return(
			<div id="list" className="list" onScroll={this.checkScroll}>
				{this.setBlocks()}
				<div className="loading">{(db.isDataEnd())? "沒有更多景點了":"下載中..."}</div>
			</div>
		);
	}
}

class Page extends Component{
	//state.selectCity: 紀錄現在選擇顯示哪個都市
	constructor(){
		super();
		this.changeSelectCity = this.changeSelectCity.bind(this);
		this.setCity = this.setCity.bind(this);
		this.state = {
			selectCity: ""
		}
	}

	//changeSelectCity: 更改所選擇的都市
	changeSelectCity(event){
		console.log("change city");
		this.setState({
			selectCity: event.target.value
		});
	}

	//setCity: 使用db.citySet產生都市選單
	setCity(){
		let output = [];
		for(let key in db.citySet){
			output.push(<option key={key} value={db.citySet[key]}>{key}</option>);
		}
		return output;
	}

	render(){
		return(
			<div className="page">
				<h1 className="title">交通部觀光景點大蒐集</h1><span className="selectCity">
					<select defaultValue="" onChange={this.changeSelectCity}>{this.setCity()}</select>
				</span>
				<List selectCity={this.state.selectCity}/>
			</div>
		);
	}
}

export default {Block, List, Page}