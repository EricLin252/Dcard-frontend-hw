import React, {Component} from 'react';
import "../css/component.css"
import db from "./database"

class Block extends Component{
	constructor(props){
		super(props);
		this.setContent = this.setContent.bind(this);
		this.setDropdown = this.setDropdown.bind(this);
		this.state = {
			openContent: false
		}
	}

	setDropdown(){
		this.setState({
			openContent: !this.state.openContent
		});
	}

	setContent(){
		let output = [];
		if(this.props.content){
			output.push(
				<div key="dropdown" className="dropdownBtn">{(this.state.openContent)? "▲":"▼"}</div>
			);
			output.push(
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

class List extends Component{
	constructor(props){
		super(props);
		this.checkScroll = this.checkScroll.bind(this);
		this.setBlocks = this.setBlocks.bind(this);
		this.state = {
			loading: true
		}
	}

	checkScroll(event){
		let el = event.currentTarget;
		let scrollTop = el.scrollTop;
		let windowHeight = el.clientHeight;
		let scrollHeight = el.scrollHeight;

		if(scrollHeight - (windowHeight + scrollTop) < 1){
			this.setState({
				loading: true
			});
		}
	}

	componentDidMount(){
		this.loadData();
	}

	componentDidUpdate(prevProps, prevState){
		if(prevProps.selectCity !== this.props.selectCity){
			db.clearData();
			document.getElementById("list").scrollTop = 0;
			this.setState({
				loading: true
			});
		}
		else if(prevState.loading !== this.state.loading){
			if(prevState.loading === false) this.loadData();
		}
	}

	loadData(){
		db.fetchData(30, this.props.selectCity)
		.then((val) => {
			console.log(val);
			this.setState({
				loading: false
			});
		});
	}

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
	constructor(){
		super();
		this.changeSelectCity = this.changeSelectCity.bind(this);
		this.setCity = this.setCity.bind(this);
		this.state = {
			selectCity: ""
		}
	}

	changeSelectCity(event){
		console.log("change city");
		this.setState({
			selectCity: event.target.value
		});
	}

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