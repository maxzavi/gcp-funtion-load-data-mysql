const getAccessToken = async () => {
    //api rest generate token
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

    const result = new Promise(resolve => {
        const req = http.request(options, res => {
            const chunks = []

            res.on("data", chunk => {
                chunks.push(chunk)
            })

            res.on("end", chunk => {
                const body = Buffer.concat(chunks)
                resolve(JSON.parse(body))
            })

            res.on("error", error => {
                console.error(error)
            })
        })
        req.end()
    })
    const r = await result
    return r
}

const loadFile = async (access_token, filepath) => {
    const https = require('follow-redirects').https

    const options = {
        'method': 'POST',
        'hostname': 'sqladmin.googleapis.com',
        'path': '/v1/projects/spsa-test-on/instances/monitoreo/import',
        'headers': {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json charset=utf-8'
        },
        'maxRedirects': 20
    }

    const result = new Promise(resolve => {
        const req = https.request(options, res => {
            const chunks = []

            res.on("data", chunk => {
                chunks.push(chunk)
            })

            res.on("end", chunk => {
                const body = Buffer.concat(chunks)
                console.log(`body: ${body}`)
                resolve(JSON.parse(body))
            })

            res.on("error", error => {
                console.error(error)
                resolve(error)
            })

        })
        const postData = {
            "importContext":
            {
                "fileType": "CSV",
                "uri": `gs://monitoreo-bucket-test/${filepath}`,
                "database": "DBMONITOREO",
                "csvImportOptions":
                {
                    "table": "pruebamzv"
                }
            }
        }

        req.write(JSON.stringify(postData))

        req.end()

    })
    const r = await result
    return r
}

module.exports = {
    getAccessToken,
    loadFile
}
