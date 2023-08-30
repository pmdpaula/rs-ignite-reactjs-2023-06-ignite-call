# Use the official MySQL image as the base image
FROM mysql:latest

# Set environment variables
ENV MYSQL_ROOT_PASSWORD=ignitecall

# Expose the MySQL port
EXPOSE 3306

# Start MySQL server as a daemon (background process)
CMD ["mysqld"]
