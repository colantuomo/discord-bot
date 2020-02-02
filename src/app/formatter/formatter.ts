class Formatter {

    formatDuration(duration: string) {
        if (duration) {
            var total = duration.replace(/PT|S/gi, "");
            var hasHour = total.indexOf("H") != -1;
            var base = total.split("H");
            var rest = hasHour ? base[1].split("M") : total.split("M");
            var minSec = this.formatDecimal(rest[0]) + ':' + this.formatDecimal(rest[1]);
            return hasHour ? this.formatDecimal(base[0]) + ':' + minSec : minSec;
        }
        return duration;
    }

    formatDecimal(text: string) {
        if (text) {
            return text.length == 1 ? "0" + text : text;
        }
        return text;
    }

    formatMessage(msg: string) {
        if (msg) {
            return msg.replace(";play ", "");
        }
        return msg;
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