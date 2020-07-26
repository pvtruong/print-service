### Install
`npm install -g web-print-service`
### Start service
`printservice start [port]`
- Port default is 8989
### Use
Example print page https://google.com:
- Convert "https://google.com" to base64 code
- Open brownser and goto http://localhost:8989?url=url_converted_to_base64_code