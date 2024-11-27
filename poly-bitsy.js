"use strict"
let gameSelectors = [] // game selectors
let playlist = {} // game playlist
let games = {} // all the games
// gamepads axes and buttons mapping
let gamepadAxesX = 1
let gamepadAxesY = 2
let gamepadButtonRight = 1
let gamepadButtonLeft = 3
let gamepadButtonUp = 0
let gamepadButtonDown = 2

// gamepads class Singleton
class GamePads {
  constructor() {
    if (GamePads._instance) {
      return GamePads._instance
    }
    GamePads._instance = this;

    window.addEventListener("gamepadconnected", (e) => {
      console.log(
        "Gamepad connected at index %d: %s. %d buttons, %d axes.",
        e.gamepad.index,
        e.gamepad.id,
        e.gamepad.buttons.length,
        e.gamepad.axes.length,
      )
      gamepadHandler(e, true)
    })
    
    // gamepad disconnection event handler
    window.addEventListener("gamepaddisconnected", (e) => {
      console.log(
        "Gamepad disconnected from index %d: %s",
        e.gamepad.index,
        e.gamepad.id,
      )
      gamepadHandler(e, false)
    })

    function gamepadHandler(event, connected) {
      const gamepad = event.gamepad

      console.log(gamepad)
    }

    this.gameLoop()
  }

  gameLoop() {

    for (let gamepad of navigator.getGamepads()) {
      let right = gamepad.axes[gamepadAxesX] > 0.75 ||  gamepad.buttons[gamepadButtonRight].pressed
      let left = gamepad.axes[gamepadAxesX] < -0.75 ||  gamepad.buttons[gamepadButtonLeft].pressed
      let up = gamepad.axes[gamepadAxesY] < -0.75   ||  gamepad.buttons[gamepadButtonUp].pressed
      let down = gamepad.axes[gamepadAxesY] > 0.75  ||  gamepad.buttons[gamepadButtonDown].pressed

      if (right && !gamepad.waitRight) {
        gamepad.waitRight = true // set wait flag
        const event = new CustomEvent("gamepadbutton", {
          bubbles: true,
          detail: {direction: "right", state:true, index: gamepad.index }
        })
        document.querySelectorAll(".game-selector, .game-iframe").forEach(element => {
          element.dispatchEvent(event)
        })
        //console.log('right')
        setTimeout(function(){ 
          gamepad.waitRight = false
          const event = new CustomEvent("gamepadbutton", {
            bubbles: true,
            detail: {direction: "right", state:false, index: gamepad.index }
          })
          document.querySelectorAll(".game-selector, .game-iframe").forEach(element => {
            element.dispatchEvent(event)
          })
         }, 200)
      }

      if (left && !gamepad.waitLeft) {
        gamepad.waitLeft = true // set wait flag
        const event = new CustomEvent("gamepadbutton", {
          bubbles: true,
          detail: {direction: "left", state:true, index: gamepad.index }
        })
        document.querySelectorAll(".game-selector, .game-iframe").forEach(element => {
          element.dispatchEvent(event)
        })
        //console.log('left')
        setTimeout(function(){ 
          gamepad.waitLeft = false
          const event = new CustomEvent("gamepadbutton", {
            bubbles: true,
            detail: {direction: "left", state:false, index: gamepad.index }
          })
          document.querySelectorAll(".game-selector, .game-iframe").forEach(element => {
            element.dispatchEvent(event)
          })
         }, 200)
      }

      if (up && !gamepad.waitUp) {
        gamepad.waitUp = true // set wait flag
        const event = new CustomEvent("gamepadbutton", {
          bubbles: true,
          detail: {direction: "up", state:true, index: gamepad.index }
        })
        document.querySelectorAll(".game-selector, .game-iframe").forEach(element => {
          element.dispatchEvent(event)
        })
        //console.log('up')
        setTimeout(function(){ 
          gamepad.waitUp = false
          const event = new CustomEvent("gamepadbutton", {
            bubbles: true,
            detail: {direction: "up", state:false, index: gamepad.index }
          })
          document.querySelectorAll(".game-selector, .game-iframe").forEach(element => {
            element.dispatchEvent(event)
          })
         }, 200)
      }

      if (down && !gamepad.waitDown) {
        gamepad.waitDown = true // set wait flag
        const event = new CustomEvent("gamepadbutton", {
          bubbles: true,
          detail: {direction: "down", state:true, index: gamepad.index }
        })
        document.querySelectorAll(".game-selector, .game-iframe").forEach(element => {
          element.dispatchEvent(event)
        })
        //console.log('down')
        setTimeout(function(){ 
          gamepad.waitDown = false
          const event = new CustomEvent("gamepadbutton", {
            bubbles: true,
            detail: {direction: "down", state:false, index: gamepad.index }
          })
          document.querySelectorAll(".game-selector, .game-iframe").forEach(element => {
            element.dispatchEvent(event)
          })
         }, 200)
      }
    }

    requestAnimationFrame(this.gameLoop.bind(this))
  }

