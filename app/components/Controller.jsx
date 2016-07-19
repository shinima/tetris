import React from 'react'
import { connect } from 'react-redux'
import { MAX_SPEED, MIN_SPEED } from '../constants'
import {
  start,
  restart,
  pause,
  resume,
  drop,
  moveLeft,
  moveRight,
  moveDown,
  rotate,
  setSpeed,
} from '../actions'

@connect(state => state.toObject(), {
  start, restart, pause, resume, drop, moveLeft, moveRight, moveDown, rotate, setSpeed,
})
export default class Controller extends React.Component {
  static propTypes = {
    on: React.PropTypes.bool.isRequired,
    paused: React.PropTypes.bool.isRequired,
    gameover: React.PropTypes.bool.isRequired,
    speed: React.PropTypes.number.isRequired,
    score: React.PropTypes.number.isRequired,
    start: React.PropTypes.func.isRequired,
    restart: React.PropTypes.func.isRequired,
    pause: React.PropTypes.func.isRequired,
    resume: React.PropTypes.func.isRequired,
    drop: React.PropTypes.func.isRequired,
    moveLeft: React.PropTypes.func.isRequired,
    moveRight: React.PropTypes.func.isRequired,
    moveDown: React.PropTypes.func.isRequired,
    rotate: React.PropTypes.func.isRequired,
    setSpeed: React.PropTypes.func.isRequired,
  }

  componentDidMount() {
    document.addEventListener('keydown', this.keydown)
    document.addEventListener('keyup', this.keyup)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.keydown)
    document.removeEventListener('keydown', this.keyup)
    Object.keys(this.handlers).forEach(key => {
      if (this.handlers[key]) {
        clearInterval(this.handlers[key])
      }
    })
  }

  handlers = {}

  startTimer = (key, callback, interval = 100) => {
    if (!this.handlers[key]) {
      callback()
      this.handlers[key] = setInterval(callback, interval)
    }
  }

  stopTimer = key => {
    clearInterval(this.handlers[key])
    this.handlers[key] = null
  }

  keydown = event => {
    const { on, paused, gameover } = this.props
    if (!(on && !paused && !gameover)) {
      return
    }
    if (event.key === 'w' || event.keyCode === 87) {
      this.startTimer('w', this.props.rotate)
    } else if (event.key === 'a' || event.keyCode === 65) {
      this.startTimer('a', this.props.moveLeft)
    } else if (event.key === 'd' || event.keyCode === 68) {
      this.startTimer('d', this.props.moveRight)
    } else if (event.key === 's' || event.keyCode === 83) {
      this.startTimer('s', this.props.moveDown, 50)
    } else if (event.key === ' ' || event.keyCode === 32) {
      this.props.drop()
    }
  }

  keyup = event => {
    if (event.key === 'w' || event.keyCode === 87) {
      this.stopTimer('w')
    } else if (event.key === 'a' || event.keyCode === 65) {
      this.stopTimer('a')
    } else if (event.key === 'd' || event.keyCode === 68) {
      this.stopTimer('d')
    } else if (event.key === 's' || event.keyCode === 83) {
      this.stopTimer('s')
    }
  }

  start = event => {
    event.target.blur()
    this.props.start()
  }

  restart = event => {
    event.target.blur()
    this.props.restart()
  }

  pause = event => {
    event.target.blur()
    this.props.pause()
  }

  resume = event => {
    event.target.blur()
    this.props.resume()
  }

  speedUp = event => {
    event.target.blur()
    this.props.setSpeed(this.props.speed + 1)
  }

  speedDown = event => {
    event.target.blur()
    this.props.setSpeed(this.props.speed - 1)
  }

  render() {
    const { score, on, paused, gameover, speed } = this.props
    return (
      <div className="controller">
        <h1>Controller</h1>
        <h2>当前分数: {score}</h2>
        {!paused && !gameover ?
          <button onClick={this.start} disabled={on}>start</button>
          :
          <button onClick={this.restart}>restart</button>
        }
        {paused ?
          <button onClick={this.resume}>resume</button>
          :
          <button onClick={this.pause} disabled={!on || gameover}>pause</button>
        }
        <div style={{ marginTop: 15 }}>
          <label style={{ marginRight: 10 }}>当前速度 {speed}</label>
          <button onClick={this.speedUp} disabled={gameover || speed === MAX_SPEED}>
            +
          </button>
          <button onClick={this.speedDown} disabled={gameover || speed === MIN_SPEED}>
            -
          </button>
        </div>
      </div>
    )
  }
}
