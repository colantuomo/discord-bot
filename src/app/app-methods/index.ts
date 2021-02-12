import Play from './play'
import Playlist from './playlist'

interface Commands {
    [key: string]: (arg?: any, arg2?: any, arg3?: any) => void
}

const commands: Commands = {
    play: (message, queue, isNext) => {
        Play.execute(message, queue, isNext)
    },
    skip: () => {},
    first: () => {},
}

export { commands }
