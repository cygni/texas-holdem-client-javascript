/**
 * Utility function for reading an argument from the command line. Usually this function is used
 * to get the bot's name from the command line when playing.
 */
export const getNameFromCommandLine = () => {
    if (process.argv.length > 2) {
        return process.argv[2];
    }
    throw new Error('No name provided for your player.\n\n    Usage: yarn play:<env>:<room> player-name');
};