  info() {
    console.log('GamePads info')
  }
}

// game container class
class GameContainer {
  static count = 0
  constructor(playlist, gamepadId = null) {
    ++GameContainer.count

    this.gameSelectionIndex = 0
    this.gamepadSelectionIndex = 0

    this.container = document.createElement('div')
    this.container.className = 'game-container'
    this.container.tabIndex = GameContainer.count
    this.needClick = true

    this.muted = false

    this.setGamepadId(gamepadId)
    this.loadPlaylist(playlist)

    this.container.onblur = function(){
      console.log("blur")
      this.needClick = true
      console.log(this)
    }.bind(this)

    this.container.onmouseenter = function(){
      if (this.container.querySelector('.game-iframe') == null) return
      this.container.querySelector('.game-selector-menu').style.display = 'flex'
      this.container.querySelector('.gamepad-selector').style.display = 'flex'
    }.bind(this)

    this.container.onmouseleave = function(){
      if (this.container.querySelector('.game-iframe') == null) return
      this.container.querySelector('.game-selector-menu').style.display = 'none'
      this.container.querySelector('.gamepad-selector').style.display = 'none'
    }.bind(this)

    this.container.onkeydown = function(e) {
      console.log(e)
      if (e.key === 'ArrowDown') {
        this.setGameSelectionIndex(this.gameSelectionIndex + 1)
      }
      if (e.key === 'ArrowUp') {
        this.setGameSelectionIndex(this.gameSelectionIndex - 1) 
      }
      if (e.key === 'ArrowRight') {
        this.loadGame(this.gameSelectionIndex) 
      }
    }.bind(this)
  }

  setGameSelectionIndex(index) {
    let gameSelector = this.container.querySelector('.game-selector')
    if (gameSelector === null) return
    if (index < 0) index = this.playlist.games.length -1
    if (index >= this.playlist.games.length) index = 0

    this.gameSelectionIndex = index

    for (let title of gameSelector.querySelectorAll('.game-selector-item')) {
      if (title.gameIndex == this.gameSelectionIndex) {
        title.classList.add('selected')
        title.scrollIntoView()
      } else {
        title.classList.remove('selected')
      }
    }
  }

  setGamepadSelectionIndex(index) {
    let gamepadSelector = this.container.querySelector('.gamepad-selector')
    if (gamepadSelector === null) return

    this.gamepadSelectionIndex = index
    for (let gamepad of gamepadSelector.querySelectorAll('.menu-item')) {
      if (gamepad.gamepadIndex == this.gamepadSelectionIndex) {
        gamepad.classList.add('selected')
        gamepad.scrollIntoView()
      } else {
        gamepad.classList.remove('selected')
      }
    }
  }

  getNode() {
    return this.container
  }

  setGamepadId(gamepadId) {
    this.gamepadId = gamepadId
  }

  loadPlaylist(playlist) {
    this.playlist = playlist
    this.reload()
  }

  loadGame(gameIndex) {
    let iframe = document.createElement("iframe")
    let path = this.playlist.games[gameIndex].path
    
    iframe.setAttribute('src', path)
    iframe.classList.add('game-iframe')
    this.container.style.width = this.playlist.games[gameIndex].width ?? this.playlist.settings.width
    this.container.style.height = this.playlist.games[gameIndex].height ?? this.playlist.settings.height

    this.container.querySelector('.game-selector').replaceWith(iframe)
   
    iframe.addEventListener('gamepadbutton', function(e) {
      // console.log(e)
      // console.log(iframe)
      if (e.detail.index != this.gamepadSelectionIndex ) {
        console.log('return')
        return
      }
      if (e.detail.direction == "up") {
        let clonedEvent = {type: (e.detail.state ? 'keydown': 'keyup'),key: 'ArrowUp', code: "ArrowUp", charCode: 0, keyCode: 38 }
        // console.log('up')
        iframe.contentWindow.postMessage(clonedEvent, "*")
      } else if (e.detail.direction == "down") {
        //console.log('down')
        let clonedEvent = {type: (e.detail.state ? 'keydown': 'keyup'),key: 'ArrowDown', code: "ArrowDown", charCode: 0, keyCode: 40}
        iframe.contentWindow.postMessage(clonedEvent, "*")
      } else if (e.detail.direction == "left") {
        //console.log('left')
        let clonedEvent = {type: (e.detail.state ? 'keydown': 'keyup'),key: 'ArrowLeft', code: "ArrowLeft", charCode: 0, keyCode: 37}
        iframe.contentWindow.postMessage(clonedEvent, "*")
      } else if (e.detail.direction == "right") {
        //console.log('right') 
        let clonedEvent = {type: (e.detail.state ? 'keydown': 'keyup'),key: 'ArrowRight', code: "ArrowRight", charCode: 0, keyCode: 39}
        iframe.contentWindow.postMessage(clonedEvent, "*")
      }
    }.bind(this))

      // inject message event listner to iframe content
    // iframe.onload = function() {
      console.log('loaded')
      //var iframeDoc = iframe.contentDocument || iframe.contentWindow.document
      
      this.checkIframeLoaded(iframe)      
  }

