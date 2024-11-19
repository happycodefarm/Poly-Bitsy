
const gamepads = {}
let  bitsies = {}

function gamepadHandler(event, connected) {
  console.log("ok")
  const gamepad = event.gamepad;
  // Note:
  // gamepad === navigator.getGamepads()[gamepad.index]

  if (connected) {
    gamepads[gamepad.index] = gamepad;
  } else {
    delete gamepads[gamepad.index];
  }
}

function setup() {

  console.log("Hello Multy-Bitsy")

  bitsies = document.getElementsByTagName("iframe")
  console.log( bitsies)
  window.addEventListener("keydown", (e) => {
    console.log(e)
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

  var iframes = document.getElementsByTagName("iframe");
  /** This function is triggered whenever there\'s an input
  * on the page.
  *
  * It creates a message to post to every iframes
  * This message is a cloned KeyboardEvent
  **/  
  function triggerControl(e) {  
    let clonedEvent = { type: e.type, key: e.key, keyCode: e.keyCode, code: e.code, which: e.which };
    for (const iframe of iframes) { 
      iframe.contentWindow.postMessage(clonedEvent, "*");
    } 
  }

  gameLoop()
}

function gameLoop() {
  const gamePads = navigator.getGamepads();
  if (!gamePads) {
    return
  }

  gamePads.forEach((gamePad, index) => {
    gamePad.buttons.map(e => e.pressed).forEach((isPressed, buttonIndex) => {
      if(isPressed) {
        console.log(`Button ${buttonIndex} is pressed`)
      }
    })
    let right = gamePad.axes[1] == 1
    let left = gamePad.axes[1] == -1
    let up = gamePad.axes[2] == -1
    let down = gamePad.axes[2] == 1

    if (up) {
      console.log("Up arrow key is pressed")
      bitsies[index].dispatchEvent(new KeyboardEvent('keypress',{'key':'ArrowUp','charCode':0, 'keyCode':38, 'wich':38 }))
    
    } else if (down) {
      console.log("Down arrow key is pressed")
      bitsies[index].dispatchEvent(new KeyboardEvent('keypress',{'key':'ArrowUp','charCode':0, 'keyCode':40, 'wich':40 }))

    } else if (right) {
      console.log("Right arrow key is pressed")
      bitsies[index].dispatchEvent(new KeyboardEvent('keypress',{'key':'ArrowUp','charCode':0, 'keyCode':39, 'wich':39 }))

    } else if (left) {
      console.log("Left arrow key is pressed")
      bitsies[index].dispatchEvent(new KeyboardEvent('keypress',{'key':'ArrowUp','charCode':0, 'keyCode':37, 'wich':37 }))

    }
    // console.log(`Left stick at (${gamePad.axes[0]}, ${gamePad.axes[1]})` );
    // console.log(`Right stick at (${gamePad.axes[2]}, ${gamePad.axes[3]})` );
  })
  start = requestAnimationFrame(gameLoop);
}
