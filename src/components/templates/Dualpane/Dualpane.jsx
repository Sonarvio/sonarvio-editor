/**
 * Dualpane
 * ========
 *
 * Split layout with menu and panels tabs.
 */

import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'

import './Dualpane.styl'


/**
 *
 */
export default class Dualpane extends Component {

  static propTypes = {
    menu: PropTypes.func,
    selected: PropTypes.number // index
  }

  constructor (props) {
    super(props)
    this.state = {
      shared: Object.create(null),
      selected: props.selected || 0
    }
  }

  render(){
    const { children } = this.props
    const { selected, shared } = this.state
    const updateShared = (shared) => this.setState({
      shared: {
        ...this.state.shared,
        ...shared
      }
    })

    // analyse the children
    const labels = React.Children.map(children, (child) => child.props.label)
    const Menu = this.getMenu(labels)
    return (
      <div className="Dualpane">
        <nav className="Dualpane__Navigation">
          {Menu}
        </nav>
        <div className="Dualpane__Content">
          {React.Children.map(children, (child, i) => {
            return (
              <div className={classnames({
                  'Dualpane__View': true,
                  'Dualpane__View--selected': i === selected
              })}>
                {React.cloneElement(child, { shared, updateShared })}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  getMenu (labels) {
    const { menu, className } = this.props
    const { selected } = this.state
    return (menu && menu(labels, selected)) || (
      <ol className={classnames(['Dualpane__Menu', className])}>
        {labels.map((label, i) => {
          return (
            <li className={classnames({
                'Dualpane__Label': true,
                'Dualpane__Label--selected': i === selected
              })}
              onClick={()=> this.setState({ selected: i })} key={i}>
              {label}
            </li>
          )
        })}
      </ol>
    )
  }
}
