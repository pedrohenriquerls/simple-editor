FROM node

# Bower dependencies
RUN \
  apt-get update && \
  apt-get install -y ruby ruby-dev && \
  rm -rf /var/lib/apt/lists/*
RUN gem install compass
RUN npm install -g bower

# Grunt deps
RUN npm install -g grunt-cli

#paths
ENV editor /var/editor
RUN mkdir $editor
WORKDIR $editor
VOLUME $editor
