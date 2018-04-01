FROM node:8

COPY . /home/rover
WORKDIR /home/rover

# Add user:
RUN groupadd -g 901 rover \
	&& useradd -ru 901 -g rover rover \
	&& chmod -R 755 /home/rover \
	&& chown -R rover:rover /home/rover

USER rover

RUN npm run build

EXPOSE 8000

CMD ["node", "server.js"]  # Starting up RW server