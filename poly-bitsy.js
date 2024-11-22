/*
console.log(w)
console.log(bitsy.getGameData())
var world = parseWorld(bitsy.getGameData())
console.log(world)


console.log(bitsy.getGameData())
var world = parseWorld(bitsy.getGameData())
console.log(world)
console.log(state)

console.log(player)
//state.room = 2
world
names
room
//player().room = 3
//initRoom(3)
//player.room = 3
//player().x += 1
console.log(getSpriteLeft())

player().room = 1;
player().x = 1
player().y = 1
state.room = 1;
initRoom(1);




*/

// let playlist = {
//   "bitsies": [
//       {
//           "title": "Bitsybitsy",
//           "path": "/games/game-1.html",
//           "author": "Me",
//           "version": 1.0
//       },
//       {
//         "title": "Bitsybitsy again",
//         "path": "/games/game-2.html",
//         "author": "Cat",
//         "version": 2.0
//       },
//       {
//         "title": "more Bitsybitsy",
//         "path": "/games/game-3.html",
//         "author": "Dog",
//         "version": 1.1
//       },
//       {
//         "title": "more and more Bitsybitsy",
//         "path": "/games/game-4.html",
//         "author": "Bird",
//         "version": 1.1
//       },
//       {
//         "title": "last Bitsybitsy",
//         "path": "/games/game-5.html",
//         "author": "Mouse",
//         "version": 1.1
//       }
//   ]
// }

let bitsies = {} // bitsy games list
let gameSelectors = {} // game selectors

let playlist = {} // game playlist

// gamepads axes and buttons mapping
let gamepadAxesX = 1
let gamepadAxesY = 2
let gamepadButtonRight = 1
let gamepadButtonLeft = 3
let gamepadButtonUp = 0
let gamepadButtonDown = 2

// gamepads conection handler
function gamepadHandler(event, connected) {
  const gamepad = event.gamepad;
  
  if (connected) { // add a new iframe
    document.getElementById('blank').classList.add('hide')

    let bitsyContainer = document.createElement('div')
    bitsyContainer.setAttribute('id', `bitsy-${gamepad.index}`)
    bitsyContainer.className = 'bitsy-container'
   
    // let iframe = document.createElement("iframe")
    // let path = playlist.bitsies[gamepad.index].path
    // iframe.gamepadIndex = gamepad.index
    // iframe.setAttribute('src', path)
    // iframe.setAttribute('id', `iframe-${gamepad.index+1}`)

    // bitsyContainer.appendChild(iframe)

    let gameSelector = document.createElement('div')
    gameSelector.classList.add('bitsy', 'game-selector')
    gameSelector.gamepadIndex = gamepad.index
    gameSelector.selectionIndex = 0

    for (let [index, game] of playlist.bitsies.entries()) {
      let gameTitle = document.createElement('nav')
      gameTitle.className = 'game-selector-item'
      gameTitle.innerHTML = game.title
      gameTitle.gameIndex = index
      if (index == 0) gameTitle.classList.add('selected') // set first selection
      gameSelector.appendChild(gameTitle)

      gameTitle.addEventListener("click", function() {
        loadGame(gameSelector, index, gamepad.index)
      })
    }

    bitsyContainer.appendChild(gameSelector)

    document.getElementById('container').appendChild(bitsyContainer)

    // // inject message event listner to iframe content
    // iframe.contentWindow.addEventListener('message', (message) => {
    //   let frankstEvent = new KeyboardEvent( message.data["type"], message.data )
    //   iframe.contentWindow.document.dispatchEvent( frankstEvent )
    //   iframe.contentWindow.document.body.style.background = 'transparent'
    // })

  } else { // remove iframe
    document.getElementById(`bitsy-${gamepad.index}`).remove()
    if (document.getElementById('container').children.length==0) {
      document.getElementById('blank').classList.remove('hide')

    }
    // document.getElementById(`bitsy-${gamepad.index}`).classList.add('removed')
    // document.getElementById(`bitsy-${gamepad.index}`).addEventListener("transitionend", (event) => {
    //   document.getElementById(`bitsy-${gamepad.index}`).remove()
    // })
      
    //document.getElementById(`bitsy-${gamepad.index+1}`).remove() // remove iframe container
  }
}

