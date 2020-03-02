const moment = require('moment')
const morgan = require('morgan')
const chalk = require('chalk')
const _ = require('loadsh')

const dateLog = () =>
  moment.locale('pt-BR') &&
  chalk.black.bgWhiteBright(
    `Data e Hora\n[${moment().format('DD-MM-YYYY hh:mm:ss')}]`
  )

module.exports = class ServerLogs {
  morganLog (req, res, next) {
    return morgan((tokens, req, res) => {
      console.debug()
      return [
        dateLog(),
        tokens.method(req, res),
        tokens.url(req, res),
        '-',
        'IP',
        tokens['remote-addr'](req, res),
        '-',
        'Code',
        '-',
        tokens.status(req, res),
        '-',
        'Size',
        tokens.res(req, res, 'content-length'),
        '-',
        'B',
        '-',
        'Handled in',
        tokens['response-time'](req, res),
        'ms'
      ].join(' ')
    })(req, res, next)
  }

  /**
   * @param{bollean} error
   */
  log (error, msg, opts) {
    console.debug()
    const isError = [true, false].includes(error) && error
    const message = typeof error === 'boolean' ? msg : error
    const options = typeof error === 'boolean' ? opts : msg

    const {
      tags = ['CLIENT'],
      bold = false,
      italic = false,
      underline = false,
      reversed = false,
      bgColor = false,
      color = 'whiteBright'
    } = options instanceof Object ? options : {}

    const colorFunction = _.get(
      chalk,
      [bold, italic, underline, reversed, bgColor, color]
        .filter(Boolean)
        .join(' ')
    )
    console.log(
      isError
        ? `${dateLog()} ${chalk.black.bgRedBright('[ErrorLog]')}`
        : dateLog(),
      tags.map(t => chalk.black.bgGreenBright(`[${t}]`)).join(' '),
      colorFunction(message)
    )
  }
}
