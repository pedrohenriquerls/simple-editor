#!/bin/bash
bower install --allow-root
npm install
echo "Initializing server for $1"
grunt serve:$1
