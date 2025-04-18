import chalkTemplate from 'chalk-template'
import figures from 'figures'
import simpleGit from 'simple-git'

export const git = simpleGit(process.cwd())

export const flags: Record<string, string | boolean> = {}
export let command: string
export const args: string[] = []

const cmdlineArgs = process.argv.slice(2)

for (let i = 0; i < cmdlineArgs.length; i++) {
    const carg = cmdlineArgs[i]!

    if (carg[0] === '-') {
        const flag = carg.slice(carg[1] === '-' ? 2 : 1)
        const next = cmdlineArgs[i + 1]
        if (next) {
            if (next[0] === '-') {
                flags[flag] = true
            } else {
                flags[flag] = next
                i++
            }
        } else flags[flag] = true
    } else if (command!) args.push(carg)
    else command = carg
}

export function setExitCode(code: number) {
    process.exitCode = code
}

function loggablesToString(args: object[]) {
    return args.map(arg => (typeof arg === 'string' ? arg : Bun.inspect(arg))).join(' ')
}

export const logger = {
    info: (...args: any[]) =>
        console.info(chalkTemplate`{cyanBright ${figures.pointerSmall} ${loggablesToString(args)}}`),
    error: (...args: any[]) => console.error(chalkTemplate`{redBright ${figures.cross} ${loggablesToString(args)}}`),
    warn: (...args: any[]) => console.warn(chalkTemplate`{yellowBright ${figures.warning} ${loggablesToString(args)}}`),
    debug: (...args: any[]) => console.debug(chalkTemplate`{gray ${figures.pointer} ${loggablesToString(args)}}`),
    log: (...args: any[]) => console.log(chalkTemplate`${loggablesToString(args)}`),
    success: (...args: any[]) => console.info(chalkTemplate`{greenBright ${figures.tick} ${loggablesToString(args)}}`),
}
