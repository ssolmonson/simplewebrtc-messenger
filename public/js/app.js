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
  cosnt localVideoEl = $('#local-video')

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
})