function loadGame(selector, gameIndex, gamepadIndex) {
    let iframe = document.createElement("iframe")
    let path = playlist.bitsies[gameIndex].path
    iframe.gamepadIndex = gamepadIndex
    iframe.setAttribute('src', path)
    iframe.setAttribute('id', `iframe-${gamepadIndex}`)
    iframe.classList.add('bitsy', 'game-iframe')
    selector.replaceWith(iframe) // easy
    // inject message event listner to iframe content
    iframe.contentWindow.addEventListener('message', (message) => {
      let frankstEvent = new KeyboardEvent( message.data["type"], message.data )
      iframe.contentWindow.document.dispatchEvent( frankstEvent )
      iframe.contentWindow.document.body.style.background = 'transparent'
    })
}

function getGamepadByIndex(index) {
  const gamepads = navigator.getGamepads();
  
  if (gamepads[index]) {
    return gamepads[index];
  } else {
    return null;
  }
}

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
  }
}

function setup() {
  console.log("Hello Multy-Bitsy")
  
  // load game playlist
  fetch('playlist.json')
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            playlist = data
        })
        .catch(function (err) {
            console.log('error: ' + err);
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

    if (key == 'Q') { 
      for (const bitsy of bitsies) {
        bitsy.contentWindow.reset_cur_game()
        bitsy.contentWindow.startNarrating( "ARGG", false /*isEnding*/ );
      }
      e.preventDefault()
      return
    }
    if (key == 'B') {
      for (const bitsy of bitsies) {
        bitsy.contentWindow.startDialog("Hacked !")
      }
      e.preventDefault()
      return
    }
    if (key == 'N') { 
      for (const bitsy of bitsies) {
        bitsy.contentWindow.startNarrating( "ARGG", false /*isEnding*/ );
      }
      e.preventDefault()
      return
    }
    

    let clonedEvent = {type: e.type,key: e.key,keyCode: e.keyCode,code: e.code,which: e.which}
    for (const bitsy of bitsies) {
      bitsy.contentWindow?.postMessage(clonedEvent, "*")
    }
    e.preventDefault()
  })

  // window keyup event to iframes dispatcher (aka multi-bitsy)
  window.addEventListener("keyup", (e) => {
    let clonedEvent = {type: e.type,key: e.key,keyCode: e.keyCode,code: e.code,which: e.which}
    for (const bitsy of bitsies) {
      bitsy.contentWindow?.postMessage(clonedEvent, "*")
    }
    e.preventDefault()
  })

  // gamepad connection event handler
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

  // dynamic ref to iframes and gameSelectors
  bitsies = document.getElementsByClassName("bitsy")
  gameLoop() // start the game loop
}

