// var expect = require('chai').expect
const chai = require('chai')
var Huekins = require('../')
var sinon = require('sinon')
const expect = chai.expect
const jenkins = require('jenkins')

describe('Huekins tests', function () {
  it('Once created, the huekins instance name should be Jenkins:<JobName>', () => {
    const configMock = {'url': 'FakeJenkinsAddress', 'job': 'fakeJob'}
    const emitterMock = null
    const systemUnderTest = new Huekins(configMock, emitterMock)
    expect(systemUnderTest.instanceName).to.equal('Jenkins:fakeJob')
  })

  it('Once created, the huekins instance should have a start method', () => {
    const configMock = {'url': 'FakeJenkinsAddress', 'job': 'fakeJob'}
    const emitterMock = null
    const systemUnderTest = new Huekins(configMock, emitterMock)
    expect(systemUnderTest.start).to.be.a('function')
  })

  it('If jenkins returns "SUCCESS" change should be called with status of OK', async () => {
    const configMock = {'url': 'FakeJenkinsAddress', 'job': 'fakeJob'}
    const emitterMock = null
    const systemUnderTest = new Huekins(configMock, emitterMock)
    const mockJenkins = sinon.mock(systemUnderTest.jenkins.job).expects('get').returns({'lastBuild': '2001-01-01', 'number': '10'})
    const mockGetBuild = sinon.mock(systemUnderTest.jenkins.build).expects('get').returns({'result': 'SUCCESS'})
    const mockBaseClassChange = sinon.mock(systemUnderTest).expects('change').withArgs('ok', `  ✅ Job build successful (fakeJob)`)

    await systemUnderTest.setStatus(false)

    mockJenkins.verify()
    mockGetBuild.verify()
    mockBaseClassChange.verify()
  })

  it('If jenkins returns "FAILURE" change should be called with status of ALERT', async () => {
    const configMock = {'url': 'FakeJenkinsAddress', 'job': 'fakeJob'}
    const emitterMock = null
    const systemUnderTest = new Huekins(configMock, emitterMock)
    const mockJenkins = sinon.mock(systemUnderTest.jenkins.job).expects('get').returns({'lastBuild': '2001-01-01', 'number': '10'})
    const mockGetBuild = sinon.mock(systemUnderTest.jenkins.build).expects('get').returns({'result': 'FAILURE'})
    const mockBaseClassChange = sinon.mock(systemUnderTest).expects('change').withArgs('alert', `  ⛔️ Job build failed (fakeJob)`)

    await systemUnderTest.setStatus(false)

    mockJenkins.verify()
    mockGetBuild.verify()
    mockBaseClassChange.verify()
  })

  it('If jenkins returns "UNSTABLE" change should be called with status of WARNING', async () => {
    const configMock = {'url': 'FakeJenkinsAddress', 'job': 'fakeJob'}
    const emitterMock = null
    const systemUnderTest = new Huekins(configMock, emitterMock)
    const mockJenkins = sinon.mock(systemUnderTest.jenkins.job).expects('get').returns({'lastBuild': '2001-01-01', 'number': '10'})
    const mockGetBuild = sinon.mock(systemUnderTest.jenkins.build).expects('get').returns({'result': 'UNSTABLE'})
    const mockBaseClassChange = sinon.mock(systemUnderTest).expects('change').withArgs('warning', `  ⚠️ Job unstable (fakeJob)`)

    await systemUnderTest.setStatus(false)

    mockJenkins.verify()
    mockGetBuild.verify()
    mockBaseClassChange.verify()
  })

  it('If jenkins returns "ABORTED" change should be called with status of WARNING', async () => {
    const configMock = {'url': 'FakeJenkinsAddress', 'job': 'fakeJob'}
    const emitterMock = null
    const systemUnderTest = new Huekins(configMock, emitterMock)
    const mockJenkins = sinon.mock(systemUnderTest.jenkins.job).expects('get').returns({'lastBuild': '2001-01-01', 'number': '10'})
    const mockGetBuild = sinon.mock(systemUnderTest.jenkins.build).expects('get').returns({'result': 'ABORTED'})
    const mockBaseClassChange = sinon.mock(systemUnderTest).expects('change').withArgs('warning', `  ⚠️ Job unstable (fakeJob)`)

    await systemUnderTest.setStatus(false)
    mockJenkins.verify()
    mockGetBuild.verify()
    mockBaseClassChange.verify()
  })

  it('If jenkins returns "WORKING" change should be called with status of WORKING', async () => {
    const configMock = {'url': 'FakeJenkinsAddress', 'job': 'fakeJob'}
    const emitterMock = null
    const systemUnderTest = new Huekins(configMock, emitterMock)
    const mockJenkins = sinon.mock(systemUnderTest.jenkins.job).expects('get').returns({'lastBuild': '2001-01-01', 'number': '10'})
    const mockGetBuild = sinon.mock(systemUnderTest.jenkins.build).expects('get').returns({'result': null})
    const mockBaseClassChange = sinon.mock(systemUnderTest).expects('change').withArgs('working', `  🏃🏻 Job running (fakeJob)`)

    await systemUnderTest.setStatus(false)

    mockJenkins.verify()
    mockGetBuild.verify()
    mockBaseClassChange.verify()
  })

  it('polls jenkins', async () => {
    this.clock = sinon.useFakeTimers()
    const configMock = {'url': 'FakeJenkinsAddress', 'job': 'fakeJob'}
    const emitterMock = null
    const systemUnderTest = new Huekins(configMock, emitterMock)
    const mockBaseClassChange = sinon.mock(systemUnderTest).expects('setStatus').once()

    await systemUnderTest.start()

    this.clock.tick(2000)
    mockBaseClassChange.verify()
  })

  it('If jenkins promisfy is set to false, throw', async () => {
    const configMock = {'url': 'FakeJenkinsAddress', 'job': 'fakeJob'}
    const emitterMock = null
    const mockJenkinsObj = sinon.stub(jenkins, 'Jenkins').callsFake(function (data) {
      expect(data.promisify).to.be.true
    })

    const systemUnderTest = new Huekins(configMock, emitterMock)
  })
})
