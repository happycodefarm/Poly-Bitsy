
const gamepads = {}
let bitsies = {}

function gamepadHandler(event, connected) {
  const gamepad = event.gamepad;
  console.log("ok")
  if (connected) {
    gamepads[gamepad.index] = gamepad;
    let iFrame = document.createElement("iframe")
    iFrame.setAttribute('src', `/games/game-${gamepad.index+1}.html`)
    iFrame.setAttribute('id', `bitsy-${gamepad.index+1}`)
    document.getElementById("container").appendChild(iFrame)

    iFrame.contentWindow.addEventListener("message", (message) => {
      let frankstEvent = new KeyboardEvent( message.data["type"], message.data )
      iFrame.contentWindow.document.dispatchEvent( frankstEvent )
      console.log(frankstEvent)
    })
  } else {
    delete gamepads[gamepad.index];
    document.getElementById(`bitsy-${gamepad.index+1}`).remove()
  }

  for (let i = 0; i < Object.keys(gamepads).length; i++) {
    console.log(i)
  }

}

function setup() {
  console.log("Hello Multy-Bitsy")
  console.log(!!(navigator.getGamepads))
  bitsies = document.getElementsByTagName("iframe")

  for (const iframe of bitsies) {
    iframe.contentWindow.addEventListener("message", (message) => {
    let frankstEvent = new KeyboardEvent( message.data["type"], message.data )
    iframe.contentWindow.document.dispatchEvent( frankstEvent )
    console.log(frankstEvent)
  }, false)}

  window.addEventListener("keydown", (e) => {
    //console.log(e)
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

  gameLoop()
}

function gameLoop() {
  console.log("ok")
  const gamePads = navigator.getGamepads();
  if (!gamePads) {
    return
  }

  gamePads.forEach((gamePad, index) => {

    // gamePad.buttons.map(e => e.pressed).forEach((isPressed, buttonIndex) => {
    //   if(isPressed) {
    //     console.log(`Button ${buttonIndex} is pressed`)
    //   }
    // })
    if (gamePad == null) return

    let right = gamePad.axes[1] > 0.5
    let left = gamePad.axes[1] < -0.5
    let up = gamePad.axes[2] < -0.5
    let down = gamePad.axes[2] > 0.5
    //console.log(gamePad.axes)

    if (up) {
      console.log('up')
      let event = {type:'keydown', key:'ArrowUp', keyCode:38, code:'ArrowUp', which:38 }
      bitsies[index].contentWindow.postMessage(event , "*");

      setTimeout(function(){ 
        event.type = 'keyup'
        bitsies[index].contentWindow.postMessage(event , "*");
       }, 200)

    } else if (down) {
      let event = {type:'keydown', key:'ArrowDown', keyCode:40, code:'ArrowDown', which:40 }
      bitsies[index].contentWindow.postMessage(event , "*")

      setTimeout(function(){ 
        event.type = 'keyup'
        bitsies[index].contentWindow.postMessage(event , "*");
       }, 200)

    } else if (right) {
      let event = {type:'keydown', key:'ArrowRight', keyCode:39, code:'ArrowRight', which:39 }
      bitsies[index].contentWindow.postMessage(event , "*");

      setTimeout(function(){ 
        event.type = 'keyup'
        bitsies[index].contentWindow.postMessage(event , "*");
       }, 200)

    } else if (left) {
      let event = {type:'keydown', key:'ArrowLeft', keyCode:37, code:'ArrowLeft', which:37 }
      bitsies[index].contentWindow.postMessage(event , "*");

      setTimeout(function(){ 
        event.type = 'keyup'
        bitsies[index].contentWindow.postMessage(event , "*");
       }, 200)  
    }
    // console.log(`Left stick at (${gamePad.axes[0]}, ${gamePad.axes[1]})` );
    // console.log(`Right stick at (${gamePad.axes[2]}, ${gamePad.axes[3]})` );
  })
  // requestAnimationFrame(gameLoop)
  setTimeout(gameLoop,100)
}