function gameLoop() {

  // if (navigator.getGamepads()[0]) {
  //   let debug =   navigator.getGamepads()[0].axes[0].toString() + ", " + navigator.getGamepads()[0].axes[1].toString()// + ", " + navigator.getGamepads()[0].axes[2].toString()
  //   document.getElementById("debug").innerText =debug
  // }
//   console.log(w)
// console.log(bitsy.getGameData())
// var world = parseWorld(bitsy.getGameData())
// console.log(world)

  // let data = JSON.stringify(bitsies[0]?.contentWindow?.bitsy, null, 2)
  // let state = JSON.stringify(bitsies[0]?.contentWindow?.state, null, 2) ?? "null"

  // document.getElementById("debug").innerText = state

  // handle gamepads inputs for all the bitsies (aka poly-bitsy)
  for (let bitsy of bitsies) {
        
    let gamepad = getGamepadByIndex(bitsy.gamepadIndex)
    if (gamepad == null) {
      //console.log("nopad")
      continue
    }

    bitsy.right = gamepad.axes[gamepadAxesX] > 0.75 ||  gamepad.buttons[gamepadButtonRight].pressed
    bitsy.left = gamepad.axes[gamepadAxesX] < -0.75 ||  gamepad.buttons[gamepadButtonLeft].pressed
    bitsy.up = gamepad.axes[gamepadAxesY] < -0.75   ||  gamepad.buttons[gamepadButtonUp].pressed
    bitsy.down = gamepad.axes[gamepadAxesY] > 0.75  ||  gamepad.buttons[gamepadButtonDown].pressed

    if (bitsy.up && !bitsy.waitx) { // up direction
      bitsy.waitx = true

      if (bitsy.classList.contains('game-selector')) {
        
        bitsy.selectionIndex -= 1
        if (bitsy.selectionIndex < 0) bitsy.selectionIndex = bitsy.childNodes.length -1
        console.log(bitsy.selectionIndex)
        for (title of bitsy.childNodes) {
          if (title.gameIndex == bitsy.selectionIndex) {
            title.classList.add('selected')
          } else {
            title.classList.remove('selected')
          }
        }

        setTimeout(function(){ 
          bitsy.waitx = false
         }, 250)

      } else {
        let event = {type:'keydown', key:'ArrowUp', keyCode:38, code:'ArrowUp', which:38 }
        bitsy?.contentWindow?.postMessage(event , "*"); // send keydown event
  
        setTimeout(function(){ 
          event.type = 'keyup'
          bitsy?.contentWindow?.postMessage(event , "*"); // send keyup event
         }, 100)
         
        setTimeout(function(){ 
          bitsy.up = false
          bitsy.waitx = false
         }, 200)
      }

    } else if (bitsy.down && !bitsy.waitx) { // down direction
      bitsy.waitx = true

      if (bitsy.classList.contains('game-selector')) {
        
        bitsy.selectionIndex += 1
        if (bitsy.selectionIndex >= bitsy.childNodes.length) bitsy.selectionIndex = 0

        console.log(bitsy.selectionIndex)
        for (title of bitsy.childNodes) {
          if (title.gameIndex == bitsy.selectionIndex) {
            title.classList.add('selected')
          } else {
            title.classList.remove('selected')
          }
        }

        setTimeout(function(){ 
          bitsy.waitx = false
         }, 250)

      } else {
        let event = {type:'keydown', key:'ArrowDown', keyCode:40, code:'ArrowDown', which:40 }
        bitsy?.contentWindow?.postMessage(event , "*")

        setTimeout(function(){ 
          event.type = 'keyup'
          bitsy?.contentWindow?.postMessage(event , "*");
        }, 100)

        setTimeout(function(){
          bitsy.down = false
          bitsy.waitx = false
        }, 200)
      }
    } else if (bitsy.right && !bitsy.waitx) { // right direction
      bitsy.waitx = true
      if (bitsy.classList.contains('game-selector')) {

        loadGame(bitsy, bitsy.selectionIndex, bitsy.gamepadIndex)

        setTimeout(function(){ 
          bitsy.waitx = false
         }, 500)

      } else {
        let event = {type:'keydown', key:'ArrowRight', keyCode:39, code:'ArrowRight', which:39 }
        bitsy?.contentWindow?.postMessage(event , "*");
        
        setTimeout(function(){ 
          event.type = 'keyup'
          bitsy?.contentWindow?.postMessage(event , "*");
        }, 100)
  
        setTimeout(function(){
          bitsy.right = false
          bitsy.waitx = false
         }, 200)
      }
      
    } else if (bitsy.left && !bitsy.waitx) { // left direction
      let event = {type:'keydown', key:'ArrowLeft', keyCode:37, code:'ArrowLeft', which:37 }
      bitsy?.contentWindow?.postMessage(event , "*");
      bitsy.waitx = true

      setTimeout(function(){ 
        event.type = 'keyup'
        bitsy?.contentWindow?.postMessage(event , "*");
      },100)

      setTimeout(function(){ 
        bitsy.left = false
        bitsy.waitx = false
       }, 200)  
    }
  }
   requestAnimationFrame(gameLoop)
  //setTimeout(gameLoop,50)
}
