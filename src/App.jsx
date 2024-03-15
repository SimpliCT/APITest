import { useState } from 'react'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator, Avatar } from '@chatscope/chat-ui-kit-react'
import logo from './assets/SimpliCT_logo.svg';
import AvatarLogo from './assets/SimpliCT_bot_icon.svg';
import userlogo from './assets/SimpliCT_user_icon.svg';
function App() {

  const [typing, setTyping] = useState(false)
  const [messages, setMessages] = useState([])

  const HandleSend = async (message) => {

    const newMessage = {
      model: {
        message: message,
        sender: 'user',
        direction: 'outgoing'
      },
      children: <Avatar name='You' src={userlogo} size='md'/>,
      avatarPosition: 'br'
    }

    const newMessages = [...messages, newMessage]

    //Update Message state
    setMessages(newMessages)

    //Show Typeindicator
    setTyping(true);

    await processMessageToChatGPT(newMessages);
  }

  async function processMessageToChatGPT(chatMesssages) {
  
    let apiMessages = chatMesssages.map((msg) => {
      console.log(msg);
      return {role:msg.model.sender, content:msg.model.message}
    });

    const systemMessage = {
      role: "system",
      content: "You are a tutor aiding help with learning computation thinking. Explain the computational thinking in terms that 15 year old would understand. You can be a bit sarcastic"
    }

    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages" : [
        systemMessage,
        ...apiMessages
      ]
    }
    await fetch('https://api.openai.com/v1/chat/completions', {
      method: "POST",
      headers: {
        "OpenAI-Organization": import.meta.env.VITE_ORG_KEY, //We use import.meta since we use VITE as server
        "Authorization" : "Bearer " + import.meta.env.VITE_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
    }).then((data) => {
      return data.json();
    }).then ((data) => {
      setMessages(
        [...chatMesssages, {
          model: {
            message: data.choices[0].message.content,
            sender: 'assistant',
            direction: 'incoming'
          },
          children: <Avatar name='SimpliCT' src={AvatarLogo} size='md'/>,
          avatarPosition:'bl'
        }]
      );
      setTyping(false);
    });
  }

  return (
    <div className='App'>
      <div className='topbar'>
        <img className='logo' src={logo} alt="" />
      </div>
        <MainContainer>
          <ChatContainer>
            <MessageList 
              scrollBehavior='auto'
              typingIndicator= {typing ? <TypingIndicator content="SimpliCT is typing"/>:null}>
              {messages.map((message, i) => {
                return <Message key={i} model={message.model} children={message.children} avatarPosition={message.avatarPosition} avatarSpacer={true}></Message>
              })}
            </MessageList>
            <MessageInput autoFocus={true} placeholder='Type message here' onSend={HandleSend}/> 
          </ChatContainer>
        </MainContainer> 
    </div>
  )
}

export default App
