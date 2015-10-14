/**
 * ResourcesPanel
 * ==============
 *
 *
 */

import React, { Component, PropTypes } from 'react'

import './ResourcesPanel.styl'


/**
 *
 */
export default class ResourcesPanel extends Component {

	static propTypes = {
		label: PropTypes.string.isRequired,
		// added by cloning
		shared: PropTypes.object,
		updateShared: PropTypes.func
	}

	constructor (props) {
		super(props)
		this.state = {
			pending: false
		}
	}

	render() {
		const { pending } = this.state
		return (
			<div className="ResourcesPanel">
				{/**
					<ul className="ResourcesPanel__Improvements">
						<li>add option to select export format + name</li>
						<li>add option to normalize the exported file</li>
						<li>include meta information (e.g. from the video ?)</li>
					</ul>
				**/}
				{!pending ? (
					<button className="ResourcesPanel__Button"	onClick={::this.forceDownload}>
						Export Track
					</button>
				) : (
					<div>Preparing Export</div>
				)}
			</div>
		)
	}

	forceDownload() {
		const { shared } = this.props
		if (!shared.getSequence) {
			return console.info('Initial conversion of the track has to be done first - keep waiting!')
		}
		this.setState({ pending: true }, () => {
			shared.getSequence(/** options **/).then((track) => {
				const link = document.createElement('a')
				const url = track.getUrl()
				link.setAttribute('download', track.name)
			  link.setAttribute('href', url)
			  link.dispatchEvent(new Event('click'))
			  // window.URL.revokeObjectURL(url)
				console.log(`[SONARVIO] => ${url}`)
				this.setState({ pending: false })
			})
		})
	}

}
