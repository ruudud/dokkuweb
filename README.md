Dokkuweb
========

- `dokku-plugins/` - Extra Dokku commands needed
- `cgi-bin/` - API that calls various dokku commands
- `static/` - HTML/JavaScript client


Development / Deployment
------------------------

1. Run the Vagrant setup from [dokku](https://github.com/progrium/dokku), and add
these lines to the Vagrantfile before doing `vagrant up`:

```
config.vm.synced_folder "/home/youruser/dokkuweb", "/srv/dokkuweb"            
config.vm.synced_folder "/home/youruser/dokkuweb/dokku-plugins", "/var/lib/dokku/plugins/available/dokkuweb"
```

2. Enable the dokkuweb dokku plugins by executing `dokku plugin:enable
   dokkuweb` inside the VM.

3. Add this to the `/etc/sudoers` file inside the virtual machine (`vagrant ssh` →
`visudo`):

    `www-data ALL=(ALL)NOPASSWD:/usr/local/bin/dokku, /usr/local/bin/sshcommand`

4. Some of the functionality requires a logged in user. **ruud:test** will be
available if you create the file `/etc/nginx/htpasswd` with the following
contents:

    `ruud:PIzPiIhlhCr9o`

5. Install [fcgiwrap](http://wiki.nginx.org/Fcgiwrap) so nginx can proxy the API requests:

    `sudo apt-get install fcgiwrap`

6. Replace `/etc/nginx/sites-enabled/default` with this:

```
fastcgi_cache_path /etc/nginx/cache levels=1:2 keys_zone=DOKKUWEB:50m;
fastcgi_cache_key "$scheme$request_method$host$request_uri";
server {
    listen 80 default_server;
    listen [::]:80 default_server ipv6only=on;

    add_header X-Cache $upstream_cache_status;
    add_header "Vary" "Accept-Encoding";

    access_log /var/log/nginx/access.log;
    server_name localhost;

    gzip_types application/x-javascript text/css;

    auth_basic "Dokkuweb";
    auth_basic_user_file htpasswd;

    location / {
        gzip on;
        add_header "Vary" "Accept-Encoding";

        root /srv/dokkuweb/static;
        sendfile off;
        autoindex on;
        index index.html index.htm;
        try_files $uri $uri/ =404;
    }
    location ~ ^/cgi-bin {
        root /srv/dokkuweb/cgi-bin;
        rewrite ^/cgi-bin/(.*) /$1 break;

        fastcgi_pass unix:/var/run/fcgiwrap.socket;
        fastcgi_param SCRIPT_FILENAME /srv/dokkuweb/cgi-bin$fastcgi_script_name;
        fastcgi_param X_AUTHORIZATION $http_authorization;
        include fastcgi_params;
        fastcgi_cache DOKKUWEB;
    }
}
```

If all is well, dokkuweb should be running on http://10.0.0.2/ and you should
also be able to push apps to this IP address using the procedure documented in 
the [dokku README](https://github.com/progrium/dokku).