  checkIframeLoaded(iframe) {
    let iframeDoc = iframe.contentDocument
    // console.log(iframe.contentWindow)
    // console.log(iframeDoc.readyState)
    if (iframeDoc.readyState  == 'complete' ) {
      // console.log(iframe.contentWindow)
      iframe.contentWindow.addEventListener('message', (message) => {
        // console.log(`got iframe message ${message.data["type"]}`)
        let frankstEvent = new KeyboardEvent( message.data["type"], message.data )
        iframe.contentWindow.document.dispatchEvent( frankstEvent )
        iframe.contentWindow.document.body.style.background = 'transparent'
      })
      return
    }
   window.setTimeout(this.checkIframeLoaded, 1000, iframe)
  }

  setupMenu() {
    // menu container

    let gameSelectorMenu = document.createElement('div')
    gameSelectorMenu.className = 'game-selector-menu'
    
    // gamepad selector
    let gamepadSelector = document.createElement('div')
    gamepadSelector.className = 'gamepad-selector'

    for (let index = 0; index<4; index++) {
      let gamepadItem = document.createElement('div')
      gamepadItem.className = 'menu-item'
      gamepadItem.innerHTML = `g${index}`
      gamepadItem.gamepadIndex = index
      gamepadSelector.appendChild(gamepadItem)

      gamepadItem.addEventListener("click", function(e) {
        if (this.needClick === true) {  
          console.log("need click")        
          this.needClick = false
          e.preventDefault()
          
        } else {
          console.log(this.gamepadSelectionIndex)
          this.setGamepadSelectionIndex(index)
        }
      }.bind(this))
    }

    gameSelectorMenu.appendChild(gamepadSelector)
    this.setGamepadSelectionIndex(this.gamepadSelectionIndex)
    
    let actionSelector = document.createElement('div')
    actionSelector.className = 'action-selector'

    let close = document.createElement('div')
    close.className = 'menu-item'
    close.innerText ='X'
    close.addEventListener('click', () => {
      this.container.remove()
      var index = gameSelectors.indexOf(this)
      if (index > -1) {
        gameSelectors.splice(index, 1)
      }
      
    })
    let settings = document.createElement('div')
    settings.className = 'menu-item'
    settings.innerText ='?'
    settings.addEventListener('click', () => {
      let iframe = this.container.querySelector('.game-iframe')

      if (this.muted) {
        iframe.contentWindow.soundPlayer.pauseTune()
        this.muted = false
      } else {
        iframe.contentWindow.soundPlayer.resumeTune()
        this.muted = true
      }



      // soundPlayer.resumeTune()
    })

    let reload = document.createElement('div')
    reload.className = 'menu-item'
    reload.innerText ='R'
    reload.addEventListener('click', () => {
      this.reload()
    })

    actionSelector.appendChild(settings)
    actionSelector.appendChild(reload)
    actionSelector.appendChild(close)

    gameSelectorMenu.appendChild(actionSelector)

    this.container.appendChild(gameSelectorMenu)
  }



  setupGameSelector() {
    // game selector
    let gameSelector = document.createElement('div')
    gameSelector.classList.add('game-selector')
    gameSelector.gameSelectionIndex = 0

    for (let [index, game] of this.playlist.games.entries()) {
      let gameTitle = document.createElement('div')
      gameTitle.className = 'game-selector-item'
      gameTitle.innerHTML = game.title
      gameTitle.gameIndex = index
      
      if (index == 0) gameTitle.classList.add('selected') // set first selection
      
      gameSelector.appendChild(gameTitle)

      gameTitle.addEventListener("mouseenter", (e) => {
        if (this.container === document.activeElement) {
          this.setGameSelectionIndex(index)
        }
      })

      gameTitle.addEventListener("click", function(e) {
        if (this.needClick === true) {
          this.needClick = false
          e.preventDefault()
        } else {
          this.loadGame(index)
        }
      }.bind(this))
    }
    
    this.container.appendChild(gameSelector)
    gameSelector.firstChild.scrollIntoView()

    gameSelector.addEventListener('gamepadbutton', function(e) {
      console.log(e)
      if (e.detail.index == this.gamepadSelectionIndex) {
        if (e.detail.direction == "up" && e.detail.state == true) {
          this.setGameSelectionIndex(this.gameSelectionIndex-1)
        } else if (e.detail.direction == "down" && e.detail.state == true) {
          this.setGameSelectionIndex(this.gameSelectionIndex+1)
        } else if (e.detail.direction == "right" && e.detail.state == true) {
          this.loadGame(this.gameSelectionIndex)
        }
      }
      
    }.bind(this))
  }
  
