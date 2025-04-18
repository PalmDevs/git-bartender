export let flags: Record<string, string | boolean> = {}
export let command: string
export let args: string[] = []

export function clearFlags() {
    flags = {}
}

export function clearArgs() {
    args = []
}

const cmdlineArgs = process.argv.slice(2)

for (let i = 0; i < cmdlineArgs.length; i++) {
    const carg = cmdlineArgs[i]!

    if (carg[0] === '-') {
        if (carg[1] === '-') {
            const flag = carg.slice(2)
            const next = cmdlineArgs[i + 1]
            if (next) {
                if (next[0] === '-') {
                    flags[flag] = true
                } else {
                    flags[flag] = next
                    i++
                }
            } else flags[flag] = true
        } else {
            const flagsToAdd = carg.slice(1)
            for (const flag of flagsToAdd) flags[flag] = true
        }
    } else if (command!) args.push(carg)
    else command = carg
}

export function setExitCode(code: number) {
    process.exitCode = code
}
