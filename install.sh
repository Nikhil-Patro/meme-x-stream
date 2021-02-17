curl -fsSL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get install -y nodejs
nodejs -v
# sudo apt-get install -y postgresql postgresql-contrib
# Create the file repository configuration:
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
# Import the repository signing key:
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
# Update the package lists:
sudo apt-get update
# Install the latest version of PostgreSQL.
# If you want a specific version, use 'postgresql-12' or similar instead of 'postgresql':
sudo apt-get -y install postgresql
sudo -u postgres psql -c "DROP DATABASE IF EXISTS memedb"
sudo -u postgres psql -c "CREATE DATABASE memedb;"
sudo -u postgres psql -c "ALTER USER postgres PASSWORD '1234';"