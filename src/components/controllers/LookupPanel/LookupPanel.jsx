/**
 * LookupPanel
 * ===========
 *
 *
 */

import React, { Component, PropTypes } from 'react'

import './LookupPanel.styl'


/**
 *
 */
export default class LookupPanel extends Component {

	static defaultProps = {
		issueLink: 'https://github.com/Sonarvio/sonarvio-editor/issues/1'
	}

	static propTypes = {
		label: PropTypes.string.isRequired,
		// added by cloning
		shared: PropTypes.object,
		updateShared: PropTypes.func
	}

	render() {
		const { issueLink } = this.props
		return (
			<div className="LookupPanel">
				<p>Acoustic fingerprint matching is currently not available.</p>
				<p>For more details checkout <a className="LookupPanel__Link"
					href={issueLink} target="_blank">this issue</a>.</p>
			</div>
		)
	}
}
