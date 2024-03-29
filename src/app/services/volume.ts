class Volume {
    getVolume(volumeIndex: string): number {
        const volumeDict: Record<string, number> = {
            '1': 0.01,
            '2': 0.02,
            '3': 0.03,
            '4': 0.04,
            '5': 0.05,
            '6': 0.10,
            '7': 0.20,
            '8': 0.30,
            '9': 0.40,
            '10': 0.50,
            '11': 0.60,
            '12': 0.70,
            '13': 0.80,
            '14': 0.90,
            '15': 1.00,
        }
        return volumeDict[volumeIndex]
    }
}

export default new Volume();
