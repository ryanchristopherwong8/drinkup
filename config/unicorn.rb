app_dir = "/home/vagrant/project/drinkup"
shared_dir = "/home/vagrant"
working_directory app_dir
 
worker_processes 2
preload_app true
timeout 30
 
listen "/tmp/unicorn.sock", :backlog => 64
 
stderr_path "#{shared_dir}/unicorn.stderr.log"
stdout_path "#{shared_dir}/unicorn.stdout.log"
pid "#{shared_dir}/unicorn.pid"