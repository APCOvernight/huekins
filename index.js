let BaseModule

try {
  BaseModule = require(require('requireg').resolve('huestatus/src/Module'))
} catch (e) {
  throw new Error('A HueStatus installation is required -- npm install -g huestatus')
}

/**
 * HueStatus Module
 * @extends BaseModule
 */
class huekins extends BaseModule {
  /**
   * @param {Object} config  Config object
   * @param {Object} emitter HueStatus EventEmitter
   */
  constructor (config, emitter) {
    super(config, emitter)
    console.info(' ▶️  Starting Huekins...')
    this.jenkins = require('jenkins')({ baseUrl: config.url, promisify: true })
    this.job = config.job
    this.pollInterval = config.pollInterval || 2000
    // this.statusPrecedence = ['alert', 'warning', 'working', 'ok']
    console.info(` 🔍  Monitor : ${this.instanceName} created. `)
    console.info(` 👀  Monitoring Jenkins Job : ${this.job}`)
  }

  /**
  * Instance name generator. Can be overridden by modules, should create unique  name
  * @return {String} Uuid
  */
  generateInstanceName () {
    return 'Jenkins:' + this.config.job
  }

  /**
   * Set the hue status based on fetched job's status
   * @return {Promise}
   */
  async setStatus () {
    const job = await this.jenkins.job.get(this.job)
    const lastBuild = await this.jenkins.build.get(this.job, job.lastBuild.number)
    if (lastBuild.result === 'SUCCESS') {
      return this.change('ok', `Job build successful (${this.job})`)
    }
    if (lastBuild.result === 'FAILURE') {
      return this.change('alert', `Job build failed (${this.job})`)
    }
    if (lastBuild.result === 'UNSTABLE' || lastBuild.result === 'ABORTED') {
      return this.change('warning', `Job unstable (${this.job})`)
    }
    if (!lastBuild.result) {
      return this.change('working', `Job running (${this.job})`)
    }
  }

  /**
   * Start polling setStatus function
   */
  async start () {
    setInterval(await this.setStatus.bind(this), this.pollInterval)
  }
}

module.exports = huekins
