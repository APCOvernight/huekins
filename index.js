const baseModule = require('huestatus/src/Module')

class huekins extends baseModule {
  constructor (config, emitter) {
    super(config, emitter)
    console.info(' ▶️ Starting Huekins...')
    this.jenkins = require('jenkins')({ baseUrl: config.url, promisify: true })
    this.job = config.job
    // this.statusPrecedence = ['alert', 'warning', 'working', 'ok']
    console.info(` 🔍 Monitor : ${this.instanceName} created. `)
    console.info(` 👀 Monitoring Jenkins Job : ${this.job}`)
  }

  /**
  * Instance name generator. Can be overridden by modules, should create unique  name
  * @return {String} Uuid
  */
  generateInstanceName () {
    return 'Jenkins:' + this.config.job
  }

  async setStatus (debug) {
    const job = await this.jenkins.job.get(this.job)
    const lastBuild = await this.jenkins.build.get(this.job, job.lastBuild.number)
    if (lastBuild.result === 'SUCCESS') {
      await this.change('ok', `  ✅ Job build successful (${this.job})`)
    }
    if (lastBuild.result === 'FAILURE') {
      await this.change('alert', `  ⛔️ Job build failed (${this.job})`)
    }
    if (lastBuild.result === 'UNSTABLE' || lastBuild.result === 'ABORTED') {
      await this.change('warning', `  ⚠️ Job unstable (${this.job})`)
    }
    if (!lastBuild.result) {
      await this.change('working', `  🏃🏻 Job running (${this.job})`)
    }
  }

  async start () {
    setInterval(await this.setStatus.bind(this), 2000)
  }
}

module.exports = huekins
