class Formatter {

    formatDuration(duration: string) {
        if (duration) {
            const hasHour = duration.includes("H");
            const hasMinute = duration.includes("M");
            const hasSecond = duration.includes("S");
            duration = duration.replace(/PT|S/gi, "");

            let hours = '00';
            let minutes = '00';

            if (hasHour) {
                hours = this.getTimeByUnity(duration, 'H');
                duration = this.newDuration(duration, 'H');
            }

            if (hasMinute) {
                minutes = this.getTimeByUnity(duration, 'M');
                duration = this.newDuration(duration, 'M');
            }

            const seconds = hasSecond ? duration : '00';

            const minSec = `${this.formatDecimal(minutes)}:${this.formatDecimal(seconds)}`;

            return hasHour ? `${this.formatDecimal(hours)}:${minSec}` : `${minSec}`;
        }
        return duration;
    }

    getTimeByUnity(duration: string, unity: string) {
        return duration.substring(duration.indexOf(unity) - 2, duration.indexOf(unity));
    }

    newDuration(duration: string, unity: string) {
        return duration.substr(duration.indexOf(unity) + 1);
    }

    formatDecimal(text: string) {
        return text?.length == 1 ? "0" + text : text;
    }

    formatMessage(msg: string) {
        return !msg ? msg : msg.replace(/(;play |;first )/g, "");
    }

    formatQueue(serverQueue: any) {
        let queue = '```';
        serverQueue.songs.forEach((song: any, idx: number) => {
            queue += `${idx + 1} - ${song.title}\r\n`;
        })
        queue += '```';
        return queue;
    }
}


const instance = new Formatter();
export = instance;