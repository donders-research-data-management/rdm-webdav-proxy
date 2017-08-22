# rdm-webdav-proxy

A simple NodeJS HTTP/HTTPS server proxying client's WebDAV requests to (protected) RDM WebDAV servers.

This proxy is created with a specific use case in mind:

- we want to enable temporary anonymous access to (and only to) a specific data collection.  Thus, the '/' endpoint of the proxy is disabled, given that the user should provide the path of the specific data collection.  The resource behind the path may be dynamically provisioned/removed in the underlying webdav (or iRODS) system.

## configuration

Note that the implementation expects that the path of the proxy's URL is exactly the same as the path of the targetting WebDAV server.  For example,

```bash
client --> https://proxy/test/test.txt --> https://webdav/test/test.txt
```

Therefore the following path mappings in proxy DOES NOT work!!

```bash
client --> https://proxy/xyz/test/test.txt --> https://webdav/test/tests.txt
client --> https://proxy/test/test.txt --> https://webdav/test.txt
```

- put proxy server's certificat and key in the `ssl` directory.  If they are not presented, the proxy server will be run in non-secured mode, i.e. using the HTTP protocol.
- modify the target WebDAV server in `config/default.conf` file.

## run

```bash
$ npm install
$ npm start
```

The server is listen on port `3000` as default.  Add `port` attribute in `config/default.conf` if you want to change it.  The client access log is stored in `log` directory, and will be rotated every 7 days.
