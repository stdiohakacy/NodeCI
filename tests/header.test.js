const puppeteer = require('puppeteer')
const userFactory = require('./factories/userFactory')
const sessionFactory = require('./factories/sessionFactory')
const Page = require('./helpers/page')

let page

beforeEach(async () => {
    page = await Page.build()
    await page.goto('localhost:3000')
})

afterEach(async () => {
    await page.close()
})

test('The header has the correct text', async () => {
    const text = await page.$eval('a.brand-logo', el => el.innerHTML)
    expect(text).toEqual('Blogster')
})

test('Clicking login starts oauth flow', async () => {
    await page.click('.right a')
    const url = await page.url()
    expect(url).toMatch(/accounts\.google\.com/)
})

test('When signed in, shows logout button', async () => {
    const user = await userFactory()
    const { session, sig } = await sessionFactory(user)

    await page.setCookie({ name: 'session', value: session })
    await page.setCookie({ name: 'session.sig', value: sig })
    await page.goto('localhost:3000')
    await page.waitFor('a[href="/auth/logout"]')

    const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML)
    expect(text).toEqual('Logout')
}, 30000)
