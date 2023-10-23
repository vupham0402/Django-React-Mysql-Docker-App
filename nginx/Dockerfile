FROM nginx
LABEL "Project"="Market Basket"

# Set the working directory
WORKDIR /usr/src/app

RUN rm -rf /etc/nginx/conf.d/default.conf
COPY nginxmarket.conf /etc/nginx/conf.d/marketapp.conf
