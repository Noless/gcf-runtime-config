# gcf-runtime-config-test

A ready-to-deploy sample function that uses
[`gcf-runtime-config`](https://www.npmjs.com/package/gcf-runtime-config) 
and extracts a runtime config (environment).

Set up our runtime config:

~~~bash
$ gcloud beta runtime-config configs create EXAMPLE_ENVIRONMENT 
$ gcloud beta runtime-config configs variables \
    set PAYPAL_SECRET_KEY "NOTREAL1234!@#$" \
    --config-name EXAMPLE_ENVIRONMENT \
    --is-text
$ gcloud beta runtime-config configs variables \
    set STRIPE_SECRET_KEY "YESREAL1234!@#$" \
    --config-name EXAMPLE_ENVIRONMENT \
    --is-text
~~~

Note: if `--is-text` isn't set the stored values are `base64` encoded.

(You can also just run `./set_env.sh`).

Verify through the `gcloud` `cli`:

~~~ bash
$ gcloud beta runtime-config configs variables  list --values --config-name=EXAMPLE_ENVIRONMENT
NAME               UPDATE_TIME                     VALUE
PAYPAL_SECRET_KEY  2018-05-20T09:53:09.683262561Z  NOTREAL1234!@#$
STRIPE_SECRET_KEY  2018-05-20T09:53:11.383980095Z  YESREAL1234!@#$
~~~

Now we can simply deploy:

~~~ bash
$ gcloud beta functions deploy testRuntimeConfig--trigger-http
~~~

Test it:
~~~ bash
$ curl https://<YOUR_PROJECT>.cloudfunctions.net/testRuntimeConfig
~~~

Cleanup:
~~~ bash
$ gcloud beta functions delete testRuntimeConfig 
~~~
