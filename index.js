const functions = require('@google-cloud/functions-framework')
const folder = "monitor-transitos-mzv"
const prefix = "mzv_test"
const bucket = "monitoreo-bucket-test"
const database = "DBMONITOREO"
const table = prefix

functions.cloudEvent('helloGCS', async cloudEvent => {

    console.log(`Event ID: ${cloudEvent.id}`)
    const file = cloudEvent.data

    console.log(`File: ${file.name}`)
    //Validate filename and asing table
    if ((file.name.startsWith(`${folder}/${prefix}`)
        && (file.bucket == bucket)
        && (file.name.endsWith('.csv')))) {

        console.log(`Processing file ${file.name}`)

        try {
            //Get Token
            console.log('Get token ..')

            const { access_token } = await getToken()
            console.log(`Access_token  : ${access_token}`)

            const result = await processFile(file.name, access_token)

            const { selfLink } = result
            console.log(`selfLink: ${selfLink}`)
        } catch (error) {
            console.log(`Error: ${error}`)
        }
    }
    console.log('End')
})

const getToken = async () => {
    const http = require('follow-redirects').http

    const options = {
        'method': 'GET',
        'hostname': 'metadata.google.internal',
        'path': '/computeMetadata/v1/instance/service-accounts/default/token',
        'headers': {
            'Metadata-Flavor': 'Google'
        },
        'maxRedirects': 20
    }

    let p = new Promise((resolve) => {
        const req = http.request(options, function (res) {
            const chunks = []

            res.on("data", function (chunk) {
                chunks.push(chunk)
            })

            res.on("end", function (chunk) {
                const body = Buffer.concat(chunks)
                resolve(JSON.parse(body))
            })

            res.on("error", function (error) {
                console.error(error)
                resolve(error)
            })
        })

        req.end()
    })
    return await p
}

const processFile = async (filename, access_token) => {
    const https = require('follow-redirects').https
    const options = {
        method: 'POST',
        hostname: 'sqladmin.googleapis.com',
        path: '/v1/projects/spsa-test-on/instances/monitoreo/import',
        headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json charset=utf-8'
        },
        'maxRedirects': 20
    }

    let p = new Promise((resolve) => {
        const req = https.request(options, function (res) {
            const chunks = []

            res.on("data", function (chunk) {
                chunks.push(chunk)
            })

            res.on("end", function (chunk) {
                const body = Buffer.concat(chunks)
                resolve(JSON.parse(body))
            })

            res.on("error", function (error) {
                console.error(`Error: ${error}`)
                resolve(error)
            })
        })

        const reqBody = {
            "importContext":
            {
                fileType: "CSV",
                uri: `gs://${bucket}/${filename}`,
                database,
                csvImportOptions:
                {
                    table
                }
            }
        }
        const postData = JSON.stringify(reqBody)
        req.write(postData)

        req.end()
    })
    return await p
}