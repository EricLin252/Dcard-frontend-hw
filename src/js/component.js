import React, {Component} from 'react';
import "../css/component.css"
import db from "./database"

class Block extends Component{
	constructor(props){
		super(props);
	}

	render(){
		return(
			<div className="block">
				<p className="blockTitle">{this.props.spotName}</p>
				<div className="blockContent">{this.props.content}</div>
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
			blockAmt: 0,
			loading: true
		}
	}

	checkScroll(event){
		let el = event.currentTarget;
    	let scrollTop = el.scrollTop;
		let windowHeight = el.clientHeight;
		let scrollHeight = el.scrollHeight;

		if(scrollHeight - (windowHeight + scrollTop) < 1){
			console.log("end");
		}
	}

	componentDidMount(){
		this.loadData();
	}

	componentDidUpdate(prevProps){
        if(prevProps.selectCity !== this.props.selectCity){
			console.log("notice change city");
            this.setState({
				blockAmt: 0,
				loading: true
			}, () => {
				db.clearData();
				this.loadData();
				document.getElementById("list").scrollTop = 0;
			});
        }
    }

	loadData(){
		db.fetchData(30, this.state.blockAmt, this.props.selectCity)
		.then(() => {
			console.log("complete");
			this.setState({
				blockAmt: db.getDataLen(),
				loading: false
			});
		});
	}

	setBlocks(){
		console.log("rendering...");
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