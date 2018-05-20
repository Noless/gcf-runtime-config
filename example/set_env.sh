#!/bin/bash
gcloud beta runtime-config configs create EXAMPLE_ENVIRONMENT 
gcloud beta runtime-config configs variables \
    set PAYPAL_SECRET_KEY "NOTREAL1234!@#$" \
    --config-name EXAMPLE_ENVIRONMENT \
    --is-text
gcloud beta runtime-config configs variables \
    set STRIPE_SECRET_KEY "YESREAL1234!@#$" \
    --config-name EXAMPLE_ENVIRONMENT \
    --is-text
