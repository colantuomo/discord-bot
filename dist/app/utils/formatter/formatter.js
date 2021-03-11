"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Formatter {
    formatDuration(duration) {
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
    getTimeByUnity(duration, unity) {
        return duration.substring(duration.indexOf(unity) - 2, duration.indexOf(unity));
    }
    newDuration(duration, unity) {
        return duration.substr(duration.indexOf(unity) + 1);
    }
    formatDecimal(text) {
        return (text === null || text === void 0 ? void 0 : text.length) == 1 ? "0" + text : text;
    }
    formatQueue(serverQueue) {
        let queue = '```';
        serverQueue.songs.forEach((song, idx) => {
            queue += `${idx + 1} - ${song.title}\r\n`;
        });
        queue += '```';
        return queue;
    }
}
exports.default = Formatter;
