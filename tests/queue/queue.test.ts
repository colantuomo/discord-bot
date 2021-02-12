
import ServerManager from '../../src/app/services/server-manager';
import { Server } from '../../src/app/models/server-manager.model'
import Queue from '../../src/app/services/queue';

const serverMap = ServerManager.getInstance();
const queue = new Queue();

describe('QUEUE INTERACTIONS', () => {
    describe('NEXT MUSIC (SKIP)', () => {
        // beforeEach(() => {
        //     const server = serverMap.init('test-server', '', '');
        // });

        // afterEach(() => {
        //     serverMap.disconnect('test-server');
        // });

        test('2 ITEMS ON QUEUE', () => {
            const server = serverMap.get('test-server');
            server.songs.push('music1', 'music2');
            console.log('server.songs.length 1: ', server.songs.length);

            queue.skip('test-server');
            const queueLenth = server.songs.length;
            console.log('server.songs.length 2: ', server.songs.length);
            expect(queueLenth).toEqual(1);
        });
    });
});
