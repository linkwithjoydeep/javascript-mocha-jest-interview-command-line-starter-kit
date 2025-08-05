
function main() {
    const commands = process.argv.slice(2)
    if (commands.length === 0) {
        throw new Error("No command line arguments passed")
    }
    /*
    * Format of the 'args' array: [`<COMMAND_NAME_1> <ARG1> <ARG2> .. <ARG N>`, `<COMMAND_NAME_2> <ARG1> <ARG2> .. <ARG N>`]
    *  Example: ["PLACE_ORDER 101 Apple 5", "TOTAL_COST 101"]
    *
    * The code evaluator will execute this code by using the command
    * node . 'PLACE_ORDER 101 Apple 5' 'TOTAL_COST 101'
    *
    * We loop through the list of commands passed in as input arguments and handle each one of them
    */
    for (let cmd of commands) {
        //arg will have each command passed in the command line argumens
        handle(cmd)
    }
}


/*
 * This method should parse each input and assigns it into different variables.
 *
 * The value of the function parameter "input" will be of the format - "`<COMMAND_NAME_1> <ARG1> <ARG2> .. <ARG N>".
 * We split the string and retrieve the input data appropriately into the variable inputListForOneCommand.
 *
 */
function handle(cmd) {
    const inputsForOneCommand = cmd.split(' ')
    console.log(inputsForOneCommand)
    //TODO: implement the logic to handle each input
}

main()
