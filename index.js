const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('/options')
const token = '7629079870:AAEaMA09f1AYL1Kau7jR9s5cvavwlejIOhc'

const bot = new TelegramApi(token, {polling: true})

const chats = {}



const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Я загадваю цифру от 0 до 9, а ты отгадываешь, взамен получишь бонус. У тебя 1 попытка`)
    const numberRandom = Math.floor((Math.random() * 10))
    chats[chatId] = numberRandom
    await bot.sendMessage(chatId, 'Отгадай число', gameOptions)
}

const start =  () => {
    bot.setMyCommands([
        {command: '/start', description:'Начальное приветсвие'},
        {command: '/info', description: 'Получить данные о пользователе'},
        {command: '/game', description: 'Игра'},

    ])

    bot.on('message', async message => {
        const text = message.text
        const chatId = message.chat.id
        if(text === '/start') {
            return bot.sendMessage(chatId, `Hello!`)
        }

        if(text === '/info') {
            return bot.sendMessage(chatId, `Your name is ${message.chat.first_name} ${message.chat.last_name}`)
        }

        if(text === '/game') {
            return startGame(chatId)

        }
        console.log(message)
    })

    bot.on('callback_query',  async message=> {
        const data = message.data
        const chatId = message.message.chat.id
        if(data === '/again') {
            return startGame(chatId)
        }
        if(Number(data) === chats[chatId]){
             return await bot.sendMessage(chatId, `Ты угадал цифру ${chats[chatId]}`, againOptions)
        } else {
            return bot.sendMessage(chatId, `Ты не угадал цифру. Бот загадал ${chats[chatId]}`, againOptions)
        }
        console.log(message)
    })
}
start()