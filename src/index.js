import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import reportWebVitals from './js/reportWebVitals';

import comp from './js/component'

const setBlocks = () => {
	let output = [];
	for(let i = 0; i < 30; ++i)
		output.push(<comp.Block key={i}/>);
	return output;
}

const setCity = () => {
	let output = [];
	output.push(<option key={0} value="">所有城市</option>);
	return output;
}

ReactDOM.render(
	<React.StrictMode>
		<h1 className="title">交通部觀光景點大蒐集</h1><span className="selectCity">
			<select defaultValue="">{setCity()}</select>
		</span>
		<div className="content">
			{setBlocks()}
		</div>
	</React.StrictMode>,
	document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
