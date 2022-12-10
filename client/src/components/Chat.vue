<script>
import axios from "axios";
import SendIcon from 'vue-material-design-icons/Send.vue';
import RefreshIcon from 'vue-material-design-icons/Refresh.vue';
import EditIcon from 'vue-material-design-icons/Pencil.vue';
import InformationIcon from 'vue-material-design-icons/InformationOutline.vue';

import TypingAnimation from './TypingAnimation.vue';

export default {
  components: {
    SendIcon,
    RefreshIcon,
    EditIcon,
    TypingAnimation,
    InformationIcon
  },
  data: () => ({
    axios,
    chatHistory: [
      {
        id: 1,
        text: 'Hi. How can I help you?',
        author: 'bot',
        showWarning: false,
      },
    ],
    loading: false,
    sessionStarted: false,
    userMessageText: '',
    hasPendingWarning: false,
    displayingEmergencyScreen: false
  }),
  computed: {
  },
  methods: {
    /**
     * Scrolls down
     */
    scrollDown() {
      window.scrollTo(0, document.body.scrollHeight);
      setTimeout(() => {
        window.scrollTo(0, document.body.scrollHeight);
      }, 75);
      setTimeout(() => {
        window.scrollTo(0, document.body.scrollHeight);
      }, 150);
    },

    /**
     * Sends a new message
     */
    async send() {
      this.sessionStarted = true;
      this.saveNewUserMessage();
      this.loading = true;
      axios.post(`http://0.0.0.0:1110/conversation/response/create`, {
        conversation: this.chatHistory
      }).then(response => {
        this.loading = false;
        console.log(response.data.response.text);
        this.saveNewBotMessage(response.data.response.text, this.hasPendingWarning);
      }).catch(e => {
        this.loading = false;
        console.log(e);
      });
    },

    /**
     * Checks text safety
     * @param text
     * @returns {Promise<void>}
     */
    async checkTextSafety(text) {
      axios.post(`http://0.0.0.0:1110/classification/text/safety/classify`, {
        text: text.trim()
      }).then(response => {
        const tags = response.data.data.classifiedTags;
        if (tags.includes('hasUnsafeContent') || tags.includes('hasSensitiveContent') || tags.includes('hasEmergencySituationContent')) {
          if (this.loading) {
            this.hasPendingWarning = true;
          } else {
            let botMessages = this.chatHistory.filter(message => message.author === 'bot');
            botMessages[botMessages.length - 1].showWarning = true;
          }
        }

        if (tags.includes('hasEmergencySituationContent')) {
          this.showEmergencyScreen();
        }

      }).catch(e => {
        console.log(e);
      });
    },

    /**
     * Shows emergency screen
     */
    showEmergencyScreen() {
      this.displayingEmergencyScreen = true;
    },

    /**
     * Returns new message id
     * @returns {string}
     */
    getNewMessageId() {
      return `${Math.round(Math.random()*1000)}${this.chatHistory.length}${Date.now()}`;
    },

    async retry() {
      this.chatHistory = this.chatHistory.slice(0, this.chatHistory.length - 1);
      await this.send();
    },

    /**
     * Saves new bot message
     * @param text
     * @param showWarning
     */
    saveNewBotMessage(text, showWarning = false) {
      this.chatHistory.push({
        author: 'bot',
        text,
        id: this.getNewMessageId(),
        showWarning
      });

      if (showWarning) {
        this.hasPendingWarning = false;
      } else {
        this.checkTextSafety(text);
      }

      this.scrollDown();
    },

    /**
     * Adds user message to the chat history
     */
    saveNewUserMessage() {
      let userMessageText = this.userMessageText.trim();

      if (userMessageText) {
        this.chatHistory.push({
          text: userMessageText,
          author: 'user',
          id: this.getNewMessageId()
        });

        this.checkTextSafety(userMessageText);

        this.userMessageText = '';

        this.scrollDown();
      }
      },

      /**
       * Returns message that has given id
       */
      getMessageById(id) {
        let messageCandidates = this.chatHistory.filter(message => message.id === id);
        return messageCandidates[0];
      },

    /**
     * Returns message position by id
     * @param id
     * @returns {number}
     */
      getMessagePositionById(id) {
        for (let position = 0; position < this.chatHistory.length; position++) {
          if (this.chatHistory[position].id === id) return position;
        }
      },

    /**
     * Allows to edit message
     * @param id
     */
      editMessage(id) {
        const message = this.getMessageById(id);
        const messageText = message.text;
        const messagePosition = this.getMessagePositionById(id);
        this.userMessageText = messageText;
        this.chatHistory = this.chatHistory.slice(0, messagePosition);
      },

    /**
     * Allows to edit message
     * @param id
     */
    retryMessage(id) {
      const messagePosition = this.getMessagePositionById(id);
      this.chatHistory = this.chatHistory.slice(0, messagePosition + 1);
      this.retry();
    }
  },
  mounted() {
  }
}
</script>

