import Play from '../../src/app/services/play';

const play = new Play();

describe('PLAY INTERACTIONS', () => {
    describe('CHECK LINK', () => {
        test('VALID HTTPS LINK', () => {
            const link = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
            const result = play.isLink(link);
            expect(result).toBe(true);
        });

        test('VALID HTTP LINK', () => {
            const link = 'http://www.youtube.com/watch?v=dQw4w9WgXcQ';
            const result = play.isLink(link);
            expect(result).toBe(true);
        });

        test('VALID REDUCED LINK', () => {
            const link = 'https://youtu.be/2G_mWfG0DZE';
            const result = play.isLink(link);
            expect(result).toBe(true);
        });

        test('INVALID LINK', () => {
            const link = 'watch?v=dQw4w9WgXcQ';
            const result = play.isLink(link);
            expect(result).toBe(false);
        });
    });
});
