FROM nginx:1.27-alpine

# Custom server config tuned for static portfolio hosting.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Website assets.
COPY . /usr/share/nginx/html

EXPOSE 80

ENTRYPOINT ["nginx"]
CMD ["-g", "daemon off;"]
