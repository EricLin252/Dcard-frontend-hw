import React, {Component} from 'react';
import "../css/component.css"

class Block extends Component{
	constructor(){
		super();
		this.spotName = "AAAAA";
		this.city = "aaa";
		this.content = "xxxxxxxx";
	}

	render(){
		return(
			<div className="block">
				<p className="blockTitle"><span className="spotName">{this.spotName}</span><span className="city">{this.city}</span></p>
				<div className="blockContent">{this.content}</div>
			</div>
		);
	}
}

class List extends Component{
	constructor(){
		super();
		this.blockAmt = 30;
	}

	render(){
		return(
			<div className="list"></div>
		);
	}
}

export default {Block, List}