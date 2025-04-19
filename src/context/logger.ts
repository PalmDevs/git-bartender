import chalkTemplate from 'chalk-template'
import figures from 'figures'
import { string } from '../strings'

function loggablesToString(args: object[]) {
    return args.map(arg => (typeof arg === 'string' ? arg : Bun.inspect(arg))).join(' ')
}

export const logger = {
    info: (...args: any[]) =>
        console.info(
            chalkTemplate`{${string('product.color.secondary')} ${figures.pointerSmall} ${loggablesToString(args)}}`,
        ),
    error: (...args: any[]) =>
        console.error(chalkTemplate`{${string('product.color.primary')} ${figures.cross} ${loggablesToString(args)}}`),
    warn: (...args: any[]) => console.warn(chalkTemplate`{yellowBright ${figures.warning} ${loggablesToString(args)}}`),
    debug: (...args: any[]) => {
        if (process.env.GB_DEBUG)
            console.debug(
                chalkTemplate`{${string('product.color.tertiary')} ${figures.pointer} ${loggablesToString(args)}}`,
            )
    },
    log: (...args: any[]) => console.log(chalkTemplate`${loggablesToString(args)}`),
    success: (...args: any[]) => console.info(chalkTemplate`{greenBright ${figures.tick} ${loggablesToString(args)}}`),
    newline: () => console.log(''),
}
