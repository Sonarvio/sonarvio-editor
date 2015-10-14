/**
 * SelectPanel
 * ===========
 *

 */

import React, { Component, PropTypes} from 'react'

import Converter from 'sonarvio-converter'

import WaveSurfer from 'expose?WaveSurfer!exports?WaveSurfer!wavesurfer.js'
import 'wavesurfer.js/plugin/wavesurfer.regions.js'
import 'imports?define=>false,this=>window!wavesurfer.js/plugin/wavesurfer.timeline.js'

import { setupWaveSurfer } from '../../../utilities/wavesurfer'

import './SelectPanel.styl'


/**
 *
 */
export default class SelectPanel extends Component {

	static propTypes = {
		label: PropTypes.string.isRequired,
		// added by cloning
		shared: PropTypes.object,
		updateShared: PropTypes.func,

		proxy: PropTypes.string,
		source: PropTypes.instanceOf(Uint8Array).isRequired,
		video: PropTypes.instanceOf(HTMLElement)
	}

	static defaultProps = {
		proxy: 'http://sonarvio.com/__/proxy.html'
	}

	constructor (props) {
		super(props)
		this.state = {
			wavesurfer: null
		}
	}

	componentDidMount(){

		const { proxy, source, video, updateShared } = this.props

		const converter = new Converter({ proxy })

		converter.transform({
			name: 'source.webm',
			data: source
		}, {
			name: 'target.wav'
		})
		.then((track) => {
			const wavesurfer = Object.create(WaveSurfer)

			wavesurfer.init({
				container: '#wavesurfer',
				waveColor: 'violett',
				progressColor: 'purple',

				cursorWidth: 3,
				interact: false,
				hideScrollbar: true
			})

			wavesurfer.on('error', ::console.error)
			wavesurfer.on('destroy', ::console.error)
			// wavesurfer.on('loading', (p) => console.log(`loading: ${p}`))

			wavesurfer.on('ready', () => {
				setupWaveSurfer(wavesurfer, video)
				this.setState({	wavesurfer,	converter }, () => {
					updateShared({
						getSequence: ::this.getSequence
					})
				})
			})

			wavesurfer.loadBlob(new Blob([ track.data ], { type: 'audio/wav' }))

		}).catch(::console.error)
	}

	render() {
		// TODO:
		// - use refs instead | https://gist.github.com/jimfb/4faa6cbfb1ef476bd105
		const { wavesurfer } = this.state
		return (
			<div className="SelectPanel">
				<div className="SelectPanel__WaveSurfer" id="wavesurfer"/>
				<div className="SelectPanel__Timeline" id="timeline"/>
				{!wavesurfer && (<div className="SelectPanel__Spinner"/>)}
			</div>
		)
	}

	getSequence (/** options **/) {
		const { wavesurfer, converter } = this.state
		const { select } = wavesurfer.regions.list
		return converter.transform({
			name: 'source.webm',
			data: this.props.source
		}, {
			name: 'target.wav',
			start: select.start,
			end: select.end
		})
	}
}
