FROM mysql:8.0.28
LABEL "Project"="Market Basket"

# Set the working directory
WORKDIR /usr/src/app

ENV MYSQL_ROOT_PASSWORD="root"
ENV MYSQL_DATABASE="market_basket"

ADD market_basket.sql docker-entrypoint-initdb.d/market_basket.sql