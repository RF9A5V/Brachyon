import React from 'react';
import { Link } from 'react-router';

export default class ContactScreen extends React.Component {
	
	render() {
		return(
		  <div className="row center">
		    <div className="col side-tab-panel">
		      <h2 style={{margin: 0}}>Contact Us</h2>
	      	<div className="about-what">
	      		<form action="mailto:thomas@brachyon.com" method="post">
							<label for="Name">Name:</label>
							<input type="text" name="Name" id="Name" /><br/>
							<label for="Email">Email:</label>
							<input type="text" name="Email" id="Email" /><br/>
							<label for="Message" style={{marginRight: 215}}>Message:</label><br/>
							<textarea style={{marginRight: 0}} name="Message" rows="40" cols="40" id="Message"></textarea><br/>
							<input type="submit" name="submit" value="Submit"/>
						</form>
					</div>
				</div>
			</div>
		);
	}
}