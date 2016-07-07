import React from 'react';

export default class Bracket extends React.Component {

	componentWillMount() {
		this.props.thing
	}

	render() {
		return (
			<div>
				{
					this.props.thing.map(function(participant) {
						return (
							<div>
								
							</div>
						)
					})
				}
			</div>
		);
	}
}
