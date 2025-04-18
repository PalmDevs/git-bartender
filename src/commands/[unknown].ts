import { command, logger, setExitCode } from '../context'
import { string } from '../strings'

export const execute = async () => {
    setExitCode(1)

    if (command) logger.error(string('command.[unknown].yellWithCommand', command))
    else logger.error(string('command.[unknown].yell'))

    logger.info(string('command.[unknown].hint'))
}

export const hidden = true
export const uninvokable = true
