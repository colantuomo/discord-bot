import { Client, PresenceData } from 'discord.js'

export class Common {
    constructor(private client: Client) {
        this.init()
    }

    private init() {
        this.login()
        this.ready({ status: 'online' })
        this.reconnecting()
        this.disconnect()
    }

    private ready(presenceData: PresenceData) {
        this.client?.user?.setPresence(presenceData)
    }

    private reconnecting() {
        console.log('reconnecting!')
    }

    private disconnect() {
        console.log('disconnect')
    }

    private login() {
        this.client?.login(process.env.TOKEN)
    }
}
