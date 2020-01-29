export const getNameFromCommandLine = () => {
    if (process.argv.length > 2) {
        return process.argv[2];
    }
    throw new Error('No name provided for your player.\n\n    Usage: yarn play:<env>:<room> player-name');
};
