const Page = require('./helpers/page')
var page

// beforeEach(async () => {
//     console.log("11111111111")
//     page = await Page.build()
//     console.log(`2222222222 ${page}`)
//     await page.goto('http://localhost:3000')
// })

// afterEach(async () => {
//     await page.close()
// })

describe('When logged in', async () => {
    beforeEach(async () => {
        console.log("11111111111")
        page = await Page.build()
        console.log(`2222222222 ${page}`)
        await page.goto('http://localhost:3000')
        console.log("33333333333333333")
        await page.login()
        console.log("55555555555555")
        await page.click('a.btn-floating')
        console.log("44444444444444444")

    })

    test('When logged in, can see blog create form', async () => {
        const label = await page.getContentsOf('form label')
        expect(label).toEqual('Blog Title')
    })

    // describe('And using invalid inputs', async () => {
    //     beforeEach(async () => {
    //         await page.type('.title input', 'My Title')
    //         await page.type('.content input', 'My Content')
    //         await page.click('form button')
    //     })
    //     test('Submitting takes user to review screen', async () => {
    //         const text = await page.getContentsOf('h5')
    //         expect(text).toEqual('Please confirm your entries')
    //     })

    //     test('Submitting then saving adds blog to index page', async () => {
    //         await page.click('button.green')
    //         await page.waitFor('.card')

    //         const title = await page.getContentsOf('.card-title')
    //         const content = await page.getContentsOf('p')

    //         expect(title).toEqual('My Title')
    //         expect(content).toEqual('My Content')
    //     })
    // })

    // describe('And using invalid inputs', async () => {
    //     beforeEach(async () => {
    //         await page.click('form button')
    //     })

    //     test('the form shows an error message', async () => {
    //         const titleError = await page.getContentsOf('.title .red-text')
    //         const contentError = await page.getContentsOf('.content .red-text')

    //         expect(titleError).toEqual('You must provide a value')
    //         expect(contentError).toEqual('You must provide a value')
    //     })
    // })
})

// describe('User is not logged in', async () => {
//     const actions = [
//         {
//             method: 'get',
//             path: '/api/blogs'
//         },
//         {
//             method: 'post',
//             path: '/api/blogs',
//             data: {
//                 title: 'T',
//                 content: 'C'
//             }
//         }
//     ]

//     test('Blog related actions are prohibited', async () => {
//         const results = await page.execRequests(actions)
//         for (let result of results)
//             expect(result).toEqual({ error: 'You must log in!' })
//     })
// })
