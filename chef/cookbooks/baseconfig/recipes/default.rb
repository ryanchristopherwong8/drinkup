# Make sure the Apt package lists are up to date, so we're downloading versions that exist.
cookbook_file "apt-sources.list" do
  path "/etc/apt/sources.list"
end
execute 'apt_update' do
  command 'apt-get update'
end

# Base configuration recipe in Chef.
package "wget"
package "ntp"
cookbook_file "ntp.conf" do
  path "/etc/ntp.conf"
end
execute 'ntp_restart' do
  command 'service ntp restart'
end

execute 'image_update' do
  command 'sudo apt-get update'
end
execute 'image_install' do
  command 'sudo apt-get -y install imagemagick'
end
execute 'g++_install' do
	command 'sudo apt-get -y install g++'
end

#installing web server nginx
package "nginx"
#install and set up postgres database
package "postgresql"
package "libpq-dev"
execute 'echo "CREATE DATABASE drinkup_production; CREATE USER vagrant; GRANT ALL PRIVILEGES ON DATABASE drinkup_production TO vagrant;" | sudo -u postgres psql'

#add default cookbook_file
cookbook_file "nginx-default" do
	path "/etc/nginx/sites-available/default"
end

execute "nginx_restart" do 
	command "service nginx restart"
end

#Rails setup
package "ruby-dev"
package "zlib1g-dev"
package "nodejs"

execute 'bundler install' do
	command 'gem install bundler --conservative'
end

execute 'bundle' do
	command 'bundle install'
	cwd 'home/vagrant/project/drinkup'
	user 'vagrant'
end

execute 'migrate' do
	command 'rake db:migrate RAILS_ENV=production'
	cwd 'home/vagrant/project/drinkup'
	user 'vagrant'
end

execute 'precompile_assets' do
	command 'RAILS_ENV=production bundle exec rake assets:precompile'
	cwd 'home/vagrant/project/drinkup'
	user 'vagrant'
end

#setting up unicorn stuff
cookbook_file "unicorn_rails" do
	path "/etc/init.d/unicorn_rails"
end

execute "permissions" do 
	command "chmod +x /etc/init.d/unicorn_rails"
end

execute 'unicorn' do
	command 'update-rc.d unicorn_rails defaults'
end

execute 'startup' do
	command 'service unicorn_rails start'
end

execute 'start_thin' do
	command 'RAILS_ENV=production bundle exec rackup private_pub.ru -s thin -E production --daemonize'
	cwd 'home/vagrant/project/drinkup'
	user 'vagrant'
end