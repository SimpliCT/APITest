# SimpliCT

This chatbot makes use of thirdparty [plugins](#plugins)


## Content
- [Installation](#installation)
- [Run](#run)
- [Plugins](#plugins)

### Installation

   #### Clone repository
  ```
  git clone 
  ```
   #### IMPORTANT Environment variables
   This plugin uses the ChatGPT API. The API Keys should be stored in the `.env` file in the root directory.

  Initialy the files looks like this:
  ```
  VITE_API_KEY=
  VITE_ORG_KEY=
  ```
  _Do not rename the values, as this will cause errors when running the bot_.
    
  ##### Get API key

  1. Log in to [ChatGPT AI Platform](https://platform.openai.com/)
  2. Go to `ApiKeys`
  4. Generate a new API Key (name it whatever you want)
     
  #### Install dependencies
  `cd` into the repository and run 
  ```
  npm install
  ```
### Run
  With installation completed you can run the bot using
  ```
  npm run dev
  ```

### Plugins
- [Chatscope-UI-KIt](https://github.com/chatscope/chat-ui-kit-react)
  
