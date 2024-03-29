class PlayUtils {
    isLink = (content: string): boolean => {
        const expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
        const regex = new RegExp(expression);
        return content?.match(regex) ? true : false;
    }
}

export default new PlayUtils();

