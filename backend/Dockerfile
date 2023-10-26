# Use an official Python runtime as a parent image
FROM python:3.7.2

# Set the working directory
WORKDIR /usr/src/app

# Copy and install the project's dependencies
COPY requirements.txt .
RUN python -m pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt


# Copy the rest of the application code
COPY . .

# Expose port 8000
EXPOSE 8000

# Define the command to start the Django server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]