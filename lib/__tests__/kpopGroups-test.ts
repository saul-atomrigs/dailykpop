import { kpopGroups } from '../kpopGroups';

describe('kpopGroups', () => {
    it('should contain specific K-pop groups', () => {
        const expectedGroups = [
            '(G)I-DLE',
            'ATEEZ',
            'ASTRO',
            'aespa',
            'BTS',
            'BLACKPINK',
            'Dreamcatcher',
            'ENHYPEN',
            'EVERGLOW',
            'EXO',
            'GOT7',
            'IVE',
            'ITZY',
            'JENNIE',
            'Kep1er',
            'LOONA',
            'MAMAMOO',
            'MONSTA X',
            'NCT 127',
            'NMIXX',
            'Oh My Girl',
            'Red Velvet',
            'SEVENTEEN',
            'SF9',
            'Stray Kids',
            'STAYC',
            'TREASURE',
            'TXT',
            'TWICE',
            'WINNER'
        ];

        expectedGroups.forEach(group => {
            expect(kpopGroups).toContain(group);
        });
    });

    it('should be sorted alphabetically, case insensitive', () => {
        const sortedGroups = [...kpopGroups].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
        expect(kpopGroups).toEqual(sortedGroups);
    });
});