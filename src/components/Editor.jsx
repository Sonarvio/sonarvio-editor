/**
 * Editor
 * ======
 *
 *
 */

import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'

import Dualpane from './templates/Dualpane/Dualpane.jsx'
import SelectPanel from './controllers/SelectPanel/SelectPanel.jsx'
import LookupPanel from './controllers/LookupPanel/LookupPanel.jsx'
import ResourcesPanel from './controllers/ResourcesPanel/ResourcesPanel.jsx'

import './Editor.styl'


/**
 *
 */
export default class Editor extends Component {

  static propTypes = {
    proxy: PropTypes.string,
    source: PropTypes.instanceOf(Uint8Array).isRequired,
    video: PropTypes.instanceOf(HTMLElement)
  }

	shouldComponentUpdate (nextProps, nextState) {
		if (!(shallowCompare(this, nextProps, nextState))) {
			return true
		}
		return false
	}

  render(){
    const { proxy, source, video } = this.props
    return (
      <div className="Editor">
        <Dualpane>
          <SelectPanel label={'Select'} proxy={proxy} source={source} video={video}/>
          <LookupPanel label={'Lookup'}/>
          <ResourcesPanel label={'Resources'}/>
        </Dualpane>
      </div>
    )
  }
}