  reload() {
    console.log('load playlist')

    this.container.style.width = this.playlist.settings.width
    this.container.style.height = this.playlist.settings.height

    // clear iframe if any
    while (this.container.firstChild) {
      this.container.removeChild(this.container.lastChild);
    }

    this.setupGameSelector()
    this.setupMenu()
    
  }
}

function getGamepadByIndex(index) {
  const gamepads = navigator.getGamepads()
  if (gamepads[index]) {
    return gamepads[index]
  } else {
    return null
  }
}

function Sound(source, volume, loop) {
  this.source = source
  this.volume = volume
  this.loop = loop
  var sound
  this.sound = sound
  this.finish = false
  this.stop = function() {
    document.body.removeChild(this.sound)
  }
  this.start = function() {
    if (this.finish) return false
    this.sound = document.createElement("embed")
    this.sound.setAttribute("src", this.source)
    this.sound.setAttribute("hidden", "true")
    this.sound.setAttribute("volume", this.volume)
    this.sound.setAttribute("autostart", "true")
    this.sound.setAttribute("loop", this.loop)
    document.body.appendChild(this.sound)
  }
  this.remove = function() {
    document.body.removeChild(this.sound)
    this.finish = true
  }
  this.init = function(volume, loop) {
    this.finish = false
    this.volume = volume
    this.loop = loop
  }
}

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
  }
}

function setup() {
  console.log("Hello Multy-Bitsy")
  
  var gamePads = new GamePads()
  gamePads.info()

  // load game playlist
  fetch('playlist.json')
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            playlist = data
            console.log(playlist.games)
            playlist.games.forEach((g,index) => {
              console.log(g)
              if (g.preload) {
                let gameContainer = new GameContainer(playlist)
                gameSelectors.push(gameContainer)
                document.getElementById('container').appendChild(gameContainer.getNode())
                gameContainer.loadGame(index)
              }
            });
            // let game = new GameContainer(playlist)
            // gameSelectors.push(game)

            // document.getElementById('container').appendChild(game.getNode())

            // let game2 = new GameContainer(playlist)
            // document.getElementById('container').appendChild(game2.getNode())

            // let game3 = new GameContainer(playlist)
            // document.getElementById('container').appendChild(game3.getNode())

            if (playlist.music) {
              var sound = new Sound(playlist.music, 100, true)
              //sound.start()
            }
        })
        .catch(function (err) {
          console.log('error: ' + err)
        });

  // window keydown event to iframes dispatcher (aka multi-bitsy)
  window.addEventListener("keydown", (e) => {
    let key = e.key.toUpperCase()

    if (key=== "F") {
      toggleFullScreen()
    }

    if (key=== "H") {
      document.getElementById('help').classList.toggle('hide')
    }

    if (key=== "A") {
      console.log("about")
      document.getElementById('about').classList.toggle('hide')
    }

    if (key == 'K') { 
      document.querySelectorAll(".game-iframe").forEach(element => {
        console.log('ok')
        element.contentWindow.reset_cur_game()
        element.contentWindow.startNarrating( "ARGG", false /*isEnding*/ );
      })
      e.preventDefault()
      return
    }

    if (key == 'B') {
      document.querySelectorAll(".game-iframe").forEach(element => {
        console.log('ok')
        element.contentWindow.startDialog("Hacked !")
      })

      e.preventDefault()
      return
    }
   
    // new game container
    if (key == 'N') { 
      let game = new GameContainer(playlist)
      gameSelectors.push(game)
      
      document.getElementById('container').appendChild(game.getNode())
    }

    if (key == 'R') { 
      gameSelectors.forEach((game) => 
        game.reload()
      )
    }
    
    let clonedEvent = {type: e.type,key: e.key,keyCode: e.keyCode,code: e.code,which: e.which}
    document.querySelectorAll(".game-iframe").forEach(element => {
      console.log('ok')
      element.contentWindow.postMessage(clonedEvent, "*")
    })
  })

  // window keyup event to iframes dispatcher (aka multi-bitsy)
  window.addEventListener("keyup", (e) => {
    let clonedEvent = {type: e.type,key: e.key,keyCode: e.keyCode,code: e.code,which: e.which}
    document.querySelectorAll(".game-iframe").forEach(element => {
      console.log('ok')
      element.contentWindow.postMessage(clonedEvent, "*")
    })
  })

  // dynamic ref to game containers
  games = document.getElementsByClassName("game-container")
}
