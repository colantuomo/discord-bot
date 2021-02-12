import { Client, Message as Msg } from 'discord.js'
import { commands } from '../app-methods'

export class Message {
    constructor(private client: Client) {
        this.onMessage()
    }

    private args(msg: Msg) {
        const { content } = msg
        return content.split(' ')
    }

    private executeCommand(msg: Msg) {
        const [prefix, command, arg1, arg2, arg3] = this.args(msg)
        commands[command](arg1, arg2, arg3)
    }

    private onMessage() {
        this.client.on('message', this.executeCommand)
    }
}
