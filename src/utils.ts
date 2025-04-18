import chalkTemplate from 'chalk-template'

export function prompt(question: string) {
    return globalThis.prompt(chalkTemplate`{cyanBright ${question}}`)
}

export function yesNoPrompt(question: string, defaultValue = false) {
    const defaultValueString = defaultValue ? 'Y/n' : 'y/N'
    const result = prompt(chalkTemplate`{bold ?} ${question} {gray (${defaultValueString})}`)

    if (!result) return defaultValue

    return result[0]!.toLowerCase() === 'y'
}