<template>
  <v-dialog
      fullscreen
      transition="dialog-bottom-transition"
      v-model="displayingEmergencyScreen"
      class="bottomSheetOverlay"
  >
    <div class="bottomSheet text-center">
      <div class="title">Are you in crisis?</div>
      <div class="content">
        <p>You are not alone. Help is just a call away.</p>
        <p>
          If you are dealing with abuse, trauma, or crisis, Elomia is not enough. It is important that you talk to a person you feel safe sharing your problems with. If there is no one, call one of the helplines below. Things will get better.
        </p>
      </div>
      <div class="controls">
          <v-btn color="black" size="x-large" block href="https://en.wikipedia.org/wiki/List_of_suicide_crisis_lines">

            Crisis Helplines</v-btn>
          <v-btn color="black" class="mt-4" size="x-large" block @click="displayingEmergencyScreen = false">

            I am okay</v-btn>
      </div>
    </div>
  </v-dialog>
  <div class="session">
    <div class="chatHistory">
      <template v-for="(message, index) in chatHistory">
        <div :class="{
          message: true,
          received: message.author === 'bot',
          sent: message.author === 'user',
        }">
            <div :class="{
              avatar: true,
              bot: message.author === 'bot',
              user:  message.author === 'user'
            }"></div>

            <div class="text">
              {{message.text}}
              <div class="warning" v-if="message.showWarning && index === chatHistory.length - 1">
                <div class="title">Warning</div>
                <div class="text">AI can produce wrong responses and is not intended to be a substitute for in-person assistance, medical intervention, or crisis service.</div>
              </div>
            </div>

            <div class="controls">
              <div class="control" v-if="message.author === 'user'">
                <button class="button editButton" @click="editMessage(message.id)">
                  <EditIcon/>
                </button>
                </div>
              <div class="control" v-if="message.author === 'bot'">
                <button class="button retryButton" @click="retryMessage(message.id)">
                  <RefreshIcon/>
                </button>
              </div>
            </div>
        </div>
      </template>
      <div v-if="loading">
        <div class="message received">
          <div class="avatar bot"></div>
          <div class="text">
            <TypingAnimation/>
          </div>
        </div>
      </div>
    </div>
    <div class="bottomContainer">
      <button v-if="sessionStarted && !loading" @click="retry" class="retry">
        <refresh-icon /> Try again
      </button>
      <button v-if="!sessionStarted" @click="showGuide" class="retry">
        <information-icon /> How to use it?
      </button>
      <div>
      <div class="inputContainer">
        <v-textarea @click:appendInner="send()" v-model="userMessageText" variant="solo" auto-grow no-resize rows="1" append-inner-icon="mdi-send"></v-textarea>
      </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.session {


  .chatHistory {
    padding: {
      top: 1.25rem;
      left: 1.25rem;
      right: 1.25rem;
      bottom: 220px;
    }

    margin: 0 auto;
    max-width: 48rem;

    .message {
      width: fit-content;
      margin: 0.85rem 0;
      display: flex;
      white-space: pre-line;

      .controls {

        .control {
          padding-left: 1rem;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;


          .button {
            border: 0;
            border-radius: 100%;
            color: #727272;
            font-size: 0;
            padding: 0.5rem;
            margin: 0;
            max-height: 50px;
            max-width: 50px;
            background: #f4ece7;


            &:hover {
              background: #f3e2d7;
              cursor: pointer;
              color: black;
            }

            &:active {
              opacity: 0.5;
              cursor: pointer;
            }
          }
        }
      }

      .avatar {
        &.bot {
          width: 100%;
          max-width: 2rem;
          height: 2rem;
          border-radius: 100%;
          background: #fa9874;
        }
      }

      .text {
        padding: 0.5rem .875rem;
        border-radius: 0.85rem;
        display: block;
      }

      &.sent {
        margin-left: auto;
        max-width: min(40rem, 75%);

        .text {
          background: #fcd5c6;
          color: #642b19;
        }
      }

      &.received {
        max-width: min(40rem, 95%);
        margin-right: auto;

        &:last-of-type {
          flex-direction: column;
          max-width: 100%;
          padding-top: 1.5rem;
          padding-bottom: 1.5rem;

          .avatar {
            width: 100%;
            max-width: 3rem;
            height: 3rem;
          }

          .controls {
            display: none;
          }

          .warning {
            font-size: 0.9rem;
            margin-top: 1rem;
            padding: 1rem;
            border-radius: 0;
            background: rgba(241, 230, 224, 0.66);

            .title {
              font-weight: bold;
              color: #bf8765;
            }

            .title, .text {
              font-size: 0.9rem;
            }

            .text {
              margin-top: 0.25rem;
            }
          }

          .text {
            background: none;
            font-size: 1.25rem;
            margin-left: 0;
            padding: 0;
            margin-top: 1rem;
          }
        }

        .text {
          background: #fff;
          margin-left: 10px;
        }
      }
    }
  }

  .bottomContainer {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    padding: {
      top: 1.25rem;
      left: 1.25rem;
      right: 1.25rem;
    }

    .retry {
      padding: 0.75rem;
      margin: 0 auto 2rem auto;
      border-radius: 0.8rem;
      font-size: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
      background: #ffffff;

      &:hover {
        cursor: pointer;
      }

      &:active {
        margin-bottom: 1.85rem;
      }

      .material-design-icon {
        font-size: 0rem;
        margin-right: 0.33rem;
      }
    }

    .inputContainer {
      margin: 0 auto;
      max-width: 48rem;
    }
  }
}

</style>
