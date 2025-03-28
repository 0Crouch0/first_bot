const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')
const sequeile = require('./db')
const UserModels = require('./models')
const token = '7629079870:AAEaMA09f1AYL1Kau7jR9s5cvavwlejIOhc'

const bot = new TelegramApi(token, {polling: true})

const chats = {}



const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Я загадваю цифру от 0 до 9, а ты отгадываешь, взамен получишь бонус. У тебя 1 попытка`)
    const numberRandom = Math.floor((Math.random() * 10))
    chats[chatId] = numberRandom
    await bot.sendMessage(chatId, 'Отгадай число', gameOptions)
}

const start =  async () => {

    try {
        await sequeile.authenticate()
        await sequeile.sync()

    } catch (e) {
        console.log('Подключение к бд сломалось',e)
    }


    bot.setMyCommands([
        {command: '/start', description:'Начальное приветсвие'},
        {command: '/info', description: 'Получить данные о пользователе'},
        {command: '/game', description: 'Игра'},

    ])

    bot.on('message', async message => {
        const text = message.text
        const chatId = message.chat.id

        try {
            if(text === '/start') {
                await UserModels.create ({chatId})
                return bot.sendMessage(chatId, `Hello!`)
            }

            if(text === '/info') {
                const user =  await UserModels.findOne({chatId})
                return bot.sendMessage(chatId, `Your name is ${message.chat.first_name} ${message.chat.last_name}, в игре у тебя правильных ответов ${user.right}, а неправильных ${user.wrong}`)
            }

            if(text === '/game') {
                return startGame(chatId)

            }

        } catch (e) {
            return bot.sendMessage(chatId, "Ошибка")
        }



    })

    bot.on('callback_query',  async message=> {
        const data = message.data
        const chatId = message.message.chat.id



        if(data === '/again') {
            return startGame(chatId)
        }
        const user = await UserModels.findOne ({chatId})
        if(Number(data) === chats[chatId]){
            user.right +=1
              await bot.sendMessage(chatId, `Ты угадал цифру ${chats[chatId]}`, againOptions)
        } else {
            user.wrong +=1
            await  bot.sendMessage(chatId, `Ты не угадал цифру. Бот загадал ${chats[chatId]}`, againOptions)
        }
        await user.save()
    })
}
start()