window.addEventListener('load', () => {
  // Put all client-side code here

  // Chat platform
  const chatTemplate = Handlebars.compile($('#chat-template').html())
  const chatContentTemplate = Handlebars.compile($('#chat-content-template').html())
  const chatEL = $('#chat')
  const formEl = $('.form')
  const messages =[]
  let username

  // Local Video
  const localImageEl = $('#local-image')
  const localVideoEl = $('#local-video')

  //Remote Videos
  const remoteVideoTemplate = Handlebars.compile($('#remote-video-template').html())
  const remoteVideosEl = $('#remote-videos')
  let remoteVideosCount = 0

  // Add validation rules to Create/Join Room Form
  formEl.form({
    fields: {
      roomName: 'empty',
      username: 'empty'
    },
  })

  // Create WebRTC connection
  const webrtc = new SimpleWebRTC({
    // the id/element dom element that will hold the local video
    localVideoEl: 'local-video',
    // the id/element dom element that will hold remote videos
    remoteVideosEl: 'remote-videos',
    // immediately ask for camera access
    autoRequestMedia: true,
  })

  // We have access to the local camera
  webrtc.on('localStream', () => {
    localImageEl.hide()
    localVideoEl.show()
  })

  // Update chat messages
  const updateChatMessages = () => {
    const html = chatContentTemplate({ messages });
    const chatContentEl = $('#chat-content');
    chatContentEl.html(html);
    // automatically scroll downwards
    const scrollHeight = chatContentEl.prop('scrollHeight');
    chatContentEl.animate({ scrollTop: scrollHeight }, 'slow');
  };

  // Post local message
  const postMessage = (message) => {
    const chatMessage = {
      username,
      message,
      postedOn: new Date().toLocaleString('en-GB')
    }
    // Send to all peers
    webrtc.sendToAll('chat', chatMessage)
    // Update messages locally
    messages.push(chatMessage)
    $('#post-message').val('')
    updateChatMessages()
  }

  //Display chat interface
  const showChatRoom = (room) => {
    //Hide form
    formEl.hide()
    const html = chatTemplate({ room })
    chatEl.html(html)
    const postForm = $('form')
    // Post message validation rules
    postForm.form({
      message: 'empty'
    })
    $('#post-btn').on('click', () => {
      const message = $('#post-message').val()
      postMessage(message)
    })
    $('#post-message').on('keyup', (event) => {
      if (event.keyCode === 13) {
        const message = $('#post-message').val()
        postMessage(message)
      }
    })
  }

  // Register new chat room
  const createRoom = (roomName) => {
    console.info(`Creating new room: ${roomName}`)
    webrtc.createRoom(roomName, (err, name) => {
      showChatRoom(name)
      postMessage(`${username} created chatroom`)
    })
  }

  //Join existing chat room
  const joinRoom = (roomName) => {
    console.log(`Joining Room: ${roomName}`)
    webetc.joinRoom(roomName)
    showChatRoom(roomName)
    postMessage(`${username} joined chatroom`)
  }
  // Room sumbit button handler
  $('.submit').on('click', (event) => {
    if (!formEl.form('is valid')) {
      return false
    }
    username = $('#username').val()
    const roomName = $('#roomName').val().toLowerCase()
    if (event.target.id === 'create-btn') {
      createRoom(roomName)
    } else {
      joinRoom(roomName)
    }
    return false
  })
})
