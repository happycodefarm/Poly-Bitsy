
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

    for (game of playlist.bitsies) {
      let gameTitle = document.createElement('nav')
      gameTitle.className = 'game-title'
      gameTitle.innerHTML = game.title
      gameSelector.appendChild(gameTitle)

      gameTitle.addEventListener("click", function() {
        loadGame(gameSelector, 0, 0)
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
    document.getElementById(`bitsy-${gamepad.index}`).classList.add('removed')
    document.getElementById(`bitsy-${gamepad.index}`).addEventListener("transitionend", (event) => {
      document.getElementById(`bitsy-${gamepad.index}`).remove()
    })
      
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

function setup() {
  console.log("Hello Multy-Bitsy")
  
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
  // gameSelectors = document.getElementsByClassName('game-selector')
  //bitsies = document.querySelectorAll('iframe', '.game-selector')
  gameLoop() // start the game loop
}

function gameLoop() {

  if (navigator.getGamepads()[0]) {
    let debug =   navigator.getGamepads()[0].axes[0].toString() + ", " + navigator.getGamepads()[0].axes[1].toString()// + ", " + navigator.getGamepads()[0].axes[2].toString()
    document.getElementById("debug").innerText =debug
  }
 
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
     
      if (bitsy.classList['game-selector']) {
        console.log("sele")
      } else {
        let event = {type:'keydown', key:'ArrowUp', keyCode:38, code:'ArrowUp', which:38 }
        bitsy?.contentWindow?.postMessage(event , "*"); // send keydown event
        bitsy.waitx = true
  
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
      let event = {type:'keydown', key:'ArrowDown', keyCode:40, code:'ArrowDown', which:40 }
      bitsy?.contentWindow?.postMessage(event , "*")
      bitsy.waitx = true

      setTimeout(function(){ 
        event.type = 'keyup'
        bitsy?.contentWindow?.postMessage(event , "*");
      }, 100)

      setTimeout(function(){
        bitsy.down = false
        bitsy.waitx = false
       }, 200)

    } else if (bitsy.right && !bitsy.waitx) { // right direction
      let event = {type:'keydown', key:'ArrowRight', keyCode:39, code:'ArrowRight', which:39 }
      bitsy?.contentWindow?.postMessage(event , "*");
      bitsy.waitx = true

      setTimeout(function(){ 
        event.type = 'keyup'
        bitsy?.contentWindow?.postMessage(event , "*");
      }, 100)

      setTimeout(function(){
        bitsy.right = false
        bitsy.waitx = false
       }, 200)

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
