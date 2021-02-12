import Play from '../services/play'

interface Commands {
    [key: string]: (arg?: any, arg2?: any, arg3?: any) => void
}

const commands: Commands = {
    play: (message, queue, isNext) => {
        new Play().execute(message)
    },
    skip: () => {},
    first: () => {},
}

export { commands }
