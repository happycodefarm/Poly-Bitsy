
let bitsies = {} // bitsy games list

// gamepads axes mapping
let gamepadAxesX = 1
let gamepadAxesY = 2


// gamepads conection handler
function gamepadHandler(event, connected) {
  const gamepad = event.gamepad;
  
  if (connected) {
    let iframeContainer = document.createElement("div")
    iframeContainer.setAttribute('id', `bitsy-${gamepad.index+1}`)
    iframeContainer.className = 'bitsy-container'
    let iframe = document.createElement("iframe")
    iframe.gamepadIndex = gamepad.index
    iframe.setAttribute('src', `/games/game-${gamepad.index+1}.html`)
    iframe.setAttribute('id', `iframe-${gamepad.index+1}`)
    iframeContainer.appendChild(iframe)
    document.getElementById("container").appendChild(iframeContainer)

    iframe.contentWindow.addEventListener("message", (message) => {
      let frankstEvent = new KeyboardEvent( message.data["type"], message.data )
      iframe.contentWindow.document.dispatchEvent( frankstEvent )
      iframe.contentWindow.document.body.style.background = 'transparent'

      //console.log(frankstEvent)
    })

    // bitsies = document.getElementsByTagName("iframe")
    // bitsies.push

  } else {
    // delete gamepads[gamepad.index];
    document.getElementById(`bitsy-${gamepad.index+1}`).remove() // remove iframe container
    // bitsies = document.getElementsByTagName("iframe")
  }
}

function getGamepadByIndex(index) {
  const gamepads = navigator.getGamepads();
  
  if (gamepads[index]) {
      return gamepads[index];
  } else {
     // console.log(`No gamepad found at index ${index}`);
      return null;
  }
}

function setup() {
  console.log("Hello Multy-Bitsy")
  
  window.addEventListener("keydown", (e) => {
    let clonedEvent = {type: e.type,key: e.key,keyCode: e.keyCode,code: e.code,which: e.which}
    for (const iframe of bitsies) {
      iframe.contentWindow.postMessage(clonedEvent, "*")
    }
    e.preventDefault()
  })

  window.addEventListener("keyup", (e) => {

    let clonedEvent = {type: e.type,key: e.key,keyCode: e.keyCode,code: e.code,which: e.which}
    for (const iframe of bitsies) {
      iframe.contentWindow.postMessage(clonedEvent, "*")
    }
    e.preventDefault()
  })

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
  
  window.addEventListener("gamepaddisconnected", (e) => {
    console.log(
      "Gamepad disconnected from index %d: %s",
      e.gamepad.index,
      e.gamepad.id,
    )
    gamepadHandler(e, false)
  })
  bitsies = document.getElementsByTagName("iframe")

  gameLoop() // start the game 
}

function gameLoop() {

  if (navigator.getGamepads()[0]) {
    let debug =   navigator.getGamepads()[0].axes[0].toString() + ", " + navigator.getGamepads()[0].axes[1].toString()// + ", " + navigator.getGamepads()[0].axes[2].toString()
    document.getElementById("debug").innerText =debug
  }
  // gamePads.forEach((gamePad, index) => {
    //bitsies.forEach((bitsy, index) => {
    //if (bitsies[index] == undefined) return
    // gamePad.buttons.map(e => e.pressed).forEach((isPressed, buttonIndex) => {
    //   if(isPressed) {
    //     console.log(`Button ${buttonIndex} is pressed`)
    //   }
    // })
    // if (gamePad == null) return
 
  for (let bitsy of bitsies) {

    // bitsy.gamepad.buttons.map(e => e.pressed).forEach((isPressed, buttonIndex) => {
    //   if(isPressed) {
    //     console.log(`Button ${buttonIndex} is pressed`)
    //   }
    // })
    //console.log(bitsy.waitx)
    

    if (bitsy.contentWindow == null) return
    let gamepad = getGamepadByIndex(bitsy.gamepadIndex)
    if (gamepad == null) return

    bitsy.right = gamepad.axes[gamepadAxesX] > 0.75 ||  gamepad.buttons[1].pressed
    bitsy.left = gamepad.axes[gamepadAxesX] < -0.75 ||  gamepad.buttons[3].pressed
    bitsy.up = gamepad.axes[gamepadAxesY] < -0.75 ||  gamepad.buttons[0].pressed
    bitsy.down = gamepad.axes[gamepadAxesY] > 0.75 ||  gamepad.buttons[2].pressed

   //console.log(navigator.getGamepads())
    if (bitsy.up && !bitsy.waitx) {
      
      let event = {type:'keydown', key:'ArrowUp', keyCode:38, code:'ArrowUp', which:38 }
      bitsy?.contentWindow?.postMessage(event , "*");
      bitsy.waitx = true

      setTimeout(function(){ 
        event.type = 'keyup'
        bitsy?.contentWindow?.postMessage(event , "*");
       }, 100)
       
      setTimeout(function(){ 
        bitsy.up = false
        bitsy.waitx = false
       }, 200)

    } else if (bitsy.down && !bitsy.waitx) {
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

    } else if (bitsy.right && !bitsy.waitx) {
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

    } else if (bitsy.left && !bitsy.waitx) {
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
    // console.log(`Left stick at (${gamePad.axes[0]}, ${gamePad.axes[1]})` );
    // console.log(`Right stick at (${gamePad.axes[2]}, ${gamePad.axes[3]})` );
  }
   requestAnimationFrame(gameLoop)
  //setTimeout(gameLoop,50)
}
