import { useState } from 'react';
import Modal from 'react-modal';
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator, Avatar } from '@chatscope/chat-ui-kit-react'
import logo from './assets/SimpliCT_logo.svg';
import AvatarLogo from './assets/SimpliCT_bot_icon.svg';
import userlogo from './assets/SimpliCT_user_icon.svg';

Modal.setAppElement('#root');

const systemMessage = {
  role: "system",
  content: ""
};

/* TODO: Disable modal closing when clicking outside.
   TODO: Remove border on modal.
   TODO: Make user choose their experience/knowledge level after choosing field.
         Figure out how to enable new prompt for this.
*/

function App() {

  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(true);

  // function handleCloseModal(systemMessageString) {
  function handleCloseModal() {  
    systemMessage.content = "You are a tutor aiding help with teaching computation thinking.";
    // switch(systemMessageString) {
    //   case "ComputerScience":
    //     systemMessage.content = "Start every message with 'CS:'.";
    //     break;
    //   case "Health":
    //     systemMessage.content = "Start every message with 'Health:'.";
    //     break;
    //   case "Politics":
    //     systemMessage.content = "Start every message with 'Politics:'.";
    //     break;
    //   case "Other":
    //     systemMessage.content = "You are a tutor aiding help with teaching computation thinking."; // Explain it in terms that a 15 year old would understand. You can be a bit sarcastic";
    //     break;
    // }

    setIsOpen(false); //Closes modal after picking field
  }

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

  async function processMessageToChatGPT(chatMessages) {
    let apiMessages = chatMessages.map((msg) => {
      console.log(msg);
      return {role:msg.model.sender, content:msg.model.message}
    });

    const apiRequestBody = {
      "model": "ft:gpt-3.5-turbo-0125:simplict::9ICV7ZpR",
      // "model": "gpt-3.5-turbo",
      // "model": "gpt-4-turbo-preview",
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
      console.log(data);
      setMessages(
        [...chatMessages, {
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
                // eslint-disable-next-line react/no-children-prop
                return <Message key={i} model={message.model} children={message.children} avatarPosition={message.avatarPosition} avatarSpacer={true}></Message>
              })}
            </MessageList>
            <MessageInput autoFocus={true} placeholder='Type message here' onSend={HandleSend}/> 
          </ChatContainer>
        </MainContainer> 
        <Modal 
          className='Modal'
          overlayClassName='ModalOverlay'
          isOpen={modalIsOpen}
          onRequestClose={handleCloseModal}
          contentLabel="Initial Question Overlay"
        >
          <h2>Please state the field in which you work</h2>
          <div className='grid2x2'>
            <div className="box box1"><button onClick={() => handleCloseModal("ComputerScience")}>Computer Science</button></div>
            <div className="box box2"><button onClick={() => handleCloseModal("Health")}>Health</button></div>
            <div className="box box3"><button onClick={() => handleCloseModal("Politics")}>Politics</button></div>
            <div className="box box4"><button onClick={() => handleCloseModal("Other")}>Some Other Stuff</button></div>
          </div>

        </Modal>
    </div>
  )
}



export default App
