import { useState } from 'react'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react'

function App() {

  const [typing, setTyping] = useState(false)
  const [messages, setMessages] = useState([])

  const HandleSend = async (message) => {

    const newMessage = {
      message: message,
      sender: 'user',
      direction: 'outgoing'
    }

    const newMessages = [...messages, newMessage]

    //Update Message state
    setMessages(newMessages)

    //Show Typeindicator
    setTyping(true);

    await processMessageToChatGPT(newMessages);
  }

  async function processMessageToChatGPT(chatMesssages) {
    let role = "";
    let apiMessages = chatMesssages.map((msg) => {
      if (msg.sender === "ChatGPT") {
        role = "assistant"
      }else{
        role = "user"
      }
      return {role:role, content:msg.message}

    });

    const systemMessage = {
      role: "system",
      content: "You are a tutor aiding help with learning computation thinking"
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
          message: data.choices[0].message.content,
          sender: "ChatGPT",
          direction: "incoming"
        }]
      );
      setTyping(false);
    });
  }

  return (
    <div className='App'>
      <div className='bot' style={{position:'relative', height:'600px', width:'700px'}}>
        <MainContainer className='bot2'>
          <ChatContainer>
            <MessageList 
              scrollBehavior='smooth'
              typingIndicator= {typing ? <TypingIndicator content="SimpliCT is typing"/>:null}>
              {messages.map((message, i) => {
                return <Message key={i} model={message}></Message>
              })}
            </MessageList>
            <MessageInput placeholder='Type message here' onSend={HandleSend}/>
          </ChatContainer>
        </MainContainer> 

      </div>

    </div>
  )
}

export default App
