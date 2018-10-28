const http = require('http')
const fs = require('fs')

const handler = {
  captions: (req, res, video, lang) => {
    const file = `${__dirname}/../../assets/caption/${video}.${lang}.vtt`

    res.writeHead(200, {
      'Content-Length': fs.statSync(file),
      'Content-Type': 'text/vtt',
    })
    return fs.createReadStream(file).pipe(res)
  },
  index: (req, res) => {
    const file = `${__dirname}/../../assets/view/index.html`

    res.writeHead(200, {
      'Content-Length': fs.statSync(file).size,
      'Content-Type': 'text/html',
    })
    fs.createReadStream(file).pipe(res)
  },
  video: (req, res, video) => {
    const file = `${__dirname}/../../assets/video/${video}.mp4`
    const stat = fs.statSync(file)
    const fileSize = stat.size

    if (req.headers.range) {
      const parts = req.headers.range.replace(/bytes=/, '').split('-')
      const start = parseInt(parts[0], 10)
      const end = parts[1] ?
        parseInt(parts[1], 10) :
        fileSize - 1

      res.writeHead(206, {
        'Accept-Ranges': 'bytes',
        'Content-Length': end - start + 1,
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Content-Type': 'text/vtt'
      })
      return fs.createReadStream(file, {
        start,
        end
      }).pipe(res)
    }

    res.writeHead(200, {
      'Content-Length': fileSize,
      'Content-Type': 'text/vtt',
    })
    return fs.createReadStream(file).pipe(res)
  }
}

const server = http.createServer((request, response) => {
  switch (request.url) {
  case '/':
    return handler.index(request, response)
  case '/caption/how_great_leaders_inspire_action.en.vtt':
    return handler.captions(request, response, 'how_great_leaders_inspire_action', 'en')
  case '/caption/how_great_leaders_inspire_action.es.vtt':
    return handler.captions(request, response, 'how_great_leaders_inspire_action', 'es')
  case '/video/how_great_leaders_inspire_action.mp4':
    return handler.video(request, response, 'how_great_leaders_inspire_action')
  default:
    {
      response.writeHead(404, {
        'Content-Type': 'text/plain'
      })
      response.end('404 Not found')
    }
  }
}).listen(process.env.PORT || 8000)

console.log('This process is your pid ' + process.pid);
